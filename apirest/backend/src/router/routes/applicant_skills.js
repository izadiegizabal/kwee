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
                    where: { fk_applicant: params.fk_applicant, fk_skill: params.fk_skill }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
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
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single applicant_skill
    app.post("/applicant_skill", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;
        let fk_skill = body.fk_skill;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {

                // Obtain what skills were known by the applicant previously
                let skillsPrevious = (await applicant.getSkills());

                let skills = [];

                // Add 'id' of skills that the applicant knew

                if (skillsPrevious.length > 0) {
                    for (let i = 0; i < skillsPrevious.length; i++) {
                        if (fk_skill != skillsPrevious[i].id) {
                            skills.push(skillsPrevious[i].id);
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this skill"
                            });
                        }
                    }
                }

                // Now add the new skill id to previous skills id's
                for (let i = 0; i < fk_skill.length; i++) {
                    skills.push(fk_skill[i]);
                }

                // And add the array of id's to applicant_skills
                let applicantSkillCreated = await applicant.setSkills(skills);

                if (applicantSkillCreated) {
                    // Last step
                    // It is necessary to update the level and description after setSkills
                    // because is added as null
                    await db.sequelize.query({ query: `UPDATE applicant_skills SET level = ?, description = ? WHERE fk_applicant = ? AND fk_skill = ?`, values: [body.level, body.description, body.fk_applicant, body.fk_skill] });

                    return res.status(201).json({
                        ok: true,
                        message: "Added skill to applicant"
                    });

                } else {
                    return res.status(400).json({
                        ok: false,
                        error: "Applicant skill can't be created"
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

    // PUT single applicant_skill
    app.put("/applicant_skill", [checkToken, checkAdmin], async(req, res, next) => {
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
                    error: "Applicant skill doesn't exist"
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single applicant_skill
    app.delete("/applicant_skill", [checkToken, checkAdmin], async(req, res, next) => {
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
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};