const { tokenId, logger, pagination, prepareOffersToShow } = require('../../shared/functions');
const { checkToken } = require('../../middlewares/authentication');
const elastic = require('../../database/elasticsearch');
const env =     require('../../tools/constants');
const axios =   require('axios')


// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    app.get('/offers/search', async(req, res, next) => {

        try {
            // if req.query.keywords search OR (search)
            // rest of req.query.params search AND (filter)
            let query = req.query;
            let page = Number(query.page);
            let limit = Number(query.limit);
            let keywords = query.keywords;
            let salaryAmount_gte = query.salaryAmount_gte;
            let salaryAmount_gt = query.salaryAmount_gt;
            let salaryAmount_lte = query.salaryAmount_lte;
            let salaryAmount_lt = query.salaryAmount_lt;
            let dateStart_gte = query.dateStart_gte;
            let dateStart_gt = query.dateStart_gt;
            let dateStart_lte = query.dateStart_lte;
            let dateStart_lt = query.dateStart_lt;
            let dateEnd_gte = query.dateEnd_gte;
            let dateEnd_gt = query.dateEnd_gt;
            let dateEnd_lte = query.dateEnd_lte;
            let dateEnd_lt = query.dateEnd_lt;
            let datePublished_gte = query.datePublished_gte;
            let datePublished_gt = query.datePublished_gt;
            let datePublished_lte = query.datePublished_lte;
            let datePublished_lt = query.datePublished_lt;
            delete query.page;
            delete query.limit;
            delete query.keywords;
            
            if (Object.keys(query).length === 0 && query.constructor === Object && !keywords){
                res.status(400).json({
                    ok: false,
                    message: 'You must search something'
                })
            } else {
                prepareQuery(query);

                let must = [];
                let should = [];
                let filter = [];

                // Getting all filters in query
                for(var prop in query) {
                    if(query.hasOwnProperty(prop)){
                        filter.push(
                            { terms: {[prop]: query[prop]} }
                        );
                    }
                }

                // Casting string to array, necessary to work
                for (let i = 0; i < filter.length; i++) {
                    for(var val in filter[i].terms) {
                        if(filter[i].terms.hasOwnProperty(val)){
                            if ( typeof(filter[i].terms[val]) != 'object' ) {
                                filter[i].terms[val] = Array(filter[i].terms[val]);
                            }
                        }
                    }
                }

                // Must filter only with content when is filtered some value not as keyword
                if ( filter.length > 0 ) {
                    must.push(filter);
                }

                // should filter only with content when is searched some value as keyword
                if ( keywords ){
                    should.push({query_string: {query: keywords}});
                }

                // If salaryAmount, dateStart, dateEnd or datePublished in query, add range to must filter
                buildSalaryRange(must, salaryAmount_gte, salaryAmount_gt, salaryAmount_lte, salaryAmount_lt);
                buildDateStartRange(must, dateStart_gte, dateStart_gt, dateStart_lte, dateStart_lt);
                buildDateEndRange(must, dateEnd_gte, dateEnd_gt, dateEnd_lte, dateEnd_lt);
                buildDatePublishedRange(must, datePublished_gte, datePublished_gt, datePublished_lte, datePublished_lt);


                var searchParams = {
                    index: 'offers',
                    from: (page - 1) * limit,
                    size: limit,
                    body: {
                        query: {
                            bool: {
                                must,
                                should
                            }
                        }
                    }
                };

                await elastic.search(searchParams, async function (err, response) {
                    if (err) {
                        // handle error
                        throw err;
                    }

                    if ( response.hits.total != 0 ) {
                        users = await db.users.findAll();

                        let offersToShow = [];
                        let offers = response.hits.hits;

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
                            offer.salaryFrecuency = offers[i]._source.salaryFrecuency;
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
                                return res.json({
                                    ok: true,
                                    message: 'No results but maybe this is interesting for you',
                                    data: response2.hits.hits,
                                    total: response2.hits.total,
                                    page: Number(page),
                                    pages: Math.ceil(response2.hits.total / limit)
                                });
                            } else {
                                return res.status(400).json({
                                    ok: false,
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

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one offer by id
    app.get('/offer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
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
            next({ type: 'error', error: 'Error getting data' });
        }
    });
    
    // POST single offer
    app.post('/offer', async(req, res, next) => {

        let body = req.body

        try {
            let id = tokenId.getTokenId(req.get('token'));
            body.fk_offerer = id;

            await db.offers.create(body)
            .then(result => {
                elastic.index({
                    index: 'offers',
                    id: result.id,
                    type: 'offers',
                    body
                }, function (err, resp, status) {
                    if ( err ) {
                        return next({ type: 'error', error: err.message });
                    }
                });

                return res.status(201).json({
                    ok: true,
                    message: 'Offer created',
                    data: {
                        id: result.id,
                        fk_offerer: id,
                        status: result.status,
                        title: result.title,
                        description: result.description,
                        datePublished: result.datePublished,
                        dateStart: result.dateStart,
                        dateEnd: result.dateEnd,
                        location: result.location,
                        salaryAmount: result.salaryAmount,
                        salaryFrecuency: result.salaryFrecuency,
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
            
            if ( offerToUpdate ) {
                await db.offers.update(updates, {
                        where: { id, fk_offerer }
                    }).then(result => {
                        if ( result ) {
                            axios.post(`http://${ env.ES_URL }/offers/offers/${ id }/_update?pretty=true`, {
                                doc: updates
                            }).then((resp) => {
                                // updated from elasticsearch database too
                            }).catch((error) => {
                                console.log(error.message);
                            });
                            return res.status(200).json({
                                ok: true,
                                message: `Offer ${ id } updated`,
                            });
                        } else {
                            return res.status(400).json({
                                ok: false,
                                message: `No updates`,
                            });
                        }

                    });
                } else {
                    return res.status(400).json({
                        ok: false,
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

    function buildSalaryRange (must, salaryAmount_gte, salaryAmount_gt, salaryAmount_lte, salaryAmount_lt) {
        if ( salaryAmount_gte || salaryAmount_gt || salaryAmount_lte || salaryAmount_lt ) {

            let salaryAmount = {};

            salaryAmount_gte ? salaryAmount.gte = salaryAmount_gte : null;
            salaryAmount_gt ? salaryAmount.gt = salaryAmount_gt : null;
            salaryAmount_lte ? salaryAmount.lte = salaryAmount_lte : null;
            salaryAmount_lt ? salaryAmount.lt = salaryAmount_lt : null;
            
            must.push({
                range: {
                    salaryAmount
                }
            });
        }

        return must;
    }

    function buildDateStartRange (must, dateStart_gte, dateStart_gt, dateStart_lte, dateStart_lt) {
            
        if ( dateStart_gte || dateStart_gt || dateStart_lte || dateStart_lt ) {

            let dateStart = {};

            dateStart_gte ? dateStart.gte = dateStart_gte : null;
            dateStart_gt ? dateStart.gt = dateStart_gt : null;
            dateStart_lte ? dateStart.lte = dateStart_lte : null;
            dateStart_lt ? dateStart.lt = dateStart_lt : null;

            must.push({
                range: {
                    dateStart
                }
            });
        }
        return must;
    }
    
    function buildDateEndRange (must, dateEnd_gte, dateEnd_gt, dateEnd_lte, dateEnd_lt) {
            
        if ( dateEnd_gte || dateEnd_gt || dateEnd_lte || dateEnd_lt ) {

            let dateEnd = {};
        
            dateEnd_gte ? dateEnd.gte = dateEnd_gte : null;
            dateEnd_gt ? dateEnd.gt = dateEnd_gt : null;
            dateEnd_lte ? dateEnd.lte = dateEnd_lte : null;
            dateEnd_lt ? dateEnd.lt = dateEnd_lt : null;

            must.push({
                range: {
                    dateEnd
                }
            });
        }
        return must;
    }
    
    function buildDatePublishedRange (must, datePublished_gte, datePublished_gt, datePublished_lte, datePublished_lt) {
            
        if ( datePublished_gte || datePublished_gt || datePublished_lte || datePublished_lt ) {

            let datePublished = {};
        
            datePublished_gte ? datePublished.gte = datePublished_gte : null;
            datePublished_gt ? datePublished.gt = datePublished_gt : null;
            datePublished_lte ? datePublished.lte = datePublished_lte : null;
            datePublished_lt ? datePublished.lt = datePublished_lt : null;
            must.push({
                range: {
                    datePublished
                }
            });
        }
        return must;
    }

    function prepareQuery(query) {
        delete query.salaryAmount_gte;
        delete query.salaryAmount_gt;
        delete query.salaryAmount_lte;
        delete query.salaryAmount_lt;
        delete query.dateStart_gte;
        delete query.dateStart_gt;
        delete query.dateStart_lte;
        delete query.dateStart_lt;
        delete query.dateEnd_gte;
        delete query.dateEnd_gt;
        delete query.dateEnd_lte;
        delete query.dateEnd_lt;
        delete query.datePublished_gte;
        delete query.datePublished_gt;
        delete query.datePublished_lte;
        delete query.datePublished_lt;

        return query;
    }

}