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
    app.get("/application", checkToken, async(req, res, next) => {
        const body = req.body;

        try {
            res.status(200).json({
                ok: true,
                application: await db.applications.findOne({
                    include: [{
                        model: db.offers,
                        where: { id: body.fk_offer }
                    }],
                    where: { userId: body.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
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
                        body.fk_offer.push(offers[i].id);
                    }
                }

                res.status(201).json({
                    ok: true,
                    application: await applicant.setOffers(body.fk_offer)
                });
            } else {
                res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err });
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
                res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
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
                    application: await application.destroy(body.fk_offer)
                });
            } else {
                res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};