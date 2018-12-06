const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD applicant_education ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_educations
    app.get("/applicant_educations",
        checkToken,
        async(req, res, next) => {
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
    app.get("/applicant_education/:fk_applicant([0-9]+)/:fk_education([0-9]+)",
        checkToken,
        async(req, res, next) => {
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
    app.post("/applicant_education", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;
        let fk_education = body.fk_education;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                // Obtain what educations were known by the applicant previously
                let educationsPrevious = (await applicant.getEducations());

                let educations = [];

                // Add 'id' of educations that the applicant knew

                if (educationsPrevious.length > 0) {
                    for (let i = 0; i < educationsPrevious.length; i++) {
                        if (fk_education != educationsPrevious[i].id) {
                            educations.push(educationsPrevious[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this education"
                            });
                        }
                    }
                }

                // Now add the new education id to previous educations id's
                for (let i = 0; i < fk_education.length; i++) {
                    educations.push(fk_education[i]);
                }

                // And add the array of id's to applicant_educations
                let applicantEducationCreated = await applicant.setEducations(educations);

                if (applicantEducationCreated) {
                    // Last step
                    // It is necessary to update the level and description after setEducations
                    // because is added as null
                    await db.sequelize.query({ query: `UPDATE applicant_educations SET date_start = ?, date_end = ?, institution = ?, description = ? WHERE fk_applicant = ? AND fk_education = ?`, values: [body.date_start, body.date_end, body.institution, body.description, body.fk_applicant, body.fk_education] });

                    return res.status(201).json({
                        ok: true,
                        message: "Added education to applicant"
                    });

                } else {
                    return res.status(400).json({
                        ok: false,
                        error: "Applicant education can't be created"
                    });
                }

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

    // PUT single applicant_education
    app.put("/applicant_education", [checkToken, checkAdmin], async(req, res, next) => {
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
                    error: "Applicant education doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single applicant_education
    app.delete("/applicant_education", [checkToken, checkAdmin], async(req, res, next) => {
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