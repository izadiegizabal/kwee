const passport = require('../../../middlewares/passport');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');
const moment = require('moment');
const {logger, getApplicantAVG, getOffererAVG} = require('../../../shared/functions');
var typeToFront;

module.exports = (app, db) => {

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
                    const query = `token=${token}&id=${user.id}&name=${user.name}&email=${user.email}&type=${typeToFront}`;

                    res.redirect(env.SIGNUP + query);

                } else {
                    // Existent user

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
                return next({type: 'error', error: err.message});
            }
        });

    app.get('/auth/github/:type',
        passport.authenticate('github', {scope: ['user:email']})
    ), (req, res) => {
        typeToFront = req.params.type;
    };

};
