const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD applicant_skill ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_skills
    app.get("/applicant_skills", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                applicant_skills: await db.applicant_skills.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one applicant_skill by two id's
    app.get("/applicant_skill/:fk_applicant([0-9]+)/:fk_skill([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_skill: await db.applicant_skills.findOne({
                    // include: [{
                    //     model: db.skills,
                    //     where: { fk_skill: params.fk_skill }
                    // }],
                    where: { fk_applicant: params.fk_applicant, fk_skill: params.fk_skill }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one applicant_skill by one id
    app.get("/applicant_skill/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_skill: await db.applicant_skills.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // POST single applicant_skill
    app.post("/applicant_skills", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                let skills = (await applicant.getSkills());

                if (skills.length > 0) {
                    for (let i = 0; i < skills.length; i++) {
                        if (body.fk_skill != skills[i].id) {
                            body.fk_skill.push(skills[i].id);
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
                    applicant_skill: await applicant.setSkills(body.fk_skill)
                });

                await db.sequelize.query({ query: `UPDATE applicant_skills SET level=\'${ body.level }\' WHERE fk_applicant = ? AND fk_skill = ?`, values: [body.fk_applicant, body.fk_skill] });

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

    // PUT single applicant_skill
    app.put("/applicant_skills", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await db.sequelize.query({ query: `UPDATE applicant_skills SET level=\'${ body.level }\' WHERE fk_applicant = ? AND fk_skill = ?`, values: [body.fk_applicant, body.fk_skill] });
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

    // DELETE single applicant_skill
    app.delete("/applicant_skills", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                await applicant.removeSkills(body.fk_skill);

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