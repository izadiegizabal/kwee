const { tokenId, logger, sendVerificationEmail, pagination, checkImg, deleteFile, uploadImg, saveLogES } = require('../../../../shared/functions');
const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const elastic = require('../../../../database/elasticsearch');
const env =     require('../../../../tools/constants');
const bcrypt = require('bcryptjs');
const moment = require('moment')
const axios = require('axios');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    app.post('/applicants/search', async(req, res, next) => {
        try {
            saveLogES('POST', 'applicants/search', 'Visitor');
            let query = req.query;
            let page = Number(query.page);
            let limit = Number(query.limit);
            let body = req.body;
            let must = [];
            let sort = 'index';
            if (body.sort) sort = body.sort;

            buildLanguages(must, body.languages);
            buildSkills(must, body.skills);
            buildExperiences(must, body.experiences);
            buildEducations(must, body.educations);
            buildIndex(must, body.index);
            buildDateBorn(must, body.dateBorn);

            if ( body.name ) must.push({multi_match: {query: body.name, fields: [ "name" ] }});
            if ( body.city ) must.push({multi_match: {query: body.city, fields: [ "city" ] }});
            if ( body.premium ) must.push({multi_match: {query: body.premium, fields: [ "premium" ] }});
            if ( body.bio ) must.push({multi_match: {query: body.bio, fields: [ "bio" ] }});

            let searchParams = {
                index: "applicants",
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
                
                if ( response.hits.total != 0 ) {
                    let applicantsToShow = [];
                    let applicants = response.hits.hits;

                    for (let i = 0; i < applicants.length; i++) {
                        let applicant = {};

                        applicant.id = applicants[i]._id;
                        applicant.index = applicants[i]._source.index;
                        applicant.name = applicants[i]._source.name;
                        applicant.email = applicants[i]._source.email;
                        applicant.city = applicants[i]._source.city;
                        applicant.dateBorn = applicants[i]._source.dateBorn;
                        applicant.status = applicants[i]._source.status;
                        applicant.rol = applicants[i]._source.rol;
                        applicant.bio = applicants[i]._source.bio;
                        applicant.skills = applicants[i]._source.skills;
                        applicant.educations = applicants[i]._source.educations;
                        applicant.languages = applicants[i]._source.languages;
                        applicant.experiences = applicants[i]._source.experiences;
                        applicant.applications = applicants[i]._source.applications;
                        
                        applicantsToShow.push(applicant);
                    }

                    return res.json({
                        ok: true,
                        message: 'Results of search',
                        data: applicantsToShow,
                        total: response.hits.total,
                        page: Number(page),
                        pages: Math.ceil(response.hits.total / limit)
                    });
                    
                }  else {
                    let searchParams = {
                        index: "applicants",
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
                            return res.json({
                                ok: true,
                                message: 'No results but maybe this is interesting for you',
                                data: response2.hits.hits,
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

    // GET all users applicants
    app.get('/applicants', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'applicant', null, res);
            saveLogES('GET', 'applicants', 'Visitor');

            var attributes = {
                exclude: ['password', 'root']
            };

            // Need USER values, so we get ALL USERS
            var users = await db.users.findAll();

            // But paginated APPLICANTS
            var output = await pagination(
                db.applicants,
                "applicants",
                req.query.limit,
                req.query.page,
                attributes,
                res,
                next
            );

            if ( output.data ) {
                var applicants = output.data;
                var applicantsView = [];
                
                for (let i = 0; i < users.length; i++) {
                    for (let j = 0; j < applicants.length; j++) {
                        
                        if (users[i].id === applicants[j].userId) {
                            applicantsView[j] = {
                                id: applicants[j].userId,
                                index: users[i].index,
                                name: users[i].name,
                                email: users[i].email,
                                city: applicants[j].city,
                                dateBorn: applicants[j].dateBorn,
                                premium: applicants[j].premium,
                                lastAccess: users[i].lastAccess,
                                status: users[i].status,
                                img: users[i].img,
                                bio: users[i].bio,
                            }
                            
                        }
                    }
                }
                
                return res.status(200).json({
                    ok: true,
                    message: output.message,
                    data: applicantsView,
                    total: output.count
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });
    app.get('/applicant/:id([0-9]+)/applications', async(req, res, next) => {
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
            await logger.saveLog('GET', 'applicant', id, res);
            saveLogES('GET', 'applicant/id/applications', 'Visitor');

            let message = ``;
            
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });
            
            if ( applicant ) {
                let offers = [];
                let applications = await db.applications.findAll({where: { fk_applicant: id }});
                let count = applications.length;

                let allOffers = await db.offers.findAll({
                    attributes: {
                        exclude: ['skills', 'requeriments', 'responsabilities']
                    }
                });
                
                for (let i = 0; i < applications.length; i++) {
                    for (let j = 0; j < allOffers.length; j++) {
                        if ( applications[i].fk_offer == allOffers[j].id && allOffers[j].id != null) {
                            let offer = {};
                            
                            let offerer = await db.users.findOne({
                                where: { id: allOffers[j].fk_offerer }
                            });
                            
                            offer.id = allOffers[j].id;
                            offer.fk_offerer = allOffers[j].fk_offerer;
                            offer.offererName = offerer.name;
                            offer.offererIndex = offerer.index;
                            allOffers[j].img ? offer.img = allOffers[j].img : offer.img = offerer.img;
                            offer.title = allOffers[j].title;
                            offer.description = allOffers[j].description;
                            offer.dateStart = allOffers[j].dateStart;
                            offer.dateEnd = allOffers[j].dateEnd;
                            offer.datePublished = allOffers[j].datePublished;
                            offer.location = allOffers[j].location;
                            offer.status = allOffers[j].status;
                            offer.salaryAmount = allOffers[j].salaryAmount;
                            offer.salaryFrequency = allOffers[j].salaryFrequency;
                            offer.salaryCurrency = allOffers[j].salaryCurrency;
                            offer.workLocation = allOffers[j].workLocation;
                            offer.seniority = allOffers[j].seniority;
                            offer.maxApplicants = allOffers[j].maxApplicants;
                            offer.currentApplications = allOffers[j].currentApplications;
                            offer.duration = allOffers[j].duration;
                            offer.durationUnit = allOffers[j].durationUnit;
                            offer.isIndefinite = allOffers[j].isIndefinite;
                            offer.contractType = allOffers[j].contractType;
                            offer.lat = allOffers[j].lat;
                            offer.lon = allOffers[j].lon;
                            offer.createdAt = allOffers[j].createdAt;
                            offer.updatedAt = allOffers[j].updatedAt;
                            offer.deletedAt = allOffers[j].deletedAt;
                            if ( offer != null ) 
                                offers.push(offer);
                        }
                    }
                }

                if ( statusBool || req.query.summary ) {
                    for (let i = 0; i < count; i++) {
                        if( statusBool ){
                            if (offers[i].status == status ) {
                                offersWithStatus.push(offers[i])
                            }
                        }
                        if( req.query.summary ){
                            switch(offers[i].status){
                                case 0: draft++; break;
                                case 1: open++; break;
                                case 2: selection++; break;
                                case 3: closed++; break;
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

                    let offersAux = offers;
                    let limitAux = limit;
                    offers = [];
                    
                    if ( limitAux > offersAux.length ){
                        limitAux = offersAux.length
                    }

                    if ( statusBool ){
                        for (let i = offset; i < offset + limitAux; i++) {
                            if ( offersAux[i].status == status ) {
                                offers.push(offersAux[i]);
                            }
                        }
                    } else {
                        for (let i = offset; i < offset + limitAux; i++) {
                            offers.push(offersAux[i]);
                        }
                    }

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
                
                return res.json({
                    ok: true,
                    message,
                    data: offers,
                    count
                });

            } else {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist this user`
                })
            }
            
        } catch (error) {
            next({ type: 'error', error: error });
        }
    });

    // GET one applicant by id
    app.get('/applicant/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('GET', 'applicant/id', id, res);

            let user = await db.users.findOne({
                where: { id }
            });

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (user && applicant) {
                const userApplicant = {
                    id: user.id,
                    index: user.index,
                    name: user.name,
                    email: user.email,
                    city: applicant.city,
                    dateBorn: applicant.dateBorn,
                    premium: applicant.premium,
                    //createdAt: applicant.createdAt,
                    status: user.status,
                    lastAccess: user.lastAccess,
                    img: user.img,
                    bio: user.bio,
                    social_networks: []
                };

                let networks = await db.social_networks.findOne({
                    where: { userId: user.id }
                });

                if( networks ) {
                    networks.google ? userApplicant.social_networks.push({ google: networks.google }) : null;
                    networks.twitter ? userApplicant.social_networks.push({ twitter: networks.twitter }) : null;
                    networks.instagram ? userApplicant.social_networks.push({ instagram: networks.instagram }) : null;
                    networks.telegram ? userApplicant.social_networks.push({ telegram: networks.telegram }) : null;
                    networks.linkedin ? userApplicant.social_networks.push({ linkeding: networks.linkedin }): null;
                }

                getData(applicant, userApplicant).then( (applicantDates) => {
                    return res.status(200).json({
                        ok: true,
                        message: `Get applicant by id ${ id } success`,
                        data: applicantDates
                    });
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'Applicant doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // POST single applicant
    app.post('/applicant', async(req, res, next) => {

        try {
            await logger.saveLog('POST', 'applicant', null, res);

            const body = req.body;
            let user = {};
            body.password ? user.password = bcrypt.hashSync(body.password, 10) : null;
            body.name ? user.name = body.name : null;
            body.email ? user.email = body.email : null;

            saveLogES('POST', 'applicant', body.name);
            
            return db.sequelize.transaction(transaction => {
                return db.users.create(user, { transaction: transaction })
                .then(async user => {
                    uservar = user;
                    return createApplicant(body, user, next, transaction);
                })
                .then(ending => {
                    sendVerificationEmail(body, uservar);
                    delete body.password;
                    body.index = 50;

                    elastic.index({
                        index: 'applicants',
                        id: uservar.id,
                        type: 'applicant',
                        body
                    }, function (err, resp, status) {
                        if ( err ) {
                            console.log(err)
                        }
                    });
                    return res.status(201).json({
                        ok: true,
                        message: `Applicant with id ${ending.userId} has been created.`
                    });
                })
            })
            .catch(err => {
                return next({ type: 'error', error: err.errors[0].message });
            })

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    app.post('/applicant/info', async(req, res, next) => {

        const body = req.body;
        
        try {
            let id = tokenId.getTokenId(req.get('token'));
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            let aUser = await db.users.findOne({
                where: { id }
            });
            if ( applicant ) {
                saveLogES('POST', 'applicant/info', aUser.name);
                var user = {};
                if ( body.img && checkImg(body.img) ) {
                    var imgName = uploadImg(req, res, next, 'applicants');
                        user.img = imgName;
                }
                
                body.bio ? user.bio = body.bio : null;
                body.index ? user.index = body.index : null;
                applicantuser = await db.users.update(user, {
                    where: { id }
                })

                await setEducations(applicant, body, next).then( async () => {
                    await setLanguages(applicant, body, next).then( async () => {
                        await setSkills(applicant, body, next).then( async () => {
                            await setExperiences(id, body, next).then( async () => {
                                delete body.img;
                                axios.get(`http://${ env.ES_URL }/applicants/applicant/${ id }`, {
                                }).then((resp) => {
                                    // updated from elasticsearch database too
                                    let data = Object.assign(resp.data._source, body);

                                    elastic.index({
                                        index: 'applicants',
                                        id,
                                        type: 'applicant',
                                        body: data
                                    }, function (err, resp, status) {
                                        if ( err ) {
                                            console.log('ERROR: ', err);
                                        }
                                    });
                                }).catch((error) => {
                                    console.log('ERROR:', error.message);
                                });
                                
                                return res.status(200).json({
                                    ok: true,
                                    message: "Added the info of this user"
                                });
                            });
                        });
                    });
                });
            }
        } catch (err) {
            deleteFile('uploads/applicants/' + user.img);
            return next({ type: 'error', error: err.message });
        }

    });

    // Update applicant by themself
    app.put('/applicant', async(req, res, next) => {
        try {
            let logId = await logger.saveLog('PUT', 'applicant', null, res);
            let id = tokenId.getTokenId(req.get('token'));
            let user = await db.users.findOne({
                where: { id }
            });
            logger.updateLog(logId, true, id);
            saveLogES('PUT', 'applicant', user.name);
            updateApplicant(id, req, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    });

    // Update applicant by admin
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('PUT', 'applicant', id, res);
            saveLogES('PUT', 'applicant/id', 'Admin');
            updateApplicant(id, req, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    });

    // DELETE by themself
    app.delete('/applicant', async(req, res, next) => {
        try {
            let id = tokenId.getTokenId(req.get('token'));
            
            await logger.saveLog('DELETE', 'applicant', id, res);
            
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });
            
            let user = await db.users.findOne({
                where: { id }
            });
            saveLogES('DELETE', 'applicant', user.name);
            
            if (applicant) {
                let applicantToDelete = await db.applicants.destroy({
                    where: { userId: id }
                });

                axios.delete(`http://${ env.ES_URL }/applicants/applicants/${ id }`)
                    .then((res) => {
                        // deleted from elasticsearch database too
                }).catch((error) => {
                    console.error(error)
                });

                let user = await db.users.destroy({
                    where: { id }
                });
                if (applicant && user) {
                    return res.json({
                        ok: true,
                        message: 'Applicant deleted'
                    });
                }
            } else {
                return next({ type: 'error', error: 'Applicant doesn\'t exist' });
            }
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE by admin
    app.delete('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'applicant', id, res);
            saveLogES('DELETE', 'applicant/id', 'Admin');

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                let applicantToDelete = await db.applicants.destroy({
                    where: { userId: id }
                });

                axios.delete(`http://${ env.ES_URL }/applicants/applicants/${ id }`)
                    .then((res) => {
                        // deleted from elasticsearch database too
                }).catch((error) => {
                    console.error(error)
                });

                let user = await db.users.destroy({
                    where: { id }
                });
                if (applicant && user) {
                    return res.json({
                        ok: true,
                        message: 'Applicant deleted'
                    });
                }
            } else {
                return next({ type: 'error', error: 'Applicant doesn\'t exist' });
            }
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    app.get('/applicants/:type', async(req, res, next) => {
        
        const type = req.params.type;
        const typeSing = type.substring(0, type.length - 1);

        if ( type == 'languages' || type == 'educations' || type == 'skills' || type == 'experiences' ) {
            let field = '';
            switch ( type ) {
                case 'languages': field = 'languages.language'; break;
                case 'skills': field = 'skills.name'; break;
                case 'educations': field = 'educations.title'; break;
                case 'experiences': field = 'experiences.title'; break;
            }
            var searchParams = {
                index: 'applicants',
                body: {
                    aggregations: {
                        [type]: {
                            nested: { path: type },
                            aggregations: {
                                [typeSing]: {
                                    terms: {
                                        field
                                    }
                                }
                            }
                        }   
                    }
                }
            };
    
            await elastic.search(searchParams, async function (err, response) {
                let objects;
                let total;

                switch ( type ) {
                    case 'languages': objects = response.aggregations.languages.language.buckets; total = response.aggregations.languages.doc_count; break;
                    case 'skills': objects = response.aggregations.skills.skill.buckets; total = response.aggregations.skills.doc_count; break;
                    case 'educations': objects = response.aggregations.educations.education.buckets; total = response.aggregations.educations.doc_count; break;
                    case 'experiences': objects = response.aggregations.experiences.experience.buckets; total = response.aggregations.experiences.doc_count; break;
                }

                return res.json({
                    ok: true,
                    message: 'Results',
                    data: objects,
                    total: total,
                    [type]: objects.length
                });
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Type must be one of this: languages, educations, skills, experiences'
            });
        }
    });

    async function updateApplicant(id, req, res, next) {
        let body = req.body;
        var elasticsearch = {};
        let applicant = await db.applicants.findOne({
            where: { userId: id }
        });

        if (applicant) {
            delete body.root;

            let applicantUser = true;
            let userApp = {};

            if ( body.city ) {
                userApp.city = body.city;
                elasticsearch.city = body.city;
            }
            
            if ( body.dateBorn ) {
                userApp.dateBorn = body.dateBorn;
                elasticsearch.dateBorn = body.dateBorn;
            }
            
            if ( body.rol ) {
                userApp.rol = body.rol;
                elasticsearch.rol = body.rol;
            }
            
            if ( body.premium ) {
                userApp.premium = body.premium;
                elasticsearch.premium = body.premium;
            }

            if (body.password || body.email || body.name || body.snSignIn || body.img || body.bio) {
                // Update user values
                delete body.city;
                delete body.dateBorn;
                delete body.rol;
                delete body.premium;
                if ( body.email ) elasticsearch.email = body.email;
                if ( body.name ) elasticsearch.name = body.name;
                if ( body.snSignIn ) elasticsearch.snSignIn = body.snSignIn;
                if ( body.bio ) elasticsearch.bio = body.bio;
                
                if ( body.password ) body.password = bcrypt.hashSync(body.password, 10);
                if ( body.img && checkImg(body.img) ) {
                    let user = await db.users.findOne({
                        where: { id }
                    });
                    if ( user.img ) deleteFile('uploads/applicants/' + user.img);

                    var imgName = uploadImg(req, res, next, 'applicants');
                        body.img = imgName;
                }

                applicantUser = await db.users.update(body, {
                    where: { id }
                })
            }

            let updated = await db.applicants.update(userApp, {
                where: { userId: id }
            });

            axios.post(`http://${ env.ES_URL }/applicants/applicant/${ applicant.userId }/_update?pretty=true`, {
                    doc: elasticsearch
                }).then(() => {}
                    ).catch((error) => {
                    console.log('error elastic: ', error.message);
            }); 

            body.educations ? updateExperiences(applicant, body.experiences, elasticsearch, next) : null;
            body.educations ? updateEducations(applicant, body.educations, elasticsearch, next) : null;
            body.languages ? updateLanguages(applicant, body.languages, elasticsearch, next) : null;
            body.skills ? updateSkills(applicant, body.skills, elasticsearch, next) : null;

            if (updated && applicantUser) {
                return res.status(200).json({
                    ok: true,
                    message: `Applicant ${ id } data updated successfuly`,
                    data: body
                })
            } else {
                return next({ type: 'error', error: 'Can\'t update Applicant' });
            }
        } else {
            return next({ type: 'error', error: 'Sorry, you are not applicant' });
        }
    }

    async function updateLanguages(applicant, languages, elasticsearch, next) {
        try {
            let applicant_languages = await applicant.getLanguages();

            if ( applicant_languages ) {
                var languagesArray = [];
                for (let i = 0; i < languages.length; i++) {
                    if ( languages[i].id ) {
                        await db.applicant_languages.update({level: languages[i].level}, {
                            where: { fk_language: languages[i].id, fk_applicant: applicant.userId }
                        });
                    } else {
                        let newLanguage = await db.languages.create({
                            language: languages[i].language
                        });
                        await applicant.addLanguage(newLanguage.id, {
                            through: {
                                level: languages[i].level,
                            }
                        });
                    }
                }
                applicant_languages = await applicant.getLanguages();
                
                let buildArray = new Promise((resolve, reject) => {
                    applicant_languages.forEach(async element => {
                        let level = await db.applicant_languages.findOne({ 
                            where: { fk_applicant: applicant.userId, fk_language: element.id } 
                        });

                        await languagesArray.push( {language: element.language, level: level.level} );
                    })
                    setTimeout(function(){
                        resolve("¡Éxito!"); // ¡Todo salió bien!
                      }, 250);
                });
                
                buildArray.then(() => {
                    axios.post(`http://${ env.ES_URL }/applicants/applicant/${ applicant.userId }/_update?pretty=true`, {
                            doc: {languages: languagesArray}
                        }).then(() => {}
                            ).catch((error) => {
                            console.log('error elastic: ', error.message);
                    }); 
                });
            }
        } catch (error) {
            return next({ type: 'error', error: error.message });
        }
    }

    async function updateSkills(applicant, skills, elasticsearch, next) {
        try {
            let applicant_skills = await applicant.getSkills();

            if ( applicant_skills ) {
                var skillsArray = [];
                for (let i = 0; i < skills.length; i++) {
                    if ( skills[i].id ) {
                        await db.applicant_skills.update({level: skills[i].level}, {
                            where: { fk_skill: skills[i].id, fk_applicant: applicant.userId }
                        });
                    } else {
                        let newSkill = await db.skills.create({
                            name: skills[i].name
                        });
                        await applicant.addSkill(newSkill.id, {
                            through: {
                                level: skills[i].level,
                            }
                        });
                    }
                }
                applicant_skills = await applicant.getSkills();
                
                let buildArray = new Promise((resolve, reject) => {
                    applicant_skills.forEach(async element => {
                        let level = await db.applicant_skills.findOne({ 
                            where: { fk_applicant: applicant.userId, fk_skill: element.id } 
                        });

                        await skillsArray.push( {name: element.name, level: level.level} );
                    })
                    setTimeout(function(){
                        resolve("¡Éxito!"); // ¡Todo salió bien!
                      }, 250);
                });
                
                buildArray.then(() => {
                    axios.post(`http://${ env.ES_URL }/applicants/applicant/${ applicant.userId }/_update?pretty=true`, {
                            doc: {skills: skillsArray}
                        }).then(() => {}
                            ).catch((error) => {
                            console.log('error elastic: ', error.message);
                    }); 
                });
            }
        } catch (error) {
            return next({ type: 'error', error: error.message });
        }
    }

    async function updateExperiences(applicant, experiences, elasticsearch, next) {
        try {
            let applicantExperiences = await applicant.getExperiences();

            if ( applicantExperiences ) {
                var experiencesArray = [];
                for (let i = 0; i < experiences.length; i++) {
                    if ( experiences[i].id ) {
                        await db.experiences.update(experiences[i], {
                            where: { id: experiences[i].id }
                        });
                    } else {
                        await db.experiences.create({
                            title: experiences[i].title,
                            dateStart: experiences[i].dateStart,
                            dateEnd: experiences[i].dateEnd,
                        });
                    }
                }
                applicantExperiences = await applicant.getExperiences();
                
                let buildArray = new Promise((resolve, reject) => {
                    applicantExperiences.forEach(async element => {
                        await experiencesArray.push({
                                title: element.title,
                                dateStart: element.dateStart,
                                dateEnd: element.dateEnd,
                            });
                    })
                    setTimeout(function(){
                        resolve("¡Éxito!"); // ¡Todo salió bien!
                      }, 250);
                });
                
                buildArray.then(() => {
                    axios.post(`http://${ env.ES_URL }/applicants/applicant/${ applicant.userId }/_update?pretty=true`, {
                            doc: {experiences: experiencesArray}
                        }).then(() => {}
                            ).catch((error) => {
                            console.log('error elastic: ', error.message);
                    }); 
                });
            }
            
        } catch (error) {
            return next({ type: 'error', error: error.message });
        }
    }

    async function updateEducations(applicant, educations, elasticsearch, next) {
        try {
            let applicant_educations = await applicant.getEducations();

            if ( applicant_educations ) {
                var educationsArray = [];
                for (let i = 0; i < educations.length; i++) {
                    if ( educations[i].id ) {
                        await db.applicant_educations.update({institution: educations[i].institution}, {
                            where: { fk_education: educations[i].id, fk_applicant: applicant.userId }
                        });
                    } else {
                        let newEducation = await db.educations.create({
                            title: educations[i].title
                        });
                        await applicant.addEducation(newEducation.id, {
                            through: {
                                dateStart: educations[i].dateStart,
                                dateEnd: educations[i].dateEnd,
                                institution: educations[i].institution,
                            }
                        });
                    }
                }
                applicant_educations = await applicant.getEducations();
                
                let buildArray = new Promise((resolve, reject) => {
                    applicant_educations.forEach(async element => {
                        let edu = await db.applicant_educations.findOne({ 
                            where: { fk_applicant: applicant.userId, fk_education: element.id } 
                        });

                        await educationsArray.push({
                                title: element.title,
                                dateStart: edu.dateStart,
                                dateEnd: edu.dateEnd,
                                institution: edu.institution
                            });
                    })
                    setTimeout(function(){
                        resolve("¡Éxito!"); // ¡Todo salió bien!
                      }, 250);
                });
                
                buildArray.then(() => {
                    axios.post(`http://${ env.ES_URL }/applicants/applicant/${ applicant.userId }/_update?pretty=true`, {
                            doc: {educations: educationsArray}
                        }).then(() => {}
                            ).catch((error) => {
                            console.log('error elastic: ', error.message);
                    }); 
                });
            }
        } catch (error) {
            return next({ type: 'error', error: error.message });
        }
    }

    async function createApplicant(body, user, next, transaction) {
        try {
            let applicant = {};

            applicant.userId = user.id;
            applicant.city = body.city ? body.city : null;
            applicant.dateBorn = body.dateBorn ? body.dateBorn : null;
            applicant.premium = body.premium ? body.premium : null;
            applicant.rol = body.rol ? body.rol : null;

            return db.applicants.create(applicant, { transaction: transaction })
                .catch(err => {
                    return next({ type: 'error', error: err.message });
                });

        } catch (err) {
            await transaction.rollback();
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    }

    async function getData(applicant, data) {
        try{
            let skills = await applicant.getSkills();
            let educations = await applicant.getEducations();
            let languages = await applicant.getLanguages();
            let experiences = await applicant.getExperiences();
            let applications = await db.applications.findAll();
            let skillsArray = [];
            let languagesArray = [];
            let educationsArray = [];
            let experiencesArray = [];
            let applicationsArray = [];
            if (skills){
                for (let i = 0; i < skills.length; i++) {
                    skillsArray.push(skills[i]);
                }
                data.skills = skillsArray;
            }
            if (educations){
                for (let i = 0; i < educations.length; i++) {
                    educationsArray.push(educations[i]);
                }
                data.educations = educationsArray;
            }
            if (languages){
                for (let i = 0; i < languages.length; i++) {
                    languagesArray.push(languages[i]);
                }
                data.languages = languagesArray;
            }
            if(experiences){
                for (let i = 0; i < experiences.length; i++) {
                    experiencesArray.push(experiences[i]);
                }
                data.experiences = experiencesArray;
            }
            if(applications){
                for (let i = 0; i < applications.length; i++) {
                    if(applications[i].fk_applicant == applicant.userId) {
                        applicationsArray.push(applications[i]);
                    }
                }
                data.applications = applicationsArray;
            }
        }catch(error){
            throw new Error(error);
        }

        return data;
    }

    async function setEducations( applicant, body, next ) {
        if( body.educations ) {
            try {
                if ( body.educations.length > 0 ) {
                    for (let i = 0; i < body.educations.length; i++) {
                        // Search education in database, if not, create it
                        let education = await db.educations.findOne({
                            where: { title: body.educations[i].title }
                        });

                        let educationId;

                        if ( education ) {
                            educationId = education.id;
                        } else {
                            education = await db.educations.create({
                                title: body.educations[i].title
                            });
                            if ( education ) {
                                educationId = education.id;
                            }
                        }

                        new Promise(async(resolve, reject) => {
                            await applicant.addEducation(educationId, {
                                through: {
                                    description: body.educations[i].description,
                                    dateStart: body.educations[i].dateStart,
                                    dateEnd: body.educations[i].dateEnd,
                                    institution: body.educations[i].institution
                                }
                            }).then(result => {
                                if (result) {
                                    delete body.educations[i].description;
                                    return resolve('Education Added');
                                } else {
                                    return reject(new Error('Education not added'));
                                }
                            }).catch(err => {
                                return next({ type: 'error', error: err.message });
                            })
                        });
                    }
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
        }
    }

    async function setSkills( applicant, body, next ) {
        if( body.skills ) {
            try {
                if ( body.skills.length > 0 ) {
                    for (let i = 0; i < body.skills.length; i++) {
                        // Search skill in database, if not, create it
                        let skill = await db.skills.findOne({
                            where: { name: body.skills[i].name }
                        });

                        let skillId;

                        if ( skill ) {
                            skillId = skill.id;
                        } else {
                            skill = await db.skills.create({
                                name: body.skills[i].name
                            });
                            if ( skill ) {
                                skillId = skill.id;
                            }
                        }

                        new Promise(async(resolve, reject) => {
                            await applicant.addSkill(skillId, {
                                through: {
                                    description: body.skills[i].description,
                                    level: body.skills[i].level,
                                }
                            }).then(result => {
                                if (result) {
                                    delete body.skills[i].description;
                                    return resolve('Skill added');
                                } else {
                                    return reject(new Error('Skill not added'));
                                }
                            }).catch(err => {
                                return next({ type: 'error', error: err.message });
                            })
                        });
                    }
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
        }
    }

    async function setLanguages( applicant, body, next ) {
        if( body.languages ) {
            try {
                if ( body.languages.length > 0 ) {
                    for (let i = 0; i < body.languages.length; i++) {
                        // Search language in database, if not, create it
                        let language = await db.languages.findOne({
                            where: { language: body.languages[i].language }
                        });

                        let languageId;

                        if ( language ) {
                            languageId = language.id;
                        } else {
                            language = await db.languages.create({
                                language: body.languages[i].language
                            });
                            if ( language ) {
                                languageId = language.id;
                            }
                        }

                        new Promise(async(resolve, reject) => {
                            await applicant.addLanguage(languageId, {
                                through: {
                                    level: body.languages[i].level,
                                }
                            }).then(result => {
                                if (result) {
                                    return resolve('Language added');
                                } else {
                                    return reject(new Error('Language not added'));
                                }
                            }).catch(err => {
                                return next({ type: 'error', error: err.message });
                            });
                        });
                    }
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
        }
    }

    async function setExperiences( id, body, next ) {
        if( body.experiences ) {
            try {
                if ( body.experiences.length > 0 ) {
                    for (let i = 0; i < body.experiences.length; i++) {
                        await db.experiences.create({
                            fk_applicant: id,
                            title: body.experiences[i].title,
                            description: body.experiences[i].description,
                            dateStart: body.experiences[i].dateStart,
                            dateEnd: body.experiences[i].dateEnd,
                        });
                        delete body.experiences[i].description;
                    }
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
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

    function buildDateBorn (must, dateBorn) {
        if ( dateBorn ) {
            let range = 
            {
                range: {
                  dateBorn: {}
                }
            };

            dateBorn.gte ? range.range.dateBorn.gte = dateBorn.gte : null;
            dateBorn.gt ? range.range.dateBorn.gt = dateBorn.gt : null;
            dateBorn.lte ? range.range.dateBorn.lte = dateBorn.lte : null;
            dateBorn.lt ? range.range.dateBorn.lt = dateBorn.lt : null;
            
            must.push(range);
        }   
        
        return must;
    }

    function buildLanguages(must, languages) {
        if ( languages ) {
            languages.forEach(element => {
                let mustInterno = [];
                if ( element.language ) mustInterno.push({match_phrase: {'languages.language': {query: element.language}}})
                if ( element.level ) mustInterno.push({match_phrase: {'languages.level': {query: element.level}}})
                must.push(
                {
                    nested:
                    {
                        path: 'languages',
                        query:
                        {
                            bool:
                            {
                                must: mustInterno
                            }
                        }
                    }
                });
            });
        }
        return must;
    }

    function buildSkills(must, skills) {
        if ( skills ) {
            skills.forEach(element => {
                let mustInterno = [];
                if ( element.name ) mustInterno.push({match_phrase: {'skills.name': {query: element.name}}})
                if ( element.level ) mustInterno.push({match_phrase: {'skills.level': {query: element.level}}})
                must.push(
                {
                    nested:
                    {
                        path: 'skills',
                        query:
                        {
                            bool:
                            {
                                must: mustInterno
                            }
                        }
                    }
                });
            });
        }
        return must;
    }

    function buildEducations(must, educations) {
        if ( educations ) {
            educations.forEach(element => {
                let mustInterno = [];
                if ( element.title ) mustInterno.push({match_phrase: {'educations.title': {query: element.title}}})
                if ( element.institution ) mustInterno.push({match_phrase: {'educations.institution': {query: element.institution}}})
                must.push(
                {
                    nested:
                    {
                        path: 'educations',
                        query:
                        {
                            bool:
                            {
                                must: mustInterno
                            }
                        }
                    }
                });
            });
        }
        return must;
    }

    function buildExperiences(must, experiences) {
        if ( experiences ) {
            experiences.forEach(element => {
                let mustInterno = [];
                if ( element.title ) mustInterno.push({match_phrase: {'experiences.title': {query: element.title}}})
                must.push(
                {
                    nested:
                    {
                        path: 'experiences',
                        query:
                        {
                            bool:
                            {
                                must: mustInterno
                            }
                        }
                    }
                });
            });
        }
        return must;
    }
}