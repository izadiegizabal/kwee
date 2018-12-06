const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD applicant_language ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_languages
    app.get("/applicant_languages", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                applicant_languages: await db.applicant_languages.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one applicant_language by two id's
    app.get("/applicant_language/:fk_applicant([0-9]+)/:fk_language([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_language: await db.applicant_languages.findOne({
                    // include: [{
                    //     model: db.languages,
                    //     where: { fk_language: params.fk_language }
                    // }],
                    where: { fk_applicant: params.fk_applicant, fk_language: params.fk_language }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one applicant_language by one id
    app.get("/applicant_language/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_language: await db.applicant_languages.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single applicant_language
    app.post("/applicant_language", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;
        let fk_language = body.fk_language;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                // Obtain what languages were known by the applicant previously
                let languagesPrevious = (await applicant.getLanguages());

                let languages = [];

                // Add 'id' of languages that the applicant knew

                if (languagesPrevious.length > 0) {
                    for (let i = 0; i < languagesPrevious.length; i++) {
                        if (fk_language != languagesPrevious[i].id) {
                            languages.push(languagesPrevious[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this language"
                            });
                        }
                    }
                }

                // Now add the new language id to previous languages id's
                for (let i = 0; i < fk_language.length; i++) {
                    languages.push(fk_language[i]);
                }

                // And add the array of id's to applicant_languages
                let applicantLanguageCreated = await applicant.setLanguages(languages);

                if (applicantLanguageCreated) {
                    // Last step
                    // It is necessary to update the level after setLanguages
                    // because is added as null
                    await db.sequelize.query({ query: `UPDATE applicant_languages SET level = ? WHERE fk_applicant = ? AND fk_language = ?`, values: [body.level, body.fk_applicant, body.fk_language] });

                    return res.status(201).json({
                        ok: true,
                        message: "Added language to applicant"
                    });

                } else {
                    return res.status(400).json({
                        ok: false,
                        error: "Applicant language can't be created"
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

    // PUT single applicant_language
    app.put("/applicant_language", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await db.sequelize.query({ query: `UPDATE applicant_languages SET level = ? WHERE fk_applicant = ? AND fk_language = ?`, values: [body.level, body.fk_applicant, fk_language] });
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

    // DELETE single applicant_language
    app.delete("/applicant_language", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await applicant.removeLanguages(body.fk_language);

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
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};