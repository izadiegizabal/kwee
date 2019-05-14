const passport = require('../../../middlewares/passport');
const querystring = require('querystring');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');
const moment = require('moment');
const {logger} = require('../../../shared/functions');
var type;

module.exports = (app, db) => {

    app.get('/auth/github',
        passport.authenticate('github', {scope: ['user:email']})
    ), (req, res) => {
        type = req.params.type;
    };

    app.get('/auth/github/callback',
        passport.authenticate('github', {failureRedirect: '/login'}),

        async (req, res, next) => {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // Authentication with Github successful
            try {

                let user = await db.users.findOne({ where: { email: req.user._json.email }});

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
                        github: user.email
                    });

                    let token = auth.auth.encode(user);
                    const query = `token=${token}&id=${user.id}&name=${user.name}&email=${user.email}`;

                    res.redirect(env.SIGNUP + query);

                } else {
                    // Existent user
                    let logId = await logger.saveLog('POST', 'login', null, res, req.useragent, ip, user.email);
                    console.log("Este email ya existe en la BBDD");
                    console.log('Haciendo login en el sistema');
                    console.log('id: ', user.id);
                    

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
                                return next({type: 'error', error: 'This user is not applicant, offerer neither admin'});
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
                return next({type: 'error', error: err.message});
            }
        });

};
