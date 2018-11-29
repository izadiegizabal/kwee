const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD applicant_education ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_educations
    app.get("/applicant_educations", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                applicant_educations: await db.applicant_educations.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one applicant_education by two id's
    app.get("/applicant_education/:fk_applicant([0-9]+)/:fk_education([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_education: await db.applicant_educations.findOne({
                    // include: [{
                    //     model: db.educations,
                    //     where: { fk_education: params.fk_education }
                    // }],
                    where: { fk_applicant: params.fk_applicant, fk_education: params.fk_education }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one applicant_education by one id
    app.get("/applicant_education/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_education: await db.applicant_educations.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // POST single applicant_education
    app.post("/applicant_educations", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                let educations = (await applicant.getEducations());

                if (educations.length > 0) {
                    for (let i = 0; i < educations.length; i++) {
                        if (body.fk_education != educations[i].id) {
                            body.fk_education.push(educations[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                error: "Applicant language already added"
                            });
                        }
                    }
                }

                res.status(201).json({
                    ok: true,
                    applicant_education: await applicant.setEducations(body.fk_education)
                });

                await db.sequelize.query({ query: `UPDATE applicant_educations SET level = ? WHERE fk_applicant = ? AND fk_education = ?`, values: [body.level, body.fk_applicant, body.fk_education] });

            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant language doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err });
        }

    });

    // PUT single applicant_education
    app.put("/applicant_educations", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await db.sequelize.query({ query: `UPDATE applicant_educations SET level=\'${ body.level }\' WHERE fk_applicant = ? AND fk_education = ?`, values: [body.fk_applicant, body.fk_education] });
                res.status(200).json({
                    ok: true,
                    message: 'Updated'
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant language doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single applicant_education
    app.delete("/applicant_educations", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await applicant.removeEducations(body.fk_education);

                res.status(201).json({
                    ok: true,
                    message: "Deleted"
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    error: "This Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err });
        }

    });
};