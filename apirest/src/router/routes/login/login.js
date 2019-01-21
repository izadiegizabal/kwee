const env = require('../../../tools/constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const auth = require('../../../middlewares/auth/auth');
const { logger } = require('../../../shared/functions');

module.exports = (app, db) => {

    app.post('/login', async(req, res, next) => {
        let logId = await logger.saveLog('POST', 'login', null, res, req.body.email);

        let body = req.body;

        try {
            let user = await db.users.findOne({ where: { email: body.email } })

            if (!user) {
                logger.updateLog(logId, false);
                return res.status(400).json({
                    ok: false,
                    message: 'User or password incorrect'
                });
            }

            if (!bcrypt.compareSync(body.password, user.password)) {
                logger.updateLog(logId, false);
                return res.status(400).json({
                    ok: false,
                    message: 'User or password incorrect'
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
            logger.updateLog(logId, true, id);
            return res.json({
                ok: true,
                message: 'Login successful',
                data: {
                    id: userUpdated.id,
                    name: userUpdated.name,
                    email: userUpdated.email,
                    img: userUpdated.img,
                    bio: userUpdated.bio,
                    lastAccess: userUpdated.lastAccess,
                    index: userUpdated.index,
                    status: userUpdated.status,
                },
                token
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

}