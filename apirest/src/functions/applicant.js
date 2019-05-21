const {logger, sendVerificationEmail, saveLogES} = require('../shared/functions');
const elastic = require('../database/elasticsearch');
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
            console.log('creando applicant desde else');
            console.log('user: ', user);
            
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
                    
                    return res.status(201).json({
                        ok: true,
                        message: `Applicant with id ${ending.userId} has been created.`
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