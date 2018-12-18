const passport = require('../../../middlewares/passport');

module.exports = (app, db) => {

    app.get('/auth/linkedin',
        passport.authenticate('linkedin'),
        function(req, res) {
            // The request will be redirected to LinkedIn for authentication, so this
            // function will not be called.
        });

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login' }),
        async(req, res, next) => {
            let email = req.user.emails[0].value;
            let user;
            // Authentication with LinkedIn successful

            try {

                for (let i = 0; i < req.user.emails.length; i++) {
                    user = await db.users.findOne({ where: { email: req.user.emails[i].value } });
                    if (user) {
                        // User in database
                        res.redirect('/');
                        break;
                    }
                }

                if (!user) {
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

                    return res.status(200).json({
                        ok: true,
                        user: {
                            id: user.id,
                            name: user.name
                        }
                    });
                }

            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });

}