const Log = require('../../models/logs');

module.exports = (app, db) => {
    // POST new log
    app.post("/log", async(req, res, next) => {

        let body = req.body;

        let log = new Log({
            action: body.action
        });

        log.save((err, logDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: "Log not create"
                });
            }

            // Not necessary status(200) it's implicit
            res.json({
                ok: true,
                log: logDB
            });

        });

    });
}