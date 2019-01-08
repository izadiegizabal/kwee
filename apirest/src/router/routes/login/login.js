const env = require('../../../tools/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const auth = require('../../../middlewares/auth/auth');
const { logger } = require('../../../shared/functions');

module.exports = (app, db) => {

    app.post('/login', async(req, res, next) => {
        await logger.saveLog('POST', 'login', null, res, req.body.email);

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

            let id = user.id;
            let dateNow = moment().format();

            await db.users.update({ lastAccess: dateNow }, {
                where: { id }
            });

            let userUpdated = await db.users.findOne({ where: { id } })

            delete userUpdated.dataValues.password;

            let token = auth.auth.encode(userUpdated);

            return res.json({
                ok: true,
                user: userUpdated,
                token
            });

        } catch (err) {
            console.log(err);
            next({ type: 'error', error: 'Error getting data' });
        }
    });

}