const passport = require('../../../middlewares/passport');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');
const moment = require('moment');
const {logger} = require('../../../shared/functions');

var typeToFront;

module.exports = (app, db) => {

    app.get('/auth/twitter',
        passport.authenticate('twitter')
    ), (req, res) => {
        typeToFront = req.query.type;
    };

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/login'}),
        async (req, res, next) => {
            // Authentication with Instagram successful
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            try {

                let user = await db.users.findOne({where: {email: req.user._json.email}});

                if (!user) {
                    // New user
                    user = await db.users.create({
                        name: req.user.displayName,
                        email: req.user._json.email,
                        password: ':)',
                        snSignIn: true,
                        status: 4
                    });

                    await db.social_networks.create({
                        userId: user.id,
                        twitter: user.email
                    });

                    let token = auth.auth.encode(user);
                    const query = `token=${token}&id=${user.id}&name=${user.name}&email=${user.email}&type=${typeToFront}`;

                    res.redirect(env.SIGNUP + query);

                    return res.status(200).json({
                        ok: true,
                        user: {
                            id: user.id,
                            name: user.name
                        }
                    });

                }  else {
                    // Existent user
                    let logId = await logger.saveLog('POST', 'login', null, res, req.useragent, ip, user.email);

                    let type;
                    let id = user.id;
                    let dateNow = moment().format();

                    await db.users.update({ lastAccess: dateNow }, {
                        where: { id }
                    });

                    let userUpdated = await db.users.findOne({ where: { id }});

                    delete userUpdated.dataValues.password;

                    let notifications = await db.notifications.findAll({ where: { to: id, read: false }});

                    notifications ? notifications = notifications.length : notifications = 0;

                    let token = auth.auth.encode(userUpdated);
                    logger.updateLog(logId, true, id);

                    if ( user.root ) {
                        type = 'admin';
                    } else {
                        var avg = {};
                        let offerer = await db.offerers.findOne({
                            where: { userId: id }
                        });
                        if (offerer) {
                            avg = getOffererAVG(offerer);
                            type = 'offerer';
                        } else {
                            let applicant = await db.applicants.findOne({
                                where: { userId: id }
                            });
                            if ( applicant ) {
                                avg = getApplicantAVG(applicant);
                                type = 'applicant';
                            } else {
                                avg = null;
                                type = null;
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
                }
            } catch (err) {
                next({type: 'error', error: 'Error getting data'});
            }
        });
};
