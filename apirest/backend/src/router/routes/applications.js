const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD application ======
// ============================

module.exports = (app, db) => {
    // GET all applications
    app.get("/applications", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                applications: await db.applications.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one application by id
    app.get("/application/:fk_applicant([0-9]+)/:fk_offer([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                application: await db.applications.findOne({
                    where: { fk_applicant: params.fk_applicant, fk_offer: params.fk_offer }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one applicant_language by one id
    app.get("/application/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                application: await db.applications.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // POST single application
    app.post("/applications", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                let offers = (await applicant.getOffers());

                if (offers.length > 0) {
                    for (let i = 0; i < offers.length; i++) {
                        if (body.fk_offer != offers[i].id) {
                            body.fk_offer.push(offers[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                error: "Application already added"
                            });
                        }
                    }
                }

                res.status(201).json({
                    ok: true,
                    application: await applicant.setOffers(body.fk_offer)
                });

            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'nope' });
        }

    });

    // PUT single application
    app.put("/applications", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await db.sequelize.query({ query: `UPDATE applications SET status=\'${ body.status }\' WHERE fk_applicant = ? AND fk_offer = ?`, values: [body.fk_applicant, body.fk_offer] });
                res.status(200).json({
                    ok: true,
                    message: 'Updated'
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE single application
    app.delete("/applications", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                res.json({
                    ok: true,
                    application: await applicant.removeOffers(body.fk_offer)
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });
};