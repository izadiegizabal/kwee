const passport = require('../../../middlewares/passport');
const querystring = require('querystring');
const auth = require('../../../middlewares/auth/auth');

module.exports = (app, db) => {

    app.get('/auth/github',
        passport.authenticate('github', { scope: ['user:email'] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),

        async(req, res, next) => {
            // Authentication with Instagram successful
            try {

                let user = await db.users.findOne({ where: { email: req.user._json.email } });

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

                    // const query = querystring.stringify({
                    //         user: user.id,
                    //         name: user.name,
                    //         email: user.email
                    // });
                    let token = 'token=' + auth.auth.encode(user);
                    res.redirect('http://h203.eps.ua.es/signup?' + token);

                } else {
                    // Existent user
                    console.log("Este email ya existe en la BBDD");
                    res.redirect('/');
                }
            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });

}