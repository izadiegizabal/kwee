const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ===== CRUD application ======
// ============================

module.exports = (app, db) => {
    // GET all applications
    app.get("/applications", checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                applications: await db.applications.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one application by id
    app.get("/application/:fk_applicant([0-9]+)/:fk_offer([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                application: await db.applications.findOne({
                    where: { fk_applicant: params.fk_applicant, fk_offer: params.fk_offer }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one applicant_language by one id
    app.get("/application/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                application: await db.applications.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // POST single application
    app.post("/application", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                let offers = await applicant.getOffers();

                if (offers.length > 0) {
                    for (let i = 0; i < offers.length; i++) {
                        if (body.fk_offer == offers[i].id) {
                            return res.status(400).json({
                                ok: false,
                                error: "Application already added"
                            });
                        } 
                    }
                }

                await applicant.addOffer(body.fk_offer,
                {
                    through: {
                        status: body.status
                    }
                }
                ).then( result => {
                    if(result){
                        return res.status(201).json({
                            ok: true,
                            application: result
                        });
                    }else{
                        return res.status(400).json({
                            ok: false,
                            application: "Application not added."
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
            next({ type: 'error', error: err.toString() });
        }

    });

    // PUT single application
    app.put("/application", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            })
            .then( _applicant => {
                if (_applicant) {
                    _applicant.getOffers({where: { id: body.fk_offer } } )
                    .then( offers => {
                        if(offers){
                            let offer = offers[0];
                            
                            if(body.status){
                                offer.applications.status = body.status;

                                offer.applications.save()
                                .then( ret => {
                                    if(ret.isRejected){
                                        // Problems
                                        return res.status(400).json({
                                            ok: false,
                                            error: "Update REJECTED."
                                        });
                                    }
                                    else{
                                        // Everything ok
                                        return res.status(201).json({
                                            ok: true,
                                            error: "Application updated to " + body.status
                                        });
                                    }
                                })
                            }
                            else{
                                return res.status(400).json({
                                    ok: false,
                                    error: "Updating an application requires a status value."
                                });
                            }
                        }
                        else{
                            return res.status(400).json({
                                ok: false,
                                error: "Application with OfferId " + body.fk_offer + " on ApplicantId " + body.fk_applicant + " doesn't exist."
                            });    
                        }
                    })
                } else {
                    return res.status(400).json({
                        ok: false,
                        error: "Applicant doesn't exist"
                    });
                }
            })
        } catch (err) {
            next({ type: 'error', error: err.toString() });
        }
    });

    // DELETE single application
    app.delete("/application", [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let applicant = await db.applicants.findOne({
                where: { userId: body.fk_applicant }
            });

            if (applicant) {
                res.json({
                    ok: true,
                    application: await applicant.removeOffers(body.fk_offer)
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
};