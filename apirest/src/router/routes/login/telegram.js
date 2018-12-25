const passport = require('../../../middlewares/passport');

module.exports = (app, db) => {

    app.get('/auth/telegram',
        passport.authenticate('telegram'),
        function(req, res) {
            // The request will be redirected to telepass.me for authentication,
            // so this function will not be called.
        }
    );

    app.get('/auth/telegram/callback',
        passport.authenticate('telegram', { failureRedirect: '/login' }),
        // function(req, res) {
        //     // Successful authentication, redirect home.
        //     res.redirect('/');
        // }
        async(req, res, next) => {
            // Authentication with Telegram successful
            try {
                console.log('req: ', req);

                //let user = await db.users.findOne({ where: { email: req.user.username } });

                if (!user) {
                    // New user

                    // let user = await db.users.create({
                    //     name: req.user.displayName,
                    //     email: req.user.username,
                    //     password: ':)',
                    //     status: 4
                    // });

                    // await db.social_networks.create({
                    //     userId: user.id,
                    //     telegram: user.email
                    // });

                    return res.status(200).json({
                        ok: true,
                        user: {
                            id: user.id,
                            name: user.name
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