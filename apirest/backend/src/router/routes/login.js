const env = require('../../tools/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

}