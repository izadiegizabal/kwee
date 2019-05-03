const {checkToken} = require('../../../../middlewares/authentication');
const {tokenId, logger} = require('../../../../shared/functions');
const {algorithm} = require('../../../../shared/algorithm');

// ============================
// ===== CRUD applicant_skill ======
// ============================

module.exports = (app, db) => {
    // GET all applicant_skills
    app.get("/applicant_skills", checkToken, async (req, res, next) => {
        try {
            await logger.saveLog('GET', 'applicant_skills', null, res);

            return res.status(200).json({
                ok: true,
                applicant_skills: await db.applicant_skills.findAll()
            });
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET one applicant_skill by two id's
    app.get("/applicant_skill/:fk_applicant([0-9]+)/:fk_skill([0-9]+)", checkToken, async (req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                applicant_skill: await db.applicant_skills.findOne({
                    where: {fk_applicant: params.fk_applicant, fk_skill: params.fk_skill}
                })
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET one applicant_skill by one id
    app.get("/applicant_skill/:fk_applicant([0-9]+)", checkToken, async (req, res, next) => {
        const params = req.params;

        try {
            let applicant_skill = await db.applicant_skills.findAll({
                where: {fk_applicant: params.fk_applicant}
            });

            if (applicant_skill) {
                return res.status(200).json({
                    ok: true,
                    message: 'Listing skills of this user',
                    data: applicant_skill
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'This applicant doesn\'t has skills'
                });
            }

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single applicant_skill
    app.post("/applicant_skill", checkToken, async (req, res, next) => {
        const body = req.body;
        let fk_skill = body.fk_skill;

        let id = tokenId.getTokenId(req.get('token'), res);

        try {
            let applicant = await db.applicants.findOne({
                where: {userId: id}
            });

            if (applicant) {

                // Obtain what skills were known by the applicant previously
                let skillsPrevious = (await applicant.getSkills());

                if (skillsPrevious.length > 0) {
                    for (let i = 0; i < skillsPrevious.length; i++) {
                        if (fk_skill == skillsPrevious[i].id) {
                            return res.status(400).json({
                                ok: false,
                                message: "This applicant already knows this skill"
                            });
                        }
                    }
                }

                // And add the array of id's to applicant_skills
                await applicant.addSkill(fk_skill, {
                    through: {
                        description: body.description,
                        level: body.level
                    }
                })
                    .then(async created => {
                        if (created) {
                            await algorithm.indexUpdate(id);
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
                    });

            } else {
                return res.status(200).json({
                    ok: true,
                    error: "Applicant doesn't exist"
                });
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }

    });

    // PUT single applicant_skill
    app.put("/applicant_skill", checkToken, async (req, res, next) => {
        const body = req.body;

        let id = tokenId.getTokenId(req.get('token'), res);

        try {
            let applicant = await db.applicants.findOne({
                where: {userId: id}
            }).then(async _applicant => {
                if (_applicant) {
                    _applicant.hasSkill(body.fk_skill)
                        .then(exists => {
                            if (exists) {
                                _applicant.getSkills({where: {id: body.fk_skill}})
                                    .then(skills => {
                                        let skill = skills[0];

                                        skill.applicant_skills.level = body.level;
                                        if (body.description) skill.applicant_skills.description = body.description;

                                        skill.applicant_skills.save()
                                            .then(async rest => {
                                                if (rest.isReject) {
                                                    return res.status(400).json({
                                                        ok: false,
                                                        msg: "Skill not updated."
                                                    });
                                                } else {
                                                    await algorithm.indexUpdate(id);

                                                    return res.status(200).json({
                                                        ok: false,
                                                        msg: "Skill updated with level " + body.level
                                                    });
                                                }
                                            })
                                    })
                            } else {
                                next({type: 'error', error: "Skill not found for applicant " + body.fk_applicant});
                            }
                        })
                } else {
                    next({type: 'error', error: "Applicant not found (¿fk_applicant wrong?)"});
                }
            })
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    });

    // DELETE single applicant_skill
    app.delete("/applicant_skill", checkToken, async (req, res, next) => {
        const body = req.body;

        let id = tokenId.getTokenId(req.get('token'), res);

        try {
            let applicant = await db.applicants.findOne({
                where: {userId: id}
            })
                .then(u => {
                    if (u) {
                        u.hasSkill(body.fk_skill)
                            .then(success => {
                                if (success) {
                                    u.removeSkills(body.fk_skill)
                                        .then(async ok => {
                                            await algorithm.indexUpdate(id);

                                            return res.status(201).json({
                                                ok: true,
                                                message: "Deleted"
                                            });
                                        })
                                } else {
                                    return res.status(400).json({
                                        ok: false,
                                        error: "This applicant don't know this skill"
                                    });
                                }
                            })
                            .catch(err => {
                                return res.status(400).json({
                                    ok: false,
                                    error: "Skill not deleted"
                                });

                            })
                    } else {
                        return res.status(200).json({
                            ok: true,
                            error: "This Applicant doesn't exist"
                        });
                    }
                })

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }

    });
};
