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
            // Authentication with Instagram successful
            try {
                console.log('req: ', req);

                let user = await db.users.findOne({ where: { email: req.user.username } });

                if (!user) {
                    // New user

                    // let user = await db.users.create({
                    //     name: req.user.displayName,
                    //     email: req.user.username,
                    //     password: ':)'
                    // });

                    return res.status(200).json({
                        ok: true,
                        user: {
                            name: user.name,
                            email: user.email
                        }
                    });

                } else {
                    // Existent user
                    res.redirect('/');
                }
            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });

}