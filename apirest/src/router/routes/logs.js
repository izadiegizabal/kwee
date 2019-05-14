const Log = require('../../models/logs');

module.exports = (app, db) => {
    // GET all logs
    app.get("/logs", async (req, res, next) => {

        let from = req.query.from || 0;
        from = Number(from);

        let to = req.query.to || 10;
        to = Number(to);

        Log.find({}, 'action actionToRoute')
            .skip(from)
            .limit(to)
            .exec((err, logs) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Log.countDocuments({}, (err, count) => {
                    res.json({
                        ok: true,
                        logs,
                        total: count
                    });
                });

            });
    });

    app.get("/logs/:id", (req, res, next) => {
        showUserLog( req, res, next );
    });

    app.delete('/log/:id', async (req, res, next) => {

        let id = req.params.id;

        Log.findByIdAndRemove(id, (err, logDeleted) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!logDeleted) {
                return res.status(200).json({
                    ok: true,
                    message: 'Log not found'

                });
            }


            res.json({
                ok: true,
                log: logDeleted
            })

        });

    });

    async function showUserLog( req, res, next ) {
        let from = req.query.from || 0;
        let to = req.query.to || 10;
        
        from = Number(from);
        to = Number(to);

        let userId = req.params.id;

        Log.find({ userId })
            .skip(from)
            .limit(to)
            .sort({date: 'desc', hour: 'desc'})
            .exec(( err, logs ) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    });
                }

                Log.countDocuments({ userId }, (err, count) => {
                    res.json({
                        ok: true,
                        logs,
                        total: count
                    });
                });

            });
    }

};
