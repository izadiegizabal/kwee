const passport = require('../../../middlewares/passport');

module.exports = (app, db) => {

    app.get('/auth/github',
        passport.authenticate('github', { scope: ['user:email'] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),

        // function(req, res) {
        //     // Successful authentication, redirect home.
        //     console.log('logged with GitHub !!!!!!');
        //     res.redirect('/');
        // });

        async(req, res, next) => {
            // Authentication with Instagram successful
            try {

                let user = await db.users.findOne({ where: { email: req.user._json.email } });

                if (!user) {
                    // New user
                    let user = await db.users.create({
                        name: req.user.displayName,
                        email: req.user._json.email,
                        password: ':)'
                    });

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