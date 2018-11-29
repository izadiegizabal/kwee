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

    // GET one applicant_language by id
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
            next({ type: 'error', error: err });
        }
    });

    // GET one applicant_language by id
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
            next({ type: 'error', error: err });
        }
    });

    // POST single applicant_language
    app.post("/applicant_languages", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                let languages = (await applicant.getLanguages());

                if (languages.length > 0) {
                    for (let i = 0; i < languages.length; i++) {
                        if (body.fk_language != languages[i].id) {
                            body.fk_language.push(languages[i].id);
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
                    applicant_language: await applicant.setLanguages(body.fk_language)
                });

                await db.sequelize.query({ query: `UPDATE applicant_languages SET level=\'${ body.level }\' WHERE fk_applicant = ? AND fk_language = ?`, values: [body.fk_applicant, body.fk_language] });

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

    // PUT single applicant_language
    app.put("/applicant_languages", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await db.sequelize.query({ query: `UPDATE applicant_languages SET level=\'${ body.level }\' WHERE fk_applicant = ? AND fk_language = ?`, values: [body.fk_applicant, body.fk_language] });
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
    app.delete("/applicant_languages", [checkToken, checkAdmin], async(req, res, next) => {
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
            next({ type: 'error', error: err });
        }

    });
};