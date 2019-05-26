const {tokenId, logger, pagination, buildOffersToShow, prepareOffersToShow, saveLogES, createNotification} = require('../../shared/functions');
const {checkAdmin} = require('../../middlewares/authentication');
const elastic = require('../../database/elasticsearch');
const env = require('../../tools/constants');
const axios = require('axios');


// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    app.post('/offers/search', async (req, res, next) => {

        try {
            saveLogES('POST', 'offers/search', 'Visitor');
            // if req.query.keywords search OR (search)
            // rest of req.query.params search AND (filter)
            let query = req.query;
            let page = Number(query.page);
            let limit = Number(query.limit);
            let body = req.body;
            let must = [];
            let sort = 'offererIndex';
            let from;
            if (query.sort) sort = query.sort;
            if (page > 0 && limit > 0) from = (page - 1) * limit;

            // If salaryAmount, dateStart, dateEnd or datePublished in query, add range to must filter
            buildSalaryRange(must, body.salaryAmount);
            buildDateStartRange(must, body.dateStart);
            buildDateEndRange(must, body.dateEnd);
            buildDatePublishedRange(must, body.datePublished);
            buildOffererIndexRange(must, body.offererIndex);

            if (body.title) must.push({multi_match: {query: body.title, type: "phrase_prefix", fields: ["title"]}});
            if (body.status) must.push({multi_match: {query: body.status, fields: ["status"]}});
            if (body.location) must.push({
                multi_match: {
                    query: body.location,
                    type: "phrase_prefix",
                    fields: ["location"]
                }
            });
            if (body.skills) must.push({multi_match: {query: body.skills, type: "phrase_prefix", fields: ["skills"]}});
            if (body.offererName) must.push({
                multi_match: {
                    query: body.offererName,
                    type: "phrase_prefix",
                    fields: ["offererName"]
                }
            });
            if (body.workLocation) must.push({multi_match: {query: body.workLocation, fields: ["workLocation"]}});
            if (body.seniority) must.push({multi_match: {query: body.seniority, fields: ["seniority"]}});
            if (body.contractType) must.push({multi_match: {query: body.contractType, fields: ["contractType"]}});
            if (body.description) must.push({multi_match: {query: body.description, fields: ["description"]}});
            if (body.keywords) must.push({
                multi_match: {
                    query: body.keywords,
                    type: "phrase_prefix",
                    fields:
                        [
                            "title",
                            "location",
                            "offererName",
                            "seniority",
                            "contractType",
                            "salaryCurrency",
                            "description",
                            "skills",
                            "workLocation",
                        ]
                }
            });

            if (must.length == 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'You must search something'
                })
            } else {
                let searchParams = {
                    index: "offers",
                    from: from ? from : null,
                    size: limit ? limit : null,
                    body: {
                        query: {
                            bool: {
                                must
                            }
                        },
                        sort
                    }
                };

                await elastic.search(searchParams, async function (err, response) {
                    if (err) throw err;

                    let users = await db.users.findAll({
                        include: [{
                            model: db.offerers,
                            as: 'offerer'
                            
                        }]
                    });
                    let offersToShow = [];

                    if (response.hits.total != 0) {


                        let offers = response.hits.hits;

                        buildOffersToShow(users, offersToShow, offers);

                        return res.json({
                            ok: true,
                            message: 'Results of search',
                            data: offersToShow,
                            total: response.hits.total,
                            page: Number(page),
                            pages: Math.ceil(response.hits.total / limit)
                        });

                    } else {
                        delete searchParams.body.query.bool.must;
                        searchParams.body.query.bool.should = must;

                        await elastic.search(searchParams, function (error, response2) {
                            if (error) {
                                throw error;
                            }

                            if (response2.hits.total > 0) {
                                let offers = response2.hits.hits;
                                buildOffersToShow(users, offersToShow, offers);
                                return res.json({
                                    ok: true,
                                    message: 'No results but maybe this is interesting for you',
                                    data: offersToShow,
                                    total: response2.hits.total,
                                    page: Number(page),
                                    pages: Math.ceil(response2.hits.total / limit)
                                });
                            } else {
                                return res.status(200).json({
                                    ok: true,
                                    message: 'No results',
                                });
                            }

                        });
                    }
                });
            }
        } catch (error) {
            return next({type: 'error', error});
        }
    });

    // GET all offers
    app.get('/offers', async (req, res, next) => {
        try {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('GET', 'offers', null, res, req.useragent, ip, null);
            saveLogES('GET', 'offers', 'Visitor');

            var offers;

            var output = await pagination(
                db.offers,
                "offers",
                req.query.limit,
                req.query.page,
                '',
                res,
                next
            );

            if (output.data) {
                offers = output.data;
                users = await db.users.findAll({
                    include: [{
                        model: db.offerers,
                        as: 'offerer'
                        
                    }]
                });

                var offersShow = [];

                for (let offer in offers) {
                    let offersAux = [],
                        offersToShowAux = [];
                    offersAux.push(offers[offer]);
                    offersShow.push(prepareOffersToShow(offersAux, offersToShowAux, users.find(element => offers[offer]['fk_offerer'] == element.id))[0]);
                }

                return res.status(200).json({
                    ok: true,
                    message: output.message,
                    data: offersShow,
                    total: output.count,
                    page: Number(req.query.page),
                    pages: Math.ceil(output.count / req.query.limit)
                });
            }

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET one offer by id
    app.get('/offer/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;

        try {
            saveLogES('GET', 'offer/id', 'Visitor');
            offer = await db.offers.findOne({
                where: {id}
            });

            if (offer) {
                let users = await db.users.findAll({
                    include: [{
                        model: db.offerers,
                        as: 'offerer'
                        
                    }]
                });
                let user = users.find(usu => usu.id === offer.fk_offerer);

                let offers = [],
                    offersShow = [];

                offers.push(offer);

                prepareOffersToShow(offers, offersShow, user);

                let applicants = await offer.getApplicants();
                if (applicants.length > 0) {
                    let applications = await db.applications.findAll({where: {fk_offer: id}});
                    applicants.forEach(applicant => {
                        let application = applications.find(apli => apli.fk_applicant == applicant.userId);
                        let applicantUser = users.find(usu => usu.id === applicant.userId);
                        let applicantShow = {};
                        applicantShow.applicationId = application.id;
                        applicantShow.applicationStatus = application.status;
                        applicantShow.aHasRated = application.aHasRated;
                        applicantShow.aHasRatedDate = application.aHasRatedDate;
                        applicantShow.applicantId = applicantUser.id;
                        applicantShow.applicantName = applicantUser.name;
                        applicantShow.applicantStatus = applicantUser.status;

                        offersShow[0].applications.push(applicantShow);

                    });
                } else {
                    offersShow[0].applications = null;
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Listing..',
                    data: offersShow[0]
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: `Offer does not exists`
                });
            }

        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    app.get('/offer/:id([0-9]+)/applications', async (req, res, next) => {
        const id = req.params.id;
        let status = req.query.status;
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        let pages = 0;
        try {
            saveLogES('GET', `offer/${id}/applications`, 'Visitor');
            let applications = await db.applications.findAll({where: {fk_offer: id}});

            if (applications.length > 0) {
                let users = await db.users.findAll();
                let offers = await db.offers.findAll();
                let applicants = await db.applicants.findAll();
                var applicantsToShow = [];

                if (status) applications = applications.filter(element => element.status == status);

                applications.forEach(application => {
                    applicants.forEach(applicant => {
                        if (application.fk_applicant === applicant.userId) {
                            let user = users.find(usu => applicant.userId == usu.id);
                            let offer = offers.find(offer => application.fk_offer == offer.id);
                            let app = {
                                applicantId: user.id,
                                applicationId: application.id,
                                offerId: offer.id,
                                applicantStatus: user.status,
                                applicationStatus: application.status,
                                offerStatus: offer.status,
                                index: user.index,
                                name: user.name,
                                email: user.email,
                                city: applicant.city,
                                dateBorn: applicant.dateBorn,
                                premium: applicant.premium,
                                rol: applicant.rol,
                                lastAccess: user.lastAccess,
                                createdAt: user.createdAt,
                                img: user.img,
                                bio: user.bio,
                            };
                            applicantsToShow.push(app);
                        }
                    });
                });

                if (applicantsToShow.length > 0) {
                    let total = applicantsToShow.length;
                    let msg = 'Listing applicants applicating to this offer';
                    if (page && limit) {
                        pages = Math.ceil(applicantsToShow.length / limit);
                        offset = Number(limit * (page - 1));
                        if (page > pages) {
                            return res.status(200).json({
                                ok: true,
                                message: `It doesn't exist ${page} pages`
                            })
                        }
                        let applicantsAux = [];
                        let until;
                        let j = 0;
                        page < pages ? until = limit + offset : until = applicantsToShow.length;
                        for (let i = offset; i < until; i++) {
                            applicantsAux[j] = applicantsToShow[i];
                            j++;
                        }
                        applicantsToShow = applicantsAux;
                        if (applicantsToShow.length < limit) limit = applicantsToShow.length;
                        msg = `Listing ${limit} applicants applicating to this offer. Page ${page} of ${pages}.`
                    }
                    return res.json({
                        ok: true,
                        message: msg,
                        data: applicantsToShow,
                        total
                    });
                } else {
                    return res.json({
                        ok: true,
                        message: 'There are no applications to this offer with this status'
                    });
                }
            } else {
                return res.json({
                    ok: true,
                    message: 'There are no applications to this offer'
                });
            }

        } catch (err) {
            return next({type: 'error', error: err.message});
        }
    });

    // POST single offer
    app.post('/offer', async (req, res, next) => {

        let body = req.body;

        try {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            let id = tokenId.getTokenId(req.get('token'));
            await logger.saveLog('POST', `offer`, null, res, req.useragent, ip, id);
            body.fk_offerer = id;

            let user = await db.users.findOne({where: { id }});
            let offerer = await db.offerers.findOne({where: { userId: id }});
            let offers = await offerer.getOffers();
            
            if ( offerer ) {
                if ( offerer.premium == 0 ) {
                    if ( ( offers && offers.length < 3 ) || !offers ) {
                        createOffer( user, body, res, next );
                    } else {
                        createInvoice( user );
                        createOffer( user, body, res, next );
                    }
                } else {
                    createOffer( user, body, res, next );
                }
                
            } else {
                return next({type: 'error', error: 'Only offerers may create offers'});
            }
        } catch (err) {
            return next({type: 'error', error: err.message});
        }

    });

    // PUT single offer by offerer creator
    app.put('/offer/:id([0-9]+)', async (req, res, next) => {
        updateOffer(req, res, next);
    });

    // PUT single offer by admin
    app.put('/offer/admin/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        updateOffer(req, res, next);
    });

    // DELETE single offer by themself
    app.delete('/offer/:id([0-9]+)', async (req, res, next) => {
        deleteOffer(req, res, next);
    });
    
    // DELETE single offer by admin
    app.delete('/offer/admin/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        deleteOffer(req, res, next);
    });

    async function updateOffer(req, res, next) {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'), res);
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('PUT', `offer`, id, res, req.useragent, ip, fk_offerer);

            let offerToUpdate = await db.offers.findOne({
                where: { id }
            });
            let user = await db.users.findOne({
                where: { id: fk_offerer }
            });
            saveLogES('PUT', 'offer/id', user.name);

            if (offerToUpdate) {
                if ( offerToUpdate.fk_offerer == fk_offerer || user.root == 1 ) {
                    // Checking status to update, if is the same, not necessary to update
                    // if not and it is status = 1, sending notification that offer is closed
                    // to applicants that applicated to this offer.
                    if (updates.status) {
                        if (offerToUpdate.status == updates.status) {
                            delete updates.status;
                        } else {
                            if ( updates.status == 1 ) {
                                // send mail to all applicants that applicated to this offer
                                // to advise that the offer is closed
                                let users = await db.users.findAll();
                                let applications = await db.applications.findAll({where: {fk_offer: id}});
                                let applicants = await offerToUpdate.getApplicants();
                                // applicants.forEach(applicant => { // sólo a las applications con status 5
                                //     user = users.find(usu => applicant.userId == usu.id);
                                //     createNotification(db, user.id, fk_offerer, 'offers', id, 'closed', true);
                                //     sendEmailOfferClosed(user, res, offerToUpdate);
                                // });
                                applications.forEach(async application => {
                                    if (application.status == 0 || application.status == 1 || application.status == 2) {
                                        await db.applications.update({status: 5}, {
                                            where: {id: application.id}
                                        });
                                        createNotification(db, application.fk_applicant, fk_offerer, 'offers', id, 'closed', true);
                                    }
                                });
                            }
                        }
                    }
                    // because Object.keys(new Date()).length === 0;
                    // we have to do some additional check
                    if (!(Object.keys(updates).length === 0 && updates.constructor === Object)) {
                        await db.offers.update(updates, {
                            where: { id }
                        }).then(result => {
                            if (result == 1) {
                                axios.post(`http://${env.ES_URL}/offers/offer/${id}/_update?pretty=true`, {
                                    doc: updates
                                }).then((resp) => {
                                    // updated from elasticsearch database too
                                }).catch((error) => {
                                    console.log(error.message);
                                });

                                return res.status(200).json({
                                    ok: true,
                                    message: `Offer ${id} updated`,
                                });
                            } else {
                                return next({type: 'error', error: 'No updates'});
                            }
                        });
                    } else {
                        return next({type: 'error', error: 'Nothing to update here'});
                    }
                } else {
                    return next({type: 'error', error: 'This offer is not yours'});
                }
            } else {
                return res.status(200).json({
                    ok: true,
                    message: `No offers with this id`,
                });
            }
        } catch (err) {
            return next({type: 'error', error: err.message});
        }
    }

    async function deleteOffer( req, res, next ) {
        const id = req.params.id;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('DELETE', `offer`, id, res, req.useragent, ip, fk_offerer);

            let offerToDelete = await db.offers.findOne({
                where: { id }
            });
            let user = await db.users.findOne({
                where: {id: fk_offerer}
            });
            saveLogES('DELETE', 'offer/id', user.name);

            if ( offerToDelete ) {
                if ( offerToDelete.fk_offerer == fk_offerer || user.root == 1 ) {

                    axios.delete(`http://${env.ES_URL}/offers/offer/${ id }`)
                        .then((res) => {
                            // deleted from elasticsearch database too
                        }).catch((error) => {
                        console.error(error)
                    });

                    await db.offers.destroy({
                        where: { id }
                    });

                    return res.json({
                        ok: true,
                        message: 'Offer deleted'
                    });

                } else {
                    return next({type: 'error', error: 'This offer is not yours'});
                }
            } else {
                return res.status(200).json({
                    ok: true,
                    message: `No offers with this id`,
                });
            }

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    }

    function buildSalaryRange(must, salaryAmount) {
        if (salaryAmount) {
            let range =
                {
                    range: {
                        salaryAmount: {}
                    }
                };

            salaryAmount.gte ? range.range.salaryAmount.gte = salaryAmount.gte : null;
            salaryAmount.gt ? range.range.salaryAmount.gt = salaryAmount.gt : null;
            salaryAmount.lte ? range.range.salaryAmount.lte = salaryAmount.lte : null;
            salaryAmount.lt ? range.range.salaryAmount.lt = salaryAmount.lt : null;

            must.push(range);
        }

        return must;
    }

    function buildOffererIndexRange(must, offererIndex) {
        if (offererIndex) {
            console.log("offererIndex: ", offererIndex);
            let range =
                {
                    range: {
                        offererIndex: {}
                    }
                };

            offererIndex.gte ? range.range.offererIndex.gte = offererIndex.gte : null;
            offererIndex.gt ? range.range.offererIndex.gt = offererIndex.gt : null;
            offererIndex.lte ? range.range.offererIndex.lte = offererIndex.lte : null;
            offererIndex.lt ? range.range.offererIndex.lt = offererIndex.lt : null;

            must.push(range);
        }

        return must;
    }

    function buildDateStartRange(must, dateStart) {

        if (dateStart) {
            let range =
                {
                    range: {
                        dateStart: {}
                    }
                };

            dateStart.gte ? range.range.dateStart.gte = dateStart.gte : null;
            dateStart.gt ? range.range.dateStart.gt = dateStart.gt : null;
            dateStart.lte ? range.range.dateStart.lte = dateStart.lte : null;
            dateStart.lt ? range.range.dateStart.lt = dateStart.lt : null;

            must.push(range);
        }

        return must;
    }

    function buildDateEndRange(must, dateEnd) {

        if (dateEnd) {
            let range =
                {
                    range: {
                        dateEnd: {}
                    }
                };

            dateEnd.gte ? range.range.dateEnd.gte = dateEnd.gte : null;
            dateEnd.gt ? range.range.dateEnd.gt = dateEnd.gt : null;
            dateEnd.lte ? range.range.dateEnd.lte = dateEnd.lte : null;
            dateEnd.lt ? range.range.dateEnd.lt = dateEnd.lt : null;

            must.push(range);
        }

        return must;
    }

    function buildDatePublishedRange(must, datePublished) {

        if (datePublished) {
            let range =
                {
                    range: {
                        datePublished: {}
                    }
                };

            datePublished.gte ? range.range.datePublished.gte = datePublished.gte : null;
            datePublished.gt ? range.range.datePublished.gt = datePublished.gt : null;
            datePublished.lte ? range.range.datePublished.lte = datePublished.lte : null;
            datePublished.lt ? range.range.datePublished.lt = datePublished.lt : null;

            must.push(range);
        }

        return must;
    }

    async function createOffer( user, body, res, next ) {
        await db.offers.create( body )
                .then(async result => {
                    if (result) {
                        saveLogES('POST', 'offer', user.name);
                        
                        body.offererIndex = user.index;
                        body.offererName = user.name;
                        body.createdAt = new Date();
                        
                        elastic.index({
                            index: 'offers',
                            id: result.id,
                            type: 'offer',
                            body
                        }, function (err, resp, status) {
                            if (err) {
                                console.log('ERROR:', err.message);
                            }
                            
                            return res.status(201).json({
                                ok: true,
                                message: 'Offer created',
                                data: {
                                    id: result.id,
                                    fk_offerer: user.id,
                                    offererIndex: body.offererIndex,
                                    offererName: body.offererName,
                                    status: result.status,
                                    title: result.title,
                                    description: result.description,
                                    datePublished: result.datePublished,
                                    dateStart: result.dateStart,
                                    dateEnd: result.dateEnd,
                                    location: result.location,
                                    salaryAmount: result.salaryAmount,
                                    salaryFrequency: result.salaryFrequency,
                                    salaryCurrency: result.salaryCurrency,
                                    workLocation: result.workLocation,
                                    seniority: result.seniority,
                                    responsabilities: result.responsabilities,
                                    requeriments: result.requeriments,
                                    skills: body.skills,
                                    maxApplicants: body.maxApplicants,
                                    currentApplications: body.currentApplications,
                                    duration: body.duration,
                                    durationUnit: body.durationUnit,
                                    contractType: body.contractType,
                                    isIndefinite: body.isIndefinite
                                }
                            });
                        });
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: `No created`
                        });
                    }
                })
                .catch((err) => {
                        return res.status(400).json({
                        ok: false,
                        message: err.message
                    })
                });
    }

    async function createInvoice( user ) {

        await db.invoices.create({
            fk_user: user.id,
            userName: user.name,
            product: 'Single offer',
            price: '2€'
        })

    }
};
