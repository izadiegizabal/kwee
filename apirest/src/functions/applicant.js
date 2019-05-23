const {logger, sendVerificationEmail, saveLogES, getOffererAVG, getApplicantAVG} = require('../shared/functions');
const elastic = require('../database/elasticsearch');
const auth = require('../middlewares/auth/auth');
const bcrypt = require('bcryptjs');

async function createApplicant(req, res, next, db, regUser, id) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        await logger.saveLog('POST', 'applicant', null, res, req.useragent, ip, null);

        const body = req.body;
        delete body.root;
        let user = {};
        
        body.name ? user.name = body.name : null;
        body.bio ? user.bio = body.bio : null;
        body.lat ? user.lat = body.lat : null;
        body.lon ? user.lon = body.lon : null;
        var uservar;
        saveLogES('POST', 'applicant', body.name);

        if ( regUser ) {
            body.password ? user.password = bcrypt.hashSync(body.password, 10) : null;
            body.email ? user.email = body.email : null;
            return db.sequelize.transaction(transaction => {
                return db.users.create(user, {transaction: transaction})
                .then(async user => {
                    uservar = user;
                    return newApplicant(body, user, next, transaction, db);
                })
                .then(async ending => {
                    sendVerificationEmail(body, uservar);
                    delete body.password;
                    delete lon;
                    delete lat;
                    body.index = 15;
                    
                    elastic.index({
                        index: 'applicants',
                        id: uservar.id,
                        type: 'applicant',
                        body
                    }, function (err, resp, status) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    // await algorithm.indexUpdate(ending.userId);
                    
                    return res.status(201).json({
                        ok: true,
                        message: `Applicant with id ${ending.userId} has been created.`
                    });
                })
            })
            .catch(err => {
                return next({type: 'error', error: err.message});
            });
        } else {
            return db.sequelize.transaction(transaction => {
                return db.users.update(user, { where: { id }}, {transaction: transaction})
                .then(async user => {
                    console.log('en el async');
                    
                    uservar = {
                        city: body.city,
                        dateBorn: body.dateBorn,
                        premium: body.premium,
                        rol: body.rol
                    };
                    
                    return newApplicant(uservar, user, next, transaction, db, id);
                })
                .then(async ending => {
                    sendVerificationEmail(body, uservar);
                    delete body.password;
                    delete lon;
                    delete lat;
                    body.index = 15;
                    
                    elastic.index({
                        index: 'applicants',
                        id: uservar.id,
                        type: 'applicant',
                        body
                    }, function (err, resp, status) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    // await algorithm.indexUpdate(ending.userId);
                    // devolver lo mismo que en el login
                    let dateNow = moment().format();

                    await db.users.update({ lastAccess: dateNow }, {
                        where: { id }
                    });

                    let userUpdated = await db.users.findOne({ where: { id }});

                    delete userUpdated.dataValues.password;

                    let notifications = await db.notifications.findAll({where: {to: id, read: false}});

                    notifications ? notifications = notifications.length : notifications = 0;

                    let token = auth.auth.encode(userUpdated);

                    if (userUpdated.root) {
                        type = 'admin';
                    } else {
                        var premium;
                        var avg = {};
                        let offerer = await db.offerers.findOne({
                            where: {userId: id}
                        });
                        if (offerer) {
                            avg = getOffererAVG(offerer);
                            premium = offerer.premium;
                            type = 'offerer';
                        } else {
                            let applicant = await db.applicants.findOne({
                                where: {userId: id}
                            });
                            if ( applicant ) {
                                avg = getApplicantAVG(applicant);
                                premium = applicant.premium;
                                type = 'applicant';
                            } else {
                                avg = null;
                                premium = null;
                                type = null;
                            }
                        }
                    }
                    return res.json({
                        ok: true,
                        message: `Login successful`,
                        data: {
                            id: userUpdated.id,
                            name: userUpdated.name,
                            email: userUpdated.email,
                            img: userUpdated.img,
                            bio: userUpdated.bio,
                            lastAccess: userUpdated.lastAccess,
                            index: userUpdated.index,
                            avg,
                            premium,
                            status: userUpdated.status,
                            notifications,
                            type
                        },
                        token
                    });
                })
            })
            .catch(err => {
                return next({type: 'error', error: err.message});
            });
        }

    } catch (err) {
        return next({type: 'error', error: err.message});
    }
}

async function newApplicant(body, user, next, transaction, db, id) {
    try {
        let applicant = {};

        applicant.userId = user.id || id;
        applicant.city = body.city ? body.city : null;
        applicant.dateBorn = body.dateBorn ? body.dateBorn : null;
        applicant.premium = body.premium ? body.premium : null;
        applicant.rol = body.rol ? body.rol : null;

        console.log('applicant: ', applicant);
        

        return db.applicants.create(applicant, {transaction: transaction})
            .catch(err => {
                return next({type: 'error', error: err.message});
            });

    } catch (err) {
        await transaction.rollback();
        return next({type: 'error', error: err.errors ? err.errors[0].message : err.message});
    }
}

module.exports = {
    createApplicant
}