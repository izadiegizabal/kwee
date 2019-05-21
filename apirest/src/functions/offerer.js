const {logger, sendVerificationEmail, deleteFile, uploadImg, saveLogES, checkImg} = require('../shared/functions');
const elastic = require('../database/elasticsearch');
const bcrypt = require('bcryptjs');

async function createOfferer(req, res, next, db, regUser, id) {
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logger.saveLog('POST', 'offerer', null, res, req.useragent, ip, null);

        const body = req.body;
        delete body.root;
        let user = {};
        body.name ? user.name = body.name : null;
        body.bio ? user.bio = body.bio : null;
        body.lat ? user.lat = body.lat : null;
        body.lon ? user.lon = body.lon : null;
        var uservar;
        saveLogES('POST', 'offerer', body.name);
        
        if (body.img && checkImg(body.img)) {
            
            if( regUser ){
                // users comming from normal singup
                body.password ? user.password = bcrypt.hashSync(body.password, 10) : null;
                body.email ? user.email = body.email : null;

                return db.sequelize.transaction(transaction => {
                    var imgName = uploadImg(req, res, next, 'offerers');
                    user.img = imgName;
                    return db.users.create(user, {transaction})
                    .then(async _user => {
                        uservar = _user;
                        return newOfferer(body, _user, next, transaction, db);
                    })
                    .then(async ending => {
                        await sendVerificationEmail(body, uservar);
                        delete body.password;
                        delete body.img;
                        delete body.cif;
                        delete lon;
                        delete lat;
                        body.index = 15;
                        body.companySize = 0;
                        body.year = null;
                        body.dateVerification = null;
                        body.status = 0;
                        
                        elastic.index({
                            index: 'offerers',
                            type: 'offerer',
                            id: uservar.id,
                            body
                        }, function (err, resp, status) {
                            if (err) {
                                console.log(err.message);
                            }
                        });
                        
                        
                        return res.status(201).json({
                            ok: true,
                            message: `Offerer with id ${ending.userId} has been created.`
                        });
                    })
                }).catch(err => {
                    deleteFile('uploads/offerers/' + user.img);
                    return next({type: 'error', error: err.message});
                });
            } else {
                // users comming from social networks
                return db.sequelize.transaction(transaction => {
                    var imgName = uploadImg(req, res, next, 'offerers');
                    user.img = imgName;
                    return db.users.update(user, { where: { id }}, { transaction })
                        .then(async _user => {
                            uservar = _user;
                            return newOfferer(body, _user, next, transaction, db, id);
                        })
                        .then(async ending => {
                            await sendVerificationEmail(body, uservar);
                            delete body.password;
                            delete body.img;
                            delete body.cif;
                            delete lon;
                            delete lat;
                            body.index = 15;
                            body.companySize = 0;
                            body.year = null;
                            body.dateVerification = null;
                            body.status = 0;
    
                            elastic.index({
                                index: 'offerers',
                                type: 'offerer',
                                id: uservar.id,
                                body
                            }, function (err, resp, status) {
                                if (err) {
                                    console.log(err.message);
                                }
                            });
    
    
                            return res.status(201).json({
                                ok: true,
                                message: `Offerer with id ${ending.userId} has been created.`
                            });
                        })
                }).catch(err => {
                        deleteFile('uploads/offerers/' + user.img);
                        return next({type: 'error', error: err.message});
                    });
            }
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Bussines picture is required'
            });
        }

    } catch (err) {
        //await transaction.rollback();
        return next({type: 'error', error: err.message});
    }
}

async function newOfferer(body, user, next, transaction, db, id) {
    try {
        let offerer = {
            userId: user.id || id,
            address: body.address,
            workField: body.workField,
            cif: body.cif,
            website: body.website ? body.website : null,
            companySize: body.companySize ? body.companySize : null,
            year: body.year ? body.year : null,
        };

        return db.offerers.create(offerer, {transaction: transaction})
            .catch(err => {
                return next({type: 'error', error: err.message});
            });


    } catch (err) {
        await transaction.rollback();
        next({type: 'error', error: err.message});
    }
}

module.exports = {
    createOfferer
}