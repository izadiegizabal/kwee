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
                await applicant.addSkill( fk_skill,
                    {
                        through:
                        {
                            description: body.description,
                            level: body.level
                        }
                    }
                )
                .then( created => {
                    if( created ){
                        return res.status(201).json({
                            ok: true,
                            message: "Added skill to applicant"
                        });                        
                    }
                    else{
                        return res.status(400).json({
                            ok: false,
                            error: "Applicant skill can't be created"
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
            next({ type: 'error', error: err.message });
        }

    });

    // PUT single applicant_skill
    app.put("/applicant_skill", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            }).then( async _applicant => {
                if(_applicant){
                    _applicant.hasSkill( body.fk_skill )
                    .then( exists => {
                        if(exists){
                            _applicant.getSkills( { where: { id: body.fk_skill } } )
                            .then( skills => {
                                let skill = skills[0];

                                skill.applicant_skills.level = body.level;
                                if(body.description) skill.applicant_skills.description = body.description;

                                skill.applicant_skills.save()
                                .then( rest => {
                                    if(rest.isReject){
                                        return res.status(400).json({
                                            ok: false,
                                            msg: "Skill not updated."
                                        });
                                    }
                                    else{
                                        return res.status(200).json({
                                            ok: false,
                                            msg: "Skill updated with level " +body.level
                                        });
                                    }
                                })
                            })
                        }
                        else{
                            next({ type: 'error', error: "Skill not found for applicant " +body.fk_applicant });
                        }
                    })
                }
                else{
                    next({ type: 'error', error: "Applicant not found (¿fk_applicant wrong?)" });
                }
            })
        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE single applicant_skill
    app.delete("/applicant_skill", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            })
            .then( u => {
                if(u){
                    u.hasSkill( body.fk_skill )
                    .then( success => {
                        if(success){
                            u.removeSkills(body.fk_skill)
                            .then( ok => {
                                return res.status(201).json({
                                    ok: true,
                                    message: "Deleted"
                                });
                            })
                        }  
                        else{
                            return res.status(400).json({
                                ok: false,
                                error: "This applicant don't know this skill"
                            });
                        }
                    })
                    .catch( err => {
                        return res.status(400).json({
                            ok: false,
                            error: "Skill not deleted"
                        });

                    })
                }
                else{
                    return res.status(400).json({
                        ok: false,
                        error: "This Applicant doesn't exist"
                    });
                }
            })

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });
};