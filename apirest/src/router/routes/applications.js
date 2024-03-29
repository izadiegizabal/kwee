const {tokenId, logger, pagination, prepareOffersToShow, sendEmailSelected, sendNotification, getSocketUserId, createNotification,} = require('../../shared/functions');
const {checkToken} = require('../../middlewares/authentication');
const {algorithm} = require('../../shared/algorithm');
const {Op} = require('../../database/op');
const moment = require('moment');

// ============================
// ===== CRUD application ======
// ============================

module.exports = (app, db) => {
    // Search 
    app.post('/applications/search', async (req, res, next) => {
        searchInApplications( req, res, next );
    });

    // GET all applications for kwee live
    app.get("/applications/kweelive", async (req, res, next) => {
        applicationsForKweeLive( req, res, next );
    });
    // GET all applications
    app.get("/applications", checkToken, async (req, res, next) => {
        //mirar en civic
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        try {
            await logger.saveLog('GET', 'applications', null, res, req.useragent, ip, null);

            return res.status(200).json({
                ok: true,
                message: `Showing all applications`,
                data: await db.applications.findAll()
            });
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET applications by page limit to 10 applications/page
    app.get('/applications/:page([0-9]+)/:limit([0-9]+)', checkToken, async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        try {
            await logger.saveLog('GET', `applications/${page}`, null, res, req.useragent, ip, null);
            let count = await db.applications.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${page} pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${limit} applications of page ${page} of ${pages} pages`,
                data: await db.applications.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // GET one application by id
    app.get("/application/:fk_applicant([0-9]+)/:fk_offer([0-9]+)", async (req, res, next) => {
        const params = req.params;

        try {
            return res.status(200).json({
                ok: true,
                message: `Showing offer application ${params.fk_offer} of applicant ${params.fk_applicant}`,
                data: await db.applications.findOne({
                    where: {fk_applicant: params.fk_applicant, fk_offer: params.fk_offer}
                })
            });

        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // GET applications by applicant id
    app.get("/application/:fk_applicant([0-9]+)", checkToken, async (req, res, next) => {
        const params = req.params;
        const id = params.fk_applicant;

        try {
            var attr = {};
            let where = {};
            where.fk_applicant = id;
            attr.where = where;
            if ( req.query.status ) where.status = req.query.status;
            if ( req.query.limit && req.query.page ) {
                var limit = Number(req.query.limit);
                var page = Number(req.query.page)
                var offset = req.query.limit * (req.query.page - 1)
                attr.limit = limit;
                attr.offset = offset;
            }

            let users = await db.users.findAll({ include: [db.offerers] });
            let count = await db.applications.findAndCountAll({ where });
            let applications = await db.applications.findAll(attr);
            let offers = await db.offers.findAll();

            // Search the offers where this applicant applicanted
            let offersInApplication = [];

            applications.forEach( application => {
                offersInApplication.push( offers.find( offer => application.fk_offer === offer.id ) );
            });

            let offersShow = [];

            offersInApplication.forEach(element => {
                let offersAux = [],
                offersToShowAux = [];
                offersAux.push(element);
                offersShow.push(prepareOffersToShow(offersAux, offersToShowAux, users.find(user => element.fk_offerer == user.id))[0]);
                
            });

            if ( count.count > 0 ) {

                return res.status(200).json({
                    ok: true,
                    message: `Showing applications of user with id ${ id }`,
                    data: offersShow,
                    total: count.count,
                    page,
                    limit
                });
            } else {
                return next({type: 'error', error: 'This user does not have applications'});
            }

        } catch (err) {
            if ( err.message == 'Invalid token'){
                return next({ type: 'error', error: 'Invalid token' });
            }
            return next({ type: 'error', error: err.message });
        }
    });

    // POST single application
    app.post("/application", async (req, res, next) => {
        const body = req.body;
        const offerToAdd = body.fk_offer;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);

            let applicant = await db.applicants.findOne({
                where: {userId: id}
            });

            if ( applicant ) {
                let offer = await db.offers.findOne({where: {id: offerToAdd}});
                if ( offer ) {
                    if ( applicant.premium == 0 ) {
                        let applications = await db.applications.findAll({
                                                where: {
                                                    fk_applicant: applicant.userId,
                                                    status: {
                                                        [Op.or]: [0, 1, 2]
                                                    }
                                                }
                                            });

                        if ( applications.length < 5 ) {

                            createApplication( id, applicant, offerToAdd, offer, res, next );
                            
                        } else {
                            return next({type: 'error', error: "Sorry, the maximum applications to basic users are 5"});
                        }
                    } else {
                        createApplication( id, applicant, offerToAdd, offer, res, next );
                    }
                } else {
                    return next({type: 'error', error: "Sorry, this offers does not exists"});
                }
            } else {
                return next({type: 'error', error: "Sorry, you are not applicant"});
            }
        } catch (err) {
            return next({type: 'error', error: err.toString()});
        }

    });

    // PUT single application
    app.put("/application/:id([0-9]+)", async (req, res, next) => {
        const status = req.body.status;
        const id = req.params.id;

        try {
            // Applicants and offerers may update applications
            let user = tokenId.getTokenId(req.get('token'), res);
            let application = await db.applications.findOne({where: {id}});
            let applicant = await db.applicants.findOne({where: {userId: user}});

            if (application) {

                if (applicant) {
                    // applicants only may update to status 3 and 4 
                    //(accept or refuse application when is selected)
                    if (status == 3 || status == 4) {
                        if (application.status == 2 || application.status == 3) {
                            if (applicant.userId == application.fk_applicant) {
                                if ( status == 3 ) {
                                    await db.applications.update({ status, acceptedAt: moment() }, {
                                        where: {id}
                                    });
                                } else {
                                    await db.applications.update({ status }, {
                                        where: {id}
                                    });
                                }

                                notifyOfferer(applicant, application, id, status, res);

                                await algorithm.indexUpdate(user);

                                return res.status(201).json({
                                    ok: true,
                                    message: "Application updated to status " + status
                                });
                            } else {
                                return next({
                                    type: 'error',
                                    error: "Unauthorized to update applications of other user"
                                });
                            }
                        } else {
                            return next({type: 'error', error: "You are not selected!"});
                        }
                    } else {
                        return next({type: 'error', error: "Unauthorized action"});
                    }
                } else {
                    let offerer = await db.offerers.findOne({where: {userId: user}});
                    if (offerer) {
                        if ( status != 3 ) {

                            let offers = await offerer.getOffers();
                            let offerToUpdate = offers.find(offer => offer.id == application.fk_offer);
                            
                            if (offerToUpdate) {
                                if (offerToUpdate.id == application.fk_offer) {
                                    await db.applications.update({status}, {
                                        where: {id}
                                    });
                                    notifyApplicant(offerer, application, id, status, res);
                                    await algorithm.indexUpdate(user);
                                    return res.status(201).json({
                                        ok: true,
                                        message: "Application updated to status " + status
                                    });
                                } else {
                                    return next({
                                        type: 'error',
                                        error: "Unauthorized to update applications of other user"
                                    });
                                }
                            } else {
                                return next({type: 'error', error: "Unauthorized to update applications of other user"});
                            }
                        } else {
                            return next({type: 'error', error: "Unauthorized to update applications to accepted being offerer" });
                        }
                    }
                }
            } else {
                return next({type: 'error', error: "This application does not exist"});
            }

        } catch (err) {
            return next({type: 'error', error: err.toString()});
        }
    });

    // DELETE single application
    app.delete("/application/:id([0-9]+)", async (req, res, next) => {
        const applicationId = req.params.id;

        try {
            let application = await db.applications.findOne({where: {id: applicationId}});
            if (application) {

                let id = tokenId.getTokenId(req.get('token'), res);

                let applicant = await db.applicants.findOne({
                    where: {userId: id}
                });

                if (applicant) {
                    if (application.fk_applicant == id) {
                        let offer = await db.offers.findOne({
                            where: {id: application.fk_offer}
                        });
                        let currentApplications = offer.currentApplications - 1;
                        await applicant.removeOffers(application.fk_offer);
                        await db.offers.update({currentApplications}, {where: {id: offer.id}});

                        await algorithm.indexUpdate(id);

                        return res.json({
                            ok: true,
                            message: 'Application deleted'
                        });
                    } else {
                        return next({type: 'error', error: "Sorry, this is not your application"});
                    }
                } else {
                    let offerer = await db.offerers.findOne({
                        where: {userId: id}
                    });

                    if (offerer) {
                        offers = await offerer.getOffers();
                        offers = offers.find(element => element.id == application.fk_offer);

                        if (offers) {
                            let currentApplications = offers.currentApplications - 1;
                            await offers.removeApplicants(application.fk_applicant);
                            await db.offers.update({currentApplications}, {where: {id: offers.id}});
                            return res.json({
                                ok: true,
                                message: 'Application deleted'
                            });
                        } else {
                            return next({type: 'error', error: "Sorry, this is not your application"});
                        }
                    }
                }
            } else {
                return next({type: 'error', error: "This application does not exists"});
            }
        } catch (err) {
            return next({type: 'error', error: err.message});
        }

    });

    async function createApplication( id, applicant, offerToAdd, offer, res, next ) {
        try {
            await applicant.addOffer(offerToAdd)
            .then(async result => {
                if (result) {
                    await db.offers.update({currentApplications: offer.currentApplications + 1}, {where: {id: offerToAdd}});
                    if (result[0]) {
                        await algorithm.indexUpdate(id);
                        return res.status(201).json({
                            ok: true,
                            message: 'Application done',
                            application: result[0][0]
                        });
                    } else {
                        return next({type: 'error', error: "You already applicated to this offer."});
                    }
                } else {
                    return next({type: 'error', error: "Application not added."});
                }
            });
        } catch (error) {
            return next({type: 'error', error: error.message});
        }
    }

    async function getOffererOfApplication(application) {

        let offerers = await db.offerers.findAll();
        let offer = await db.offers.findOne({where: {id: application.fk_offer}});
        let offerer = offerers.find(offerer => offerer.userId === offer.fk_offerer);

        return offerer;
    }

    async function notifyOfferer(applicant, application, id, status, res) {
        let offerer = await getOffererOfApplication(application);
        let user = await db.users.findOne({where: {id: offerer.userId}});
        let socketId = getSocketUserId(user.email);

        switch (status) {
            case 3:
                // Accepted
                // Create notification in BD
                createNotification(db, user.id, applicant.userId, 'applications', id, 'accepted', true);
                // Send real time notification if client connected
                // if (socketId) sendNotification('accepted', socketId, application, db, true);
                break;
            case 4:
                // Refused
                // Create notification in BD
                createNotification(db, user.id, applicant.userId, 'applications', id, 'accepted', false);
                // Send real time notification if client connected
                // if (socketId) sendNotification('accepted', socketId, application, db, false);

        }
    }

    async function notifyApplicant(offerer, application, id, status, res) {

        let user = await db.users.findOne({where: {id: application.fk_applicant}});

        switch (status) {
            case 1:
                // Fav
                // Create notification in BD
                // createNotification(db, user.id, offerer.userId, 'applications', id, 'fav', true);
                // Send real time notification if client connected
                // if (socketId) sendNotification('fav', socketId, application, db, true);
                break;
            case 2:
                // Selected
                // Create notification in BD
                createNotification(db, user.id, offerer.userId, 'applications', id, 'selected', true);
                sendEmailSelected(user, res, application.fk_offer);
                // Send real time notification if client connected
                // if (socketId) sendNotification('selected', socketId, application, db, true);
                break;
            case 5:
                // Closed
                // Create notification in BD
                createNotification(db, user.id, offerer.userId, 'applications', id, 'closed', true);
                // Send real time notification if client connected
                // if (socketId) sendNotification('closed', socketId, application, db, true);
        }
    }

    async function applicationsForKweeLive( req, res, next ) {
        try {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('GET', 'applications/kweelive', null, res, req.useragent, ip, null);
            var applications;
            var output = await pagination(
                db.applications,
                "applications",
                req.query.limit,
                req.query.page,
                '',
                res,
                next
            );

            if (output.data) {
                applications = output.data;

                var applicationsToShow = [];

                for (let application in applications) {
                    let appli = {};
                    let user = await db.users.findOne({ 
                        where: { id: applications[application].fk_applicant }
                    });
                    let offer = await db.offers.findOne({ where: {
                        id: applications[application].fk_offer
                    }});
                    appli.id = applications[application].id;
                    appli.applicantLAT = user.lat;
                    appli.applicantLON = user.lon;
                    appli.offerLAT = offer.lat;
                    appli.offerLON = offer.lon;
                    applicationsToShow.push(appli);
                }
                
                return res.status(200).json({
                    ok: true,
                    message: output.message,
                    data: applicationsToShow,
                    total: output.count,
                    page: Number(req.query.page),
                    pages: Math.ceil(output.count / req.query.limit)
                });
            } else {
                next({type: 'error', error: 'No applications'});
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    }

    async function searchInApplications ( res, res, next ) {

    }

};
