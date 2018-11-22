const env = require('../../../tools/constants');
const passport = require('../../../middlewares/passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(env.CLIENT_ID);

module.exports = (app, db) => {

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

}