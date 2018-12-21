const jwt = require('jsonwebtoken');
const env = require('../../tools/constants')

module.exports = (app, db) => {
    app.get('/email-verified/:token', async(req, res, next) => {
        let token = req.params.token;

        try {
            let id = jwt.decode(token).id;

            let updated = await db.users.update({ status: 1 }, {
                where: { id }
            });

            if (updated > 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'Updated'
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: "No updates were done."
                });
            }

        } catch (err) {
            next({ type: 'error', error: (err.errors ? err.errors[0].message : err.message) });
        }
    });
}