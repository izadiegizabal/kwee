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
    app.get("/applications/:userId/:offerId", checkToken, async(req, res, next) => {
        const userId = +req.params.userId;
        const offerId = +req.params.offerId;
        try {
            res.status(200).json({
                ok: true,
                application: await db.users.findOne({
                    include: [{
                        model: db.offers,
                        where: { id: offerId }
                    }],
                    where: { id: userId }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single application
    app.post("/applications", [checkToken, checkAdmin], async(req, res, next) => {
        const applicantId = req.body.applicantId;
        const offerId = req.body.offerId;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: applicantId }
            });

            if (applicant) {

                let offers = (await applicant.getOffers());

                if (offers.length > 0) {
                    for (let i = 0; i < offers.length; i++) {
                        offerId.push(offers[i].id);
                    }
                }

                res.status(201).json({
                    ok: true,
                    application: await applicant.setOffers(offerId)
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
        const id = req.body.id;
        const offer = req.body.offerId;
        const status = req.body.status;

        try {
            let user = await db.users.findOne({
                where: { id }
            });

            let application = await user.setOffers(offer);
            await db.sequelize.query({ query: `UPDATE applications SET status=\'${ status }\' WHERE userId = ? AND offerId = ?`, values: [id, offer] });
            res.json(application);
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single application
    app.delete("/applications", async(req, res) => {
        const id = req.body.id;
        const offer = req.body.offerId;

        try {
            let user = await db.users.findOne({
                where: { id }
            });
            res.json({
                ok: true,
                application: await user.destroy(offer)
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};