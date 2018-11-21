const env = require('../../tools/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passport = require('../../middlewares/passport');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(env.CLIENT_ID);

module.exports = (app, db) => {

    app.post('/login', async(req, res, next) => {

        let body = req.body;

        try {
            let user = await db.users.findOne({ where: { email: body.email } })

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User or password incorrect'
                    }
                });
            }

            if (!bcrypt.compareSync(body.password, user.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User or password incorrect'
                    }
                });
            }

            delete user.dataValues.password;

            let token = jwt.sign({
                user
            }, env.JSONWEBTOKEN_SECRET, { expiresIn: env.JSONWEBTOKEN_EXPIRES });

            res.json({
                ok: true,
                user,
                token
            });

        } catch (err) {
            console.log(err);
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // Google config
    async function verify(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: env.CLIENT_ID, // Specify the CLIENT_ID
            // Or, multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        const payload = ticket.getPayload();

        return {
            name: payload.name,
            email: payload.email,
            // google: true
        }

    }

    app.post('/google', async(req, res, next) => {

        let token = req.body.idtoken;

        let googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            });

        let user = await db.users.findOne({ where: { email: googleUser.email } });

        if (!user) {

            try {
                await db.users.create({
                    name: googleUser.name,
                    email: googleUser.email,
                    google: true,
                    password: ':)'
                });

                res.status(201).json({
                    ok: true,
                    message: 'Created'
                });

            } catch (err) {
                next({ type: 'error', error: err.errors[0].message });
            };

        } else {
            if (user.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Not google registration'
                    }
                });
            } else {
                let token = jwt.sign({
                    user
                }, env.JSONWEBTOKEN_SECRET, { expiresIn: env.JSONWEBTOKEN_EXPIRES });

                return res.json({
                    ok: true,
                    user: {
                        name: user.name,
                        email: user.email
                    },
                    token
                })
            }
        }
    });

    app.get('/auth/instagram', passport.authenticate('instagram'))

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