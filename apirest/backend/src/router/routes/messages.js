const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD message ======
// ============================

module.exports = (app, db) => {
    // GET all messages
    app.get("/messages", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                messages: await db.messages.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one message by two id's
    app.get("/message/:fk_sender([0-9]+)/:fk_receiver([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                message: await db.messages.findOne({
                    where: { fk_sender: params.fk_sender, fk_receiver: params.fk_receiver }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one message by one id
    app.get("/message/:fk_sender([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                message: await db.messages.findAll({
                    where: { fk_sender: params.fk_sender }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single message
    app.post("/messages", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;
        const fk_receiver = body.fk_sender;

        try {
            let sender = await db.users.findOne({
                where: { userId: body.fk_sender }
            });

            if (sender) {

                let messages = (await sender.getMessages());

                if (messages.length > 0) {
                    for (let i = 0; i < messages.length; i++) {
                        if (body.fk_receiver != messages[i].id) {
                            body.fk_receiver.push(messages[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                error: "Message already added"
                            });
                        }
                    }
                }

                res.status(201).json({
                    ok: true,
                    message: await sender.setMessages(body.fk_receiver)
                });

                await db.sequelize.query({ query: `UPDATE messages SET message = ? WHERE fk_sender = ? AND fk_receiver = ?`, values: [body.message, body.fk_sender, fk_receiver] });

            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Message doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // PUT single message
    app.put("/messages", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let sender = await db.users.findOne({
                where: { userId: body.fk_sender }
            });

            if (sender) {
                await db.sequelize.query({ query: `UPDATE messages SET message = ? WHERE fk_sender = ? AND fk_receiver = ?`, values: [body.message, body.fk_sender, fk_receiver] });
                res.status(200).json({
                    ok: true,
                    message: 'Updated'
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Message doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single message
    app.delete("/messages", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let sender = await db.users.findOne({
                where: { userId: body.fk_sender }
            });

            if (sender) {
                await sender.removeMessages(body.fk_receiver);

                res.status(201).json({
                    ok: true,
                    message: "Deleted"
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "This message doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};