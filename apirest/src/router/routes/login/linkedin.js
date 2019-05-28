const {getApplicantAVG, getOffererAVG} = require('../../../shared/functions');
const passport = require('../../../middlewares/passport');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');
const moment = require('moment');

module.exports = (app, db) => {

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', {failureRedirect: '/login'}),
        async (req, res, next) => {
            
            let email = req.user.emails[0].value;
            let user;
            // Authentication with LinkedIn successful

            try {
                
                for (let i = 0; i < req.user.emails.length; i++) {
                    user = await db.users.findOne({where: {email: req.user.emails[i].value}});
                    if (user) {
                        // User in database
                        res.redirect('/');
                        return null;
                    }
                }

                if ( !user ) {
                    // New user
                    let user = await db.users.create({
                        name: req.user.displayName,
                        email,
                        password: ':)',
                        snSignIn: true,
                        status: 4
                    });

                    await db.social_networks.create({
                        userId: user.id,
                        linkedin: user.email
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
                next({type: 'error', error: err.message});
            }
        });

        app.get('/auth/linkedin/:type',
                passport.authenticate('linkedin')
        );

};
