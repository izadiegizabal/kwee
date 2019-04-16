const { logger, tokenId, getOffererAVG, getApplicantAVG } = require('../../../shared/functions');
const auth = require('../../../middlewares/auth/auth');
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = (app, db) => {

    app.post('/login', async (req, res, next) => {
        let logId = await logger.saveLog('POST', 'login', null, res, req.body.email);
        let user;
        let body = req.body;
        
        try {
                
            if ( body.email ) {
                user = await db.users.findOne({where: {email: body.email}});
            } else if ( body.token ) {
                console.log("hay token");
                var idToken = tokenId.getTokenId(body.token);
                console.log('despues del id token');
                user = await db.users.findOne({where: { id: idToken }});
            } else {
                return next({type: 'error', error: 'Error getting data'});
            }


            if (!user) {
                logger.updateLog(logId, false);
                return res.status(400).json({
                    ok: false,
                    message: 'User or password incorrect'
                });
            }

            if (!bcrypt.compareSync(body.password, user.password)) {
                logger.updateLog(logId, false);
                return res.status(400).json({
                    ok: false,
                    message: 'User or password incorrect'
                });
            }

            let type;
            let id = user.id;
            let dateNow = moment().format();

            await db.users.update({lastAccess: dateNow}, {
                where: { id }
            });

            let userUpdated = await db.users.findOne({ where: { id }});

            delete userUpdated.dataValues.password;

            let notifications = await db.notifications.findAll({where: {to: id, read: false}});

            notifications ? notifications = notifications.length : notifications = 0;

            let token = auth.auth.encode(userUpdated);
            logger.updateLog(logId, true, id);

            if (user.root) {
                type = 'admin';
            } else {
                var avg = {};
                let offerer = await db.offerers.findOne({
                    where: {userId: id}
                });
                if (offerer) {
                    avg = getOffererAVG(offerer);
                    type = 'offerer';
                } else {
                    let applicant = await db.applicants.findOne({
                        where: {userId: id}
                    });
                    if ( applicant ) {
                        avg = getApplicantAVG(applicant);
                        type = 'applicant';
                    } else {
                        return next({type: 'error', error: 'User not found'});
                    }
                }
            }

            return res.json({
                ok: true,
                message: 'Login successful',
                data: {
                    id: userUpdated.id,
                    name: userUpdated.name,
                    email: userUpdated.email,
                    img: userUpdated.img,
                    bio: userUpdated.bio,
                    lastAccess: userUpdated.lastAccess,
                    index: userUpdated.index,
                    avg,
                    status: userUpdated.status,
                    notifications,
                    type
                },
                token
            });

        } catch (err) {
            if (err.message == 'Invalid token') {
                return next({type: 'error', error: 'Invalid token'});
            }
            return next({type: 'error', error: err.message});
        }
    });

};
