const { checkToken } = require('../../../../middlewares/authentication');
const getTokenId = require('../../../../shared/functions');

// ============================
// ===== CRUD applicant_education ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_educations
    app.get("/applicant_educations",
        checkToken,
        async(req, res, next) => {
            try {
                return res.status(200).json({
                    ok: true,
                    applicant_educations: await db.applicant_educations.findAll()
                });
            } catch (err) {
                return next({ type: 'error', error: 'Error getting data' });
            }
        });

    // GET one applicant_education by two id's
    app.get("/applicant_education/:fk_applicant([0-9]+)/:fk_education([0-9]+)",
        checkToken,
        async(req, res, next) => {
            const params = req.params;

            try {
                return res.status(200).json({
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
                return next({ type: 'error', error: err });
            }
        });

    // GET one applicant_education by one id
    app.get("/applicant_education/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            return res.status(200).json({
                ok: true,
                applicant_education: await db.applicant_educations.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            return next({ type: 'error', error: err });
        }
    });

    // POST single applicant_education
    app.post("/applicant_education", checkToken, async(req, res, next) => {

        const body = req.body;
        let fk_education = body.fk_education;
        let id = getTokenId.tokenId.getTokenId(req.get('token'));


        if (fk_education.length > 1) {
            return res.status(400).json({
                ok: false,
                message: "Invalid fk_education value (array instead integer)."
            });
        }

        let applicantEducationCreated = null;

        try {
            // Find USER if exists
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            // Set educations and so
            if (applicant) {

                // Obtain what educations were known by the applicant previously
                let educationsPrevious = (await applicant.getEducations());
                //let educations;

                // Add 'id' of educations that the applicant know
                if (educationsPrevious.length > 0) {
                    for (let i = 0; i < educationsPrevious.length; i++) {
                        if (fk_education == educationsPrevious[i].id) {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this education"
                            });
                        }
                    }
                }

                // And add the array of id's to applicant_educations AND REMAINING FIELDS ON EACH EDUCATION
                //applicantEducationCreated = await applicant.setEducations(educations);
                await applicant.addEducation(fk_education, {
                    through: {
                        description: body.description,
                        date_start: body.date_start,
                        date_end: body.date_end,
                        institution: body.institution
                    }
                }).then(result => {
                    if (result) {
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
                });


            } else {
                return res.status(400).json({
                    ok: false,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            //console.log(err.toString());
            return next({ type: "error", error: err.toString() /*err.errors?err.errors[0].message:err.message*/ });
            //return "EEERRROOOOOOOR";
            //return next({ type: 'error', error: err.errors?err.errors[0].message:err.message });
        }
    });

    // PUT single applicant_education
    app.put("/applicant_education", checkToken, async(req, res, next) => {
        const body = req.body;

        let id = getTokenId.tokenId.getTokenId(req.get('token'));

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            }).then(async _applicant => {

                if (_applicant) {
                    _applicant.hasEducation(body.fk_education)
                        .then(exists => {

                            if (exists) {
                                _applicant.getEducations({ where: { id: body.fk_education } })
                                    .then(education => {

                                        let edu = education[0];

                                        if (body.description) edu.applicant_educations.description = body.description;
                                        if (body.date_end) edu.applicant_educations.date_end = body.date_end;
                                        if (body.date_start) edu.applicant_educations.date_start = body.date_start;
                                        if (body.institution) edu.applicant_educations.institution = body.institution;

                                        edu.applicant_educations.save()
                                            .then(rest => {

                                                if (rest.isRejected) {
                                                    // Problems
                                                    return res.status(400).json({
                                                        ok: false,
                                                        msg: "Education not updated."
                                                    });
                                                } else {
                                                    // Everything ok
                                                    return res.status(201).json({
                                                        ok: true,
                                                        msg: "Education updated"
                                                    });
                                                }
                                            })
                                    })
                                    .catch(err => {
                                        return next({ type: 'error', error: err.message });
                                    })
                            } else {
                                return next({ type: 'error', error: "User don't know this education (¿fk_education wrong maybe?)" });
                            }
                        })
                } else {
                    return next({ type: 'error', error: "User not found (fk_applicant unknown)" });
                }

            });
        } catch (err) {
            // More generic errors
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE single applicant_education
    app.delete("/applicant_education", checkToken, async(req, res, next) => {
        const body = req.body;

        let id = getTokenId.tokenId.getTokenId(req.get('token'));

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                await applicant.removeEducations(body.fk_education);

                return res.status(201).json({
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
            return next({ type: 'error', error: err });
        }

    });
};