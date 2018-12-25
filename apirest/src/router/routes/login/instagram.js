const passport = require('../../../middlewares/passport');

module.exports = (app, db) => {

    app.get('/auth/instagram',
        passport.authenticate('instagram'));

    app.get('/auth/instagram/callback',
        passport.authenticate('instagram', { failureRedirect: '/login' }),

        async(req, res, next) => {
            // Authentication with Instagram successful
            try {

                let user = await db.users.findOne({ where: { email: req.user.username } });

                if (!user) {
                    // New user
                    let user = await db.users.create({
                        name: req.user.displayName,
                        email: req.user.username,
                        password: ':)',
                        snSignIn: true,
                        status: 4
                    });

                    await db.social_networks.create({
                        userId: user.id,
                        instagram: user.email
                    });

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