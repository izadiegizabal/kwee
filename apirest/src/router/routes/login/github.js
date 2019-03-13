const passport = require('../../../middlewares/passport');
const querystring = require('querystring');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');

module.exports = (app, db) => {

    app.get('/auth/github',
        passport.authenticate('github', { scope: ['user:email'] })
    );

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),

        async(req, res, next) => {
            // Authentication with Github successful
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

                    let token = auth.auth.encode(user);
                    const query = `token=${token}&id=${user.id}&name=${user.name}&email=${user.email}`;
                    
                    // JSON.stringify({
                    //             user: user.id,
                    //             name: user.name,
                    //             email: user.email,
                    //             token
                    //     });

                    res.redirect(env.SIGNUP + query);

                } else {
                    // Existent user
                    console.log("Este email ya existe en la BBDD");
                    res.redirect('/');
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
        });

}