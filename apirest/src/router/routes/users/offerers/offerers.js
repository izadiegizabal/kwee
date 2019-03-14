const { tokenId, logger, sendVerificationEmail, pagination, uploadImg, checkImg, deleteFile, prepareOffersToShow, isEmpty, saveLogES } = require('../../../../shared/functions');
const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const elastic = require('../../../../database/elasticsearch');
const env =     require('../../../../tools/constants');
const bcrypt = require('bcryptjs');
const moment = require('moment')
const axios =   require('axios')

const { algorithm } = require('../../../../shared/algorithm');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    app.post('/offerers/search', async(req, res, next) => {
        try {
            saveLogES('POST', 'offerers/search', 'Visitor');

            let query = req.query;
            let page = Number(query.page);
            let limit = Number(query.limit);
            let body = req.body;
            let must = [];
            let sort = 'index';
            let from;
            if (body.sort) sort = body.sort;
            if ( page > 0 && limit > 0 ) from = (page - 1) * limit;

            buildIndex(must, body.index);
            buildYear(must, body.year);
            buildCompanySize(must, body.companySize);
            buildDateVerification(must, body.dateVerification);

            if ( body.name ) must.push({multi_match : {query: body.name, fields: ["name"]}})
            if ( body.email ) must.push({multi_match : {query: body.email, fields: ["email"]}})
            if ( body.status ) must.push({multi_match : {query: body.status, fields: ["status"]}})
            if ( body.address ) must.push({multi_match : {query: body.address, fields: ["address"]}})
            if ( body.bio ) must.push({multi_match : {query: body.bio, fields: ["bio"]}})

            let searchParams = {
                index: "offerers",
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
                
                let offerersToShow = [];
                let allOfferers = await db.offerers.findAll();
                let users = await db.users.findAll();

                if ( response.hits.total != 0 ) {
                    let offerers = response.hits.hits;

                    buildOfferersToShow(users, allOfferers, offerersToShow, offerers);

                    return res.json({
                        ok: true,
                        message: 'Results of search',
                        data: offerersToShow,
                        total: response.hits.total,
                        page: Number(page),
                        pages: Math.ceil(response.hits.total / limit)
                    });
                    
                }  else {
                    let searchParams = {
                        index: "offerers",
                        body: {
                            query: {
                            bool: {
                                should: must
                            }
                         }}
                    };

                    await elastic.search(searchParams, function (error, response2) {
                        if (error) {
                            throw error;
                        }

                        if ( response2.hits.total > 0 ) {
                            let offerers = response2.hits.hits;
                            buildOfferersToShow(users, allOfferers, offerersToShow, offerers);

                            return res.json({
                                ok: true,
                                message: 'No results but maybe this is interesting for you',
                                data: offerersToShow,
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


        } catch (err) {
            return next({ type: 'error', err });
        }
    });

    // GET all users offerers
    app.get('/offerers', async(req, res, next) => {
        try {
            saveLogES('GET', 'offerers', 'Visitor');
            await logger.saveLog('GET', 'offerers', null, res);

            var attributes = {
                exclude: ['password', 'root']
            };

            // Need USER values, so we get ALL USERS
            var users = await db.users.findAll();

            // But paginated OFFERERS
            var output = await pagination(
                db.offerers,
                "offerers",
                req.query.limit,
                req.query.page,
                attributes,
                res,
                next
            )

            if ( output.data ) {
                
                var offerers = output.data;
                var offerersView = [];
                
                for (let i = 0; i < users.length; i++) {
                    for (let j = 0; j < offerers.length; j++) {
                        if (users[i].id === offerers[j].userId) {
                            offerersView[j] = {
                                id: offerers[j].userId,
                                index: users[i].index,
                                name: users[i].name,
                                email: users[i].email,
                                address: offerers[j].address,
                                workField: offerers[j].workField,
                                cif: offerers[j].cif,
                                dateVerification: offerers[j].dateVerification,
                                website: offerers[j].website,
                                companySize: offerers[j].companySize,
                                year: offerers[j].year,
                                premium: offerers[j].premium,
                                createdAt: offerers[j].createdAt,
                                lastAccess: users[i].lastAccess,
                                status: users[i].status,
                                img: users[i].img,
                                bio: users[i].bio
                            }
                        }
                    }
                }
                
                return res.status(200).json({
                    ok: true,
                    message: output.message,
                    data: offerersView,
                    total: output.count
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // GET one offerer offers by id
    app.get('/offerer/:id([0-9]+)/offers', async(req, res, next) => {
        const id = req.params.id;
        let limit = Number(req.query.limit);
        let page = Number(req.query.page);
        let status = Number(req.query.status);
        let offersWithStatus = [];
        let draft = 0;
        let open = 0;
        let selection = 0;
        let closed = 0;
        let pages = 0;
        let statusBool = false;

        if ( status >=0 && status <= 3 ) {
            statusBool = true;
        } else {
            if ( status < 0 || status > 3 ){
                return res.status(400).json({
                    ok: false,
                    message: 'Status should be between 0 and 3'
                })
            }
        }
        
        try {
            await logger.saveLog('GET', 'offerer', id, res);
            saveLogES('GET', 'offerer/id/offers', 'Visitor');
            
            let message = ``;

            // But paginated OFFERERS
            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });
            
            
            if ( offerer ) {
                let user = await db.users.findOne({
                    where: { id }
                });
                let offers = await offerer.getOffers();
                
                let count = offers.length;

                if ( statusBool || req.query.summary ) {
                    for (let i = 0; i < count; i++) {
                        if( statusBool ){
                            if (offers[i].status == status ) {
                                offersWithStatus.push(offers[i]);
                            }
                        }
                        if( req.query.summary ){
                            switch(offers[i].status){
                                case 0: open++; break;
                                case 1: closed++; break;
                                case 2: draft++; break;
                                case 3: selection++; break;
                            }
                        }
                    }
                }

                if( limit && page ) {
                    offersWithStatus.length > 0 ? pages = Math.ceil(offersWithStatus.length / limit) : pages = Math.ceil(count / limit);

                    offset = limit * (page - 1);
                    
                    if (page > pages) {
                        return res.status(200).json({
                            ok: true,
                            message: `It doesn't exist ${ page } pages. Total of pages ${ pages }`
                        })
                    }

                    statusBool ? offers = await db.offers.findAll({where: {fk_offerer: id, status }, limit, offset}) : offers = await offerer.getOffers({limit, offset});
                    
                    if (isNaN(pages)){
                        message = `No results`;
                    } else {
                        if ( limit > offers.length ){
                            message = `Listing ${ offers.length } offers of this user. Page ${ page } of ${ pages }.`;
                        } else {
                            message = `Listing ${ limit } offers of this user. Page ${ page } of ${ pages }.`;
                        }
                    }
                } else {
                    message = `Listing all offers of this user.`;
                }

                if( req.query.summary ){
                    var totalOffers = count;
                    count = [];
                    count.push({Total: totalOffers});
                    count.push({Draft: draft});
                    count.push({Open: open});
                    count.push({Selection: selection});
                    count.push({Closed: closed});
                } 

                if ( statusBool ) message += ` With status = ${ status }`;

                let offersShow = [];
                
                prepareOffersToShow(offers, offersShow, user);
                
                return res.json({
                    ok: true,
                    message,
                    data: offersShow,
                    count
                });

            } else {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist this user`
                })
            }

        } catch (error) {
            next({ type: 'error', error: error.message });
        }
    });

    // GET one offerer by id
    app.get('/offerer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        try {
            await logger.saveLog('GET', 'offerer', id, res);
            saveLogES('GET', 'offerer/id', 'Visitor');

            let user = await db.users.findOne({
                where: { id }
            });

            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });

            if (user && offerer) {
                const userOfferer = {
                    id: offerer.userId,
                    index: user.index,
                    name: user.name,
                    email: user.email,
                    address: offerer.address,
                    workField: offerer.workField,
                    cif: offerer.cif,
                    dateVerification: offerer.dateVerification,
                    website: offerer.website,
                    companySize: offerer.companySize,
                    year: offerer.year,
                    premium: offerer.premium,
                    createdAt: offerer.createdAt,
                    lastAccess: user.lastAccess,
                    status: user.status,
                    img: user.img,
                    social_networks: []
                };

                let networks = await db.social_networks.findOne({
                    where: { userId: user.id }
                });

                if( networks ) {
                    networks.google ? userOfferer.social_networks.push({ google: networks.google }) : null;
                    networks.twitter ? userOfferer.social_networks.push({ twitter: networks.twitter }) : null;
                    networks.instagram ? userOfferer.social_networks.push({ instagram: networks.instagram }) : null;
                    networks.telegram ? userOfferer.social_networks.push({ telegram: networks.telegram }) : null;
                    networks.linkedin ? userOfferer.social_networks.push({ linkeding: networks.linkedin }): null;
                }

                return res.status(200).json({
                    ok: true,
                    message: `Offerer ${ id } data`,
                    data: userOfferer
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'Offerer doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single offerer
    app.post('/offerer', async(req, res, next) => {

        try {
            await logger.saveLog('POST', 'offerer', null, res);
            
            const body = req.body;
            let user = {};
            body.password ? user.password = bcrypt.hashSync(body.password, 10) : null;
            body.name ? user.name = body.name : null;
            body.bio ? user.bio = body.bio : null;
            body.email ? user.email = body.email : null;
            var uservar;
            saveLogES('POST', 'offerer', body.name);

            if ( body.img && checkImg(body.img) ) {
                
                return db.sequelize.transaction(transaction => {
                    var imgName = uploadImg(req, res, next, 'offerers');
                    user.img = imgName;
                        return db.users.create(user, { transaction })
                            .then(async _user => {
                                uservar = _user;
                                return createOfferer(body, _user, next, transaction);
                            })
                            .then(async ending => {
                                await sendVerificationEmail(body, uservar);
                                delete body.password;
                                delete body.img;
                                delete body.cif;
                                delete lon;
                                delete lat;
                                body.index = 50;
                                body.companySize = 0;
                                body.year = null;
                                body.dateVerification = null;
                                elastic.index({
                                    index: 'offerers',
                                    type: 'offerer',
                                    id: uservar.id,
                                    body
                                }, function (err, resp, status) {
                                    if ( err ) {
                                        console.log(err.message);
                                    }
                                });
                                // await algorithm.indexUpdate(ending.userId);

                                return res.status(201).json({
                                    ok: true,
                                    message: `Offerer with id ${ending.userId} has been created.`
                                });
                            })
                    })
                    .catch(err => {
                        deleteFile('uploads/offerers/' + user.img);
                        return next({ type: 'error', error: err.message });
                    })
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Bussines picture is required'
                });
            }

        } catch (err) {
            //await transaction.rollback();
            return next({ type: 'error', error: err.message });
        }
    });

    // Update offerer by themself
    app.put('/offerer', async(req, res, next) => {

        try {
            let logId = await logger.saveLog('PUT', 'offerer', null, res);
            
            let id = tokenId.getTokenId(req.get('token'));
            let user = await db.users.findOne({
                where: { id }
            });
            saveLogES('PUT', 'offerer', user.name);
            logger.updateLog(logId, true, id);
            updateOfferer(id, req, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // Update offerer by admin
    app.put('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('PUT', 'offerer', id, res);
            console.log("body.status: " + req.body.status);
            updateOfferer(id, req, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE by themself
    app.delete('/offerer', async(req, res, next) => {
        try {
            let id = tokenId.getTokenId(req.get('token'));
            
            await logger.saveLog('DELETE', 'offerer', id, res);
            
            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });
            
            let user = await db.users.findOne({
                where: { id }
            });
            
            saveLogES('DELETE', 'offerer', user.name);

            if (offerer) {
                let offererToDelete = await db.offerers.destroy({
                    where: { userId: id }
                });

                axios.delete(`http://${ env.ES_URL }/offerers/offerers/${ id }`)
                    .then((res) => {
                        // deleted from elasticsearch database too
                }).catch((error) => {
                    console.error(error)
                });

                let user = await db.users.destroy({
                    where: { id }
                });
                if (offerer && user) {
                    return res.json({
                        ok: true,
                        message: 'Offerer deleted'
                    });
                }
            } else {
                return next({ type: 'error', error: 'Offerer doesn\'t exist' });
            }
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE by admin
    app.delete('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'offerer', id, res);
            saveLogES('DELETE', 'offerer/id', 'Admin');

            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });

            if (offerer) {
                let offererToDelete = await db.offerers.destroy({
                    where: { userId: id }
                });
                let user = await db.users.destroy({
                    where: { id }
                });

                axios.delete(`http://${ env.ES_URL }/offerers/offerers/${ id }`)
                    .then((res) => {
                        // deleted from elasticsearch database too
                }).catch((error) => {
                    console.error(error)
                });

                if (offererToDelete && user) {
                    return res.json({
                        ok: true,
                        message: 'Offerer deleted'
                    });
                }
            } else {
                return next({ type: 'error', error: 'Offerer doesn\'t exist' });
            }
            // Respuestas en json
            // offerer: 1 -> Deleted
            // offerer: 0 -> User don't exists
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function updateOfferer(id, req, res, next) {
        let body = req.body;
        var elasticsearch = {};
        const offerer = await db.offerers.findOne({
            where: { userId: id }
        });

        if (offerer) {
            delete body.root;
            delete body.dateVerification;
            let offererUser = true;
            let userOff = {};

            body.cif ? userOff.cif = body.cif : null;
            if ( body.address ) {
                userOff.address = body.address;
                elasticsearch.address = body.address;
            }
            body.workField ? userOff.workField = body.workField : null;
            body.premium ? userOff.premium = body.premium : null;
            body.website ? userOff.website = body.website : null;
            if ( body.companySize ) {
                userOff.companySize = body.companySize;
                elasticsearch.companySize = body.companySize;
            }
            if ( body.year ) {
                userOff.year = body.year;
                elasticsearch.year = body.year;
            }
            if ( body.status ) {
                userOff.status = body.status;
                elasticsearch.status = body.status;
            }

            if (body.password || body.email || body.name || body.snSignIn || body.img || body.bio || body.status) {
                delete body.cif;
                delete body.address;
                delete body.workField;
                delete body.premium;
                delete body.website;
                delete body.companySize;
                delete body.year;
                if ( body.name ) elasticsearch.name = body.name;
                if ( body.email ) elasticsearch.email = body.email;
                // Update user values
                if (body.password) body.password = bcrypt.hashSync(body.password, 10);
                if ( body.img && checkImg(body.img) ) {
                    let user = await db.users.findOne({
                        where: { id }
                    });
                    if ( user.img ) deleteFile('uploads/offerers/' + user.img);

                    var imgName = uploadImg(req, res, next, 'offerers');
                        body.img = imgName;
                }

                offererUser = await db.users.update(body, {
                    where: { id }
                })
            }
                
            let updated = await db.offerers.update(userOff, {
                where: { userId: id }
            });

            axios.post(`http://${ env.ES_URL }/offerers/offerer/${ id }/_update?pretty=true`, {
                    doc: elasticsearch
                }).then(() => {}
                    ).catch((error) => {
                    console.log('error elastic: ', error.message);
            }); 

            if (updated && offererUser) {
                await algorithm.indexUpdate(id);

                return res.status(200).json({
                    ok: true,
                    message: `Values updated for offerer ${ id }`,
                    data: body
                })
            } else {
                return next({ type: 'error', error: 'Can\'t update offerer' });
            }
        } else {
            return next({ type: 'error', error: 'Offerer doesn\'t exist' });
        }
    }

    async function createOfferer(body, user, next, transaction) {
        try {
            let offerer = {
                userId: user.id,
                address: body.address,
                workField: body.workField,
                cif: body.cif,
                website: body.website ? body.website : null,
                companySize: body.companySize ? body.companySize : null,
                year: body.year ? body.year : null,
            }

            return db.offerers.create(offerer, { transaction: transaction })
                .catch(err => {
                    return next({ type: 'error', error: err.message });
                });


        } catch (err) {
            await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    }

    function buildIndex (must, index) {
        if ( index ) {
            let range = 
            {
                range: {
                  index: {}
                }
            };

            index.gte ? range.range.index.gte = index.gte : null;
            index.gt ? range.range.index.gt = index.gt : null;
            index.lte ? range.range.index.lte = index.lte : null;
            index.lt ? range.range.index.lt = index.lt : null;
            
            must.push(range);
        }   
        
        return must;
    }

    function buildYear (must, year) {
        if ( year ) {
            let range = 
            {
                range: {
                  year: {}
                }
            };

            year.gte ? range.range.year.gte = year.gte : null;
            year.gt ? range.range.year.gt = year.gt : null;
            year.lte ? range.range.year.lte = year.lte : null;
            year.lt ? range.range.year.lt = year.lt : null;
            
            must.push(range);
        }   
        
        return must;
    }

    function buildCompanySize (must, companySize) {
        if ( companySize ) {
            let range = 
            {
                range: {
                  companySize: {}
                }
            };

            companySize.gte ? range.range.companySize.gte = companySize.gte : null;
            companySize.gt ? range.range.companySize.gt = companySize.gt : null;
            companySize.lte ? range.range.companySize.lte = companySize.lte : null;
            companySize.lt ? range.range.companySize.lt = companySize.lt : null;
            
            must.push(range);
        }   
        
        return must;
    }
    
    function buildDateVerification (must, dateVerification) {
        if ( dateVerification ) {
            let range = 
            {
                range: {
                  dateVerification: {}
                }
            };

            dateVerification.gte ? range.range.dateVerification.gte = dateVerification.gte : null;
            dateVerification.gt ? range.range.dateVerification.gt = dateVerification.gt : null;
            dateVerification.lte ? range.range.dateVerification.lte = dateVerification.lte : null;
            dateVerification.lt ? range.range.dateVerification.lt = dateVerification.lt : null;
            
            must.push(range);
        }   
        
        return must;
    }

    function buildOfferersToShow(users, allOfferers, offerersToShow, offerers) {
        for (let i = 0; i < offerers.length; i++) {
            let user = users.find(element => offerers[i]._id == element.id);
            let userOfferer = allOfferers.find(element => offerers[i]._id == element.userId);
            let offerer = {};

            offerer.id = Number(offerers[i]._id);
            offerer.index = Number(offerers[i]._source.index);
            offerer.name = offerers[i]._source.name;
            offerer.email = offerers[i]._source.email;
            offerer.address = offerers[i]._source.address;
            offerer.workField = Number(userOfferer.workField);
            offerer.cif = userOfferer.cif;
            offerer.dateVerification = offerers[i]._source.dateVerification;
            offerer.website = userOfferer.website;
            offerer.companySize = Number(offerers[i]._source.companySize);
            offerer.year = userOfferer.year;
            offerer.premium = Number(userOfferer.premium);
            offerer.createdAt = user.createdAt;
            offerer.lastAccess = user.lastAccess;
            offerer.status = Number(offerers[i]._source.status);
            offerer.img = user.img;
            offerer.bio = user.bio;
            
            
            offerersToShow.push(offerer);
        }
    }
}