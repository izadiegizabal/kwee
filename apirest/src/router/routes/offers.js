const { tokenId, logger, pagination, prepareOffersToShow, saveLogES, sendEmailOfferClosed } = require('../../shared/functions');
const { checkToken } = require('../../middlewares/authentication');
const elastic = require('../../database/elasticsearch');
const env =     require('../../tools/constants');
const axios =   require('axios')


// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    app.post('/offers/search', async(req, res, next) => {

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
            if ( query.sort ) sort = query.sort;
            if ( page > 0 && limit > 0 ) from = (page - 1) * limit;

            // If salaryAmount, dateStart, dateEnd or datePublished in query, add range to must filter
            buildSalaryRange(must, body.salaryAmount);
            buildDateStartRange(must, body.dateStart);
            buildDateEndRange(must, body.dateEnd);
            buildDatePublishedRange(must, body.datePublished);
            buildOffererIndexRange(must, body.offererIndex);

            if ( body.title ) must.push({multi_match: {query: body.title, fields: [ "title" ] }});
            if ( body.status ) must.push({multi_match: {query: body.status, fields: [ "status" ] }});
            if ( body.location ) must.push({multi_match: {query: body.location, fields: [ "location" ] }});
            if ( body.skills ) must.push({multi_match: {query: body.skills, fields: [ "skills" ] }});
            if ( body.offererName ) must.push({multi_match: {query: body.offererName, fields: [ "offererName" ] }});
            if ( body.workLocation ) must.push({multi_match: {query: body.workLocation, fields: [ "workLocation" ] }});
            if ( body.seniority ) must.push({multi_match: {query: body.seniority, fields: [ "seniority" ] }});
            if ( body.contractType ) must.push({multi_match: {query: body.contractType, fields: [ "contractType" ] }});
            if ( body.keywords ) must.push({multi_match: {query: body.keywords, fields: [ "*" ] }});

            if ( must.length == 0 ){
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

                    let users = await db.users.findAll();
                    let offersToShow = [];

                    if ( response.hits.total != 0 ) {
                        

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

                            if ( response2.hits.total > 0 ) {
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
            return next({ type: 'error', error });
        }
    });

    // GET all offers
    app.get('/offers', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'offers', null, res);
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

            if ( output.data ) {
                offers = output.data;
                users = await db.users.findAll();
                
                var offersShow = [];
                
                for (var offer in offers) {
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
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one offer by id
    app.get('/offer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
            saveLogES('GET', 'offer/id', 'Visitor');
            offer = await db.offers.findOne({
                where: { id }
            });

            user = await db.users.findOne({
                where: { id: offer['fk_offerer'] }
            });

            let offers = [],
                offersShow = [];

            offers.push(offer);
            
            prepareOffersToShow(offers, offersShow, user);

            return res.status(200).json({
                ok: true,
                data: offersShow[0]
            });

        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    app.get('/offer/:id([0-9]+)/applications', async(req, res, next) => {
        const id = req.params.id;
        let status = req.query.status;
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        let pages = 0;
        try {
            saveLogES('GET', `offer/${id}/applications`, 'Visitor');
            let applications = await db.applications.findAll({ where: { fk_offer: id } });

            if ( applications.length > 0 ) {
                let users = await db.users.findAll();
                let offers = await db.offers.findAll();
                let applicants = await db.applicants.findAll();
                var applicantsToShow = [];

                if(status) applications = applications.filter(element => element.status == status);

                applications.forEach(application => {
                    applicants.forEach(applicant => {
                        if ( application.fk_applicant === applicant.userId ) {
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

                if ( applicantsToShow.length > 0 ) {
                    let total = applicantsToShow.length;
                    let msg = 'Listing applicants applicating to this offer';
                    if (page && limit){
                        pages = Math.ceil(applicantsToShow.length / limit);
                        offset = Number(limit * (page - 1));
                        if (page > pages) {
                            return res.status(200).json({
                                ok: true,
                                message: `It doesn't exist ${ page } pages`
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
                        msg = `Listing ${ limit } applicants applicating to this offer. Page ${ page } of ${ pages }.`
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
            return next({ type: 'error', error: err.message });
        }
    });
    
    // POST single offer
    app.post('/offer', async(req, res, next) => {

        let body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            body.fk_offerer = id;
            
            await db.offers.create(body)
            .then(async result => {
                if ( result ) {
                    
                    let offerer = await db.users.findOne({ where: { id }});
                    saveLogES('POST', 'offer', offerer.name);

                    body.offererIndex = offerer.index;
                    body.offererName = offerer.name;

                    elastic.index({
                        index: 'offers',
                        id: result.id,
                        type: 'offer',
                        body
                    }, function (err, resp, status) {
                        if ( err ) {
                            console.log('ERROR:', err.message);
                        }

                        return res.status(201).json({
                            ok: true,
                            message: 'Offer created',
                            data: {
                                id: result.id,
                                fk_offerer: id,
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
            });

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });

    // PUT single offer
    app.put('/offer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'));
            
            let offerToUpdate = await db.offers.findOne({
                where: {id}
            });
            let user = db.users.findOne({
                where: {id: fk_offerer}
            })
            saveLogES('PUT', 'offer/id', user.name);
            
            if ( offerToUpdate ) {
                if ( updates.status && updates.status == 2 ) {
                    // send mail to all applicants that applicated to this offer
                    // to advise that the offer is closed
                    let users = await db.users.findAll();
                    let applications = await db.applications.findAll({where: {fk_offer: id}});
                    let applicants = await offerToUpdate.getApplicants();
                    applicants.forEach(applicant => {
                        user = users.find(usu => applicant.userId == usu.id);
                        sendEmailOfferClosed(user, res, offerToUpdate);
                    });
                    applications.forEach(async application => {
                        await db.applications.update({status: 4}, {
                            where: { id: application.id }
                        });
                    });
                }
                await db.offers.update(updates, {
                        where: { id, fk_offerer }
                    }).then(result => {
                        if ( result ) {
                            axios.post(`http://${ env.ES_URL }/offers/offer/${ id }/_update?pretty=true`, {
                                doc: updates
                            }).then((resp) => {
                                // updated from elasticsearch database too
                            }).catch((error) => {
                                console.log(error.message);
                            });
                            if ( result == 1) {
                                return res.status(200).json({
                                    ok: true,
                                    message: `Offer ${ id } updated`,
                                });
                            } else {
                                return res.status(400).json({
                                    ok: false,
                                    message: `This offer is not yours`,
                                });
                            }
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: `No updates`,
                            });
                        }

                    });
                } else {
                    return res.status(200).json({
                        ok: true,
                        message: `No offers with this id`,
                    });
                }
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE single offer
    app.delete('/offer/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'));
            let user = db.users.findOne({
                where: {id: fk_offerer}
            })
            saveLogES('DELETE', 'offer/id', user.name);

            axios.delete(`http://${ env.ES_URL }/offers/offers/${ id }`)
                .then((res) => {
                    // deleted from elasticsearch database too
            }).catch((error) => {
                console.error(error)
            });

            await db.offers.destroy({
                where: { id, fk_offerer }
            });

            return res.json({
                ok: true,
                message: 'Offer deleted' 
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    function buildSalaryRange (must, salaryAmount) {
        if ( salaryAmount ) {
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

    function buildOffererIndexRange (must, offererIndex) {
        if ( offererIndex ) {
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

    function buildDateStartRange (must, dateStart) {
            
        if ( dateStart ) {
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
    
    function buildDateEndRange (must, dateEnd) {
            
        if ( dateEnd ) {
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
    
    function buildDatePublishedRange (must, datePublished) {
            
        if ( datePublished ) {
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

    function buildOffersToShow(users, offersToShow, offers) {
        for (let i = 0; i < offers.length; i++) {
            let user = users.find(element => offers[i]._source.fk_offerer == element.id);
            let offer = {};

            offer.id = offers[i]._id;
            offer.fk_offerer = offers[i]._source.fk_offerer;
            offer.offererName = user.name;
            offer.offererIndex = user.index;
            offers[i]._source.img ? offer.img = offers[i]._source.img : offer.img = user.img;
            offer.title = offers[i]._source.title;
            offer.description = offers[i]._source.description;
            offer.dateStart = offers[i]._source.dateStart;
            offer.dateEnd = offers[i]._source.dateEnd;
            offer.datePublished = offers[i]._source.datePublished;
            offer.location = offers[i]._source.location;
            offer.status = offers[i]._source.status;
            offer.salaryAmount = offers[i]._source.salaryAmount;
            offer.salaryFrequency = offers[i]._source.salaryFrequency;
            offer.salaryCurrency = offers[i]._source.salaryCurrency;
            offer.workLocation = offers[i]._source.workLocation;
            offer.seniority = offers[i]._source.seniority;
            offer.maxApplicants = offers[i]._source.maxApplicants;
            offer.currentApplications = offers[i]._source.currentApplications;
            offer.duration = offers[i]._source.duration;
            offer.durationUnit = offers[i]._source.durationUnit;
            offer.isIndefinite = offers[i]._source.isIndefinite;
            offer.contractType = offers[i]._source.contractType;
            offer.responsabilities = offers[i].responsabilities;
            offer.requeriments = offers[i].requeriments;
            offer.skills = offers[i].skills;
            offer.lat = offers[i]._source.lat;
            offer.lon = offers[i]._source.lon;
            offer.createdAt = offers[i]._source.createdAt;
            offer.updatedAt = offers[i]._source.updatedAt;
            offer.deletedAt = offers[i]._source.deletedAt;
            
            offersToShow.push(offer);
        }
    }
}