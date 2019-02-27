const { checkToken } = require('../../../../middlewares/authentication');
const { tokenId, logger } = require('../../../../shared/functions');

// ============================
// ===== CRUD applicant_language ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_languages
    app.get("/applicant_languages", checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'applicant_languages', null, res);

            return res.status(200).json({
                ok: true,
                applicant_languages: await db.applicant_languages.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
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
        const fk_applicant = req.params.fk_applicant;

        try {
            let applicant_languages = await db.applicant_languages.findAll({
                where: { fk_applicant }
            });

            if ( applicant_languages ) {
                return res.status(200).json({
                    ok: true,
                    message: 'Listing all languages of this user',
                    data: applicant_languages
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'This user doesn\'t has languages'
                });
            }


        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // POST single applicant_language
    app.post("/applicant_language", async(req, res, next) => {
        const body = req.body;
        let fk_language = body.fk_language;

        try {
            let id = tokenId.getTokenId(req.get('token'));

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                // Obtain what languages were known by the applicant previously
                let languagesPrevious = (await applicant.getLanguages());

                // Add 'id' of languages that the applicant knew
                if (languagesPrevious.length > 0) {
                    for (let i = 0; i < languagesPrevious.length; i++) {
                        if (fk_language == languagesPrevious[i].id) {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this language"
                            });
                        }
                    }
                }

                await applicant.addLanguage(fk_language, {
                    through: {
                        level: body.level
                    }
                }).then(created => {
                    if (created) {
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
                })

            } else {
                return res.status(200).json({
                    ok: true,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: err[0].message });
        }
    });

    // PUT single applicant_language
    app.put("/applicant_language", checkToken, async(req, res, next) => {
        const body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));

            let applicant = await db.applicants.findOne({
                    where: { userId: id }
                })
                .then(async applicant => {
                    if (applicant) {
                        applicant.hasLanguage(body.fk_language)
                            .then(success => {
                                if (success) {
                                    applicant.getLanguages({ where: { id: body.fk_language } })
                                        .then(languages => {
                                            let language = languages[0];

                                            language.applicant_languages.level = body.level;

                                            language.applicant_languages.save()
                                                .then(rest => {
                                                    if (rest.isRejected) {
                                                        // Problems
                                                        return res.status(400).json({
                                                            ok: false,
                                                            msg: "Language not updated."
                                                        });
                                                    } else {
                                                        // Everything ok
                                                        return res.status(201).json({
                                                            ok: true,
                                                            msg: "Language updated"
                                                        });
                                                    }
                                                })
                                        })

                                } else {

                                }
                            })
                    } else {
                        return res.status(200).json({
                            ok: true,
                            error: "Applicant language doesn't exist"
                        });
                    }
                });


        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single applicant_language
    app.delete("/applicant_language", checkToken, async(req, res, next) => {
        const body = req.body;

        try {

            let id = tokenId.getTokenId(req.get('token'));

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                await applicant.removeLanguages(body.fk_language);

                res.status(201).json({
                    ok: true,
                    message: "Deleted"
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    error: "This Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};