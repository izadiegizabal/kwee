const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { tokenId, logger, sendEmailSelected } = require('../../shared/functions');
const { algorithm } = require('../../shared/algorithm');

// ============================
// ===== CRUD application ======
// ============================

module.exports = (app, db) => {
    // GET all applications
    app.get("/applications", checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'applications', null, res);

            return res.status(200).json({
                ok: true,
                message: `Showing all applications`,
                data: await db.applications.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET applications by page limit to 10 applications/page
    app.get('/applications/:page([0-9]+)/:limit([0-9]+)', checkToken ,async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `applications/${ page }`, null, res);
            let count = await db.applications.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${ page } pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${ limit } applications of page ${ page } of ${ pages } pages`,
                data: await db.applications.findAll({
                    limit,
                    offset,
                    $sort: { id: 1 }
                }),
                total: count.count
            });
        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one application by id
    app.get("/application/:fk_applicant([0-9]+)/:fk_offer([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            return res.status(200).json({
                ok: true,
                message: `Showing offer application ${params.fk_offer} of applicant ${params.fk_applicant}`,
                data: await db.applications.findOne({
                    where: { fk_applicant: params.fk_applicant, fk_offer: params.fk_offer }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET applications by applicant id
    app.get("/application/:fk_applicant([0-9]+)", checkToken, async(req, res, next) => {
        const params = req.params;

        try {
            res.status(200).json({
                ok: true,
                message: `Showing applications of user ${ params.fk_applicant}`,
                data: await db.applications.findAll({
                    where: { fk_applicant: params.fk_applicant }
                })
            });

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // POST single application
    app.post("/application", async(req, res, next) => {
        const body = req.body;
        const offerToAdd = body.fk_offer;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                let offer = await db.offers.findOne({where: { id: offerToAdd }});
                if ( offer ) {

                    await applicant.addOffer(offerToAdd)
                        .then(async result => {
                        if (result) {
                                await db.offers.update({currentApplications: offer.currentApplications + 1}, { where: {id: offerToAdd}});
                                if ( result[0] ) {  
                                    await algorithm.indexUpdate(id); 
                                    return res.status(201).json({
                                        ok: true,
                                        message: 'Application done',
                                        application: result[0][0]
                                    });
                                } else {
                                    return res.status(400).json({
                                        ok: false,
                                        message: "You already applicated to this offer."
                                    });
                                }
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: "Application not added."
                            });
                        }
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: "Sorry, this offers does not exists"
                    });
                }
            } else {
                return res.status(400).json({
                    ok: false,
                    message: "Sorry, you are not applicant"
                });
            }
        } catch (err) {
            return next({ type: 'error', error: err.toString() });
        }

    });

    // PUT single application
    app.put("/application/:id([0-9]+)", async(req, res, next) => {
        const status = req.body.status;
        const id = req.params.id;

        try {
            // Applicants and offerers may update applications
            let user = tokenId.getTokenId(req.get('token'));
            let application = await db.applications.findOne({where: { id }});
            let applicant = await db.applicants.findOne({where: { userId: user }});

            if ( applicant ) {
                // applicants only may update to status 3 and 4 
                //(accept or refuse application when is selected)
                if ( status == 3 || status == 4 ) {
                    if ( application.status == 2 ){
                        if ( applicant.userId == application.fk_applicant ) {
                            await db.applications.update({status}, {
                                where: { id }
                            });
                            await algorithm.indexUpdate(user);

                            return res.status(201).json({
                                ok: true,
                                message: "Application updated to status " + status
                            });
                        } else {
                            return res.status(401).json({
                                ok: false,
                                message: "Unauthorized to update applications of other user"
                            });
                        }
                    } else {
                        return res.status(401).json({
                            ok: false,
                            message: "You are not selected!"
                        });
                    }
                } else {
                    return res.status(401).json({
                        ok: false,
                        message: "Unauthorized action"
                    });
                }
            } else {
                let offerer = await db.offerers.findOne({where: { userId: user }});
                if ( offerer ) {
                    let offers = await offerer.getOffers();

                    let offerToUpdate = offers.map(offer => offer.id == application.fk_offer);

                    if ( offerToUpdate ) {
                        await db.applications.update({status}, {
                            where: { id }
                        });
                        if ( status == 2 ) {
                            //Send mail selected
                            let user = await db.users.findOne({where: { id: application.fk_applicant }});
                            sendEmailSelected(user, res, application.fk_offer);
                        }
                        await algorithm.indexUpdate(user);
                        return res.status(201).json({
                            ok: true,
                            message: "Application updated to status " + status
                        });
                    }
                }
            }
            
        } catch (err) {
            return next({ type: 'error', error: err.toString() });
        }

        // try {
        //     let id = tokenId.getTokenId(req.get('token'));

        //     await db.users.findOne({where:{id}})
        //     .then( async userExists => {
        //         if( userExists ) {
                    
        //             let applicant = await db.applicants.findOne({
        //                     where: { userId: body.fk_applicant }
        //                 })
        //                 .then(async _applicant => {
        //                     if (_applicant) {
        //                         _applicant.getOffers({ where: { id: body.fk_offer } })
        //                             .then(offers => {
        //                                 if (offers) {
        //                                     let offer = offers[0];
        
        //                                     if (body.status) {
        //                                         offer.applications.status = body.status;
        
        //                                         offer.applications.save()
        //                                             .then(ret => {
        //                                                 if (ret.isRejected) {
        //                                                     // Problems
        //                                                     return res.status(400).json({
        //                                                         ok: false,
        //                                                         error: "Update REJECTED."
        //                                                     });
        //                                                 } else {
        //                                                     // Everything ok
        //                                                     return res.status(201).json({
        //                                                         ok: true,
        //                                                         error: "Application updated to " + body.status
        //                                                     });
        //                                                 }
        //                                             })
        //                                     } else {
        //                                         return res.status(400).json({
        //                                             ok: false,
        //                                             error: "Updating an application requires a status value."
        //                                         });
        //                                     }
        //                                 } else {
        //                                     return res.status(200).json({
        //                                         ok: true,
        //                                         error: "Application with OfferId " + body.fk_offer + " on ApplicantId " + body.fk_applicant + " doesn't exist."
        //                                     });
        //                                 }
        //                             })
        //                     } else {
        
        //                     }
        //                 })
        //         }
        //         else {
        //             return res.status(400).json({
        //                 ok: false,
        //                 error: "Sorry, user not exists."
        //             });
        //         }
        //     })

        // } catch (err) {
        //     next({ type: 'error', error: err.toString() });
        // }
    });

    // DELETE single application
    app.delete("/application/:id([0-9]+)", async(req, res, next) => {
        const applicationId = req.params.id;

        try {
            let application = await db.applications.findOne({where: { id: applicationId }});
            if ( application ){

                let id = tokenId.getTokenId(req.get('token'));
                
                let applicant = await db.applicants.findOne({
                    where: { userId: id }
                });
                
                if (applicant) {
                    if ( application.fk_applicant == id ) {
                        let offer = await db.offers.findOne({
                            where: { id: application.fk_offer }
                        });
                        let currentApplications = offer.currentApplications - 1;
                        await applicant.removeOffers(application.fk_offer);
                        await db.offers.update({currentApplications}, {where: { id: offer.id }});

                        await algorithm.indexUpdate(id);

                        return res.json({
                            ok: true,
                            message: 'Application deleted' 
                        });
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: "Sorry, this is not your application"
                        });
                    }
                } else {
                    let offerer = await db.offerers.findOne({
                        where: { userId: id }
                    });
                    
                    if ( offerer ) {
                        offers = await offerer.getOffers();
                        offers = offers.find(element => element.id == application.fk_offer );
                        
                        if ( offers ) {
                            let currentApplications = offers.currentApplications - 1;
                            await offers.removeApplicants(application.fk_applicant);
                            await db.offers.update({currentApplications}, {where: { id: offers.id }});
                            return res.json({
                                ok: true,
                                message: 'Application deleted' 
                            });
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: "Sorry, this is not your application"
                            });
                        }
                    }
                }
            } else {
                return res.status(400).json({
                    ok: false,
                    message: "This application does not exists"
                });
            }
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });
};