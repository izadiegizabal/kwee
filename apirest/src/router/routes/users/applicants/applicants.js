const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const { tokenId, logger, sendVerificationEmail, pagination, checkImg, deleteFile, uploadImg } = require('../../../../shared/functions');
const bcrypt = require('bcryptjs');


// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users applicants
    app.get('/applicants', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'applicant', null, res);

            var attributes = {
                exclude: ['password']
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
                            //createdAt: applicants[j].createdAt,
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

            let message = ``;
            
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });
            
            if ( applicant ) {
                let offers = [];
                let applications = await db.applications.findAll({where: { fk_applicant: id }});
                let count = applications.length;
                console.log('count: ', count);
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
                            offer.title = allOffers[j].title;
                            offer.description = allOffers[j].description;
                            offer.dateStart = allOffers[j].dateStart;
                            offer.dateEnd = allOffers[j].dateEnd;
                            offer.datePublished = allOffers[j].datePublished;
                            offer.location = allOffers[j].location;
                            offer.status = allOffers[j].status;
                            offer.salaryAmount = allOffers[j].salaryAmount;
                            offer.salaryFrecuency = allOffers[j].salaryFrecuency;
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
                        return res.status(400).json({
                            ok: false,
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
                    count.push("Total: " + totalOffers);
                    count.push("Draft: " + draft);
                    count.push("Open: " + open);
                    count.push("Selection: " + selection);
                    count.push("Closed: " + closed);
                }

                if ( statusBool ) message += ` With status = ${ status }`;
                
                return res.json({
                    ok: true,
                    message,
                    data: offers,
                    count
                });

            } else {
                return res.status(400).json({
                    ok: false,
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
            await logger.saveLog('GET', 'applicant', id, res);

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
                return res.status(400).json({
                    ok: false,
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
            
            return db.sequelize.transaction(transaction => {
                return db.users.create(user, { transaction: transaction })
                .then(async user => {
                    uservar = user;
                    return createApplicant(body, user, next, transaction);
                })
                .then(ending => {
                    sendVerificationEmail(body, uservar);
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
            return next({ type: 'error', error: err.errors[0].message });
        }
    });

    app.post('/applicant/info', async(req, res, next) => {

        const body = req.body;
        let id = tokenId.getTokenId(req.get('token'));
        
        try {
            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });
            if ( applicant ) {
                let user = {};
                if ( body.img && checkImg(body.img) ) {
                    var imgName = uploadImg(req, res, next, 'applicants');
                        user.img = imgName;
                }
                body.bio ? user.bio = body.bio : null;
                applicantuser = await db.users.update(user, {
                    where: { id }
                })
                await setEducations(applicant, body, next).then( async () => {
                    await setSkills(applicant, body, next).then( async () => {
                        await setLanguages(applicant, body, next).then( async () => {
                            await setExperiences(id, body, next).then( async () => {
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
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }

    });

    // Update applicant by themself
    app.put('/applicant', async(req, res, next) => {

        try {
            let logId = await logger.saveLog('PUT', 'applicant', null, res);
            let id = tokenId.getTokenId(req.get('token'));

            logger.updateLog(logId, true, id);

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
            updateApplicant(id, req, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    });

    // DELETE
    app.delete('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'applicant', id, res);

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (applicant) {
                let applicantToDelete = await db.applicants.destroy({
                    where: { userId: id }
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
            // Respuestas en json
            // applicant: 1 -> Deleted
            // applicant: 0 -> User don't exists
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function updateApplicant(id, req, res, next) {
        let body = req.body;
        let applicant = await db.applicants.findOne({
            where: { userId: id }
        });

        if (applicant) {
            delete body.root;

            let applicantuser = true;
            let userApp = {};
            body.city ? userApp.city = body.city : null;
            body.dateBorn ? userApp.dateBorn = body.dateBorn : null;
            body.rol ? userApp.rol = body.rol : null;
            body.premium ? userApp.premium = body.premium : null;

            
            
            if (body.password || body.email || body.name || body.snSignIn || body.img || body.bio) {
                // Update user values
                delete body.city;
                delete body.dateBorn;
                delete body.rol;
                delete body.premium;
                
                if ( body.password ) body.password = bcrypt.hashSync(body.password, 10);
                if ( body.img && checkImg(body.img) ) {
                    let user = await db.users.findOne({
                        where: { id }
                    });
                    if ( user.img ) deleteFile('uploads/applicants/' + user.img);

                    var imgName = uploadImg(req, res, next, 'applicants');
                        body.img = imgName;
                }

                applicantuser = await db.users.update(body, {
                    where: { id }
                })
            }

            let updated = await db.applicants.update(userApp, {
                where: { userId: id }
            });
            if (updated && applicantuser) {
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
                    return new Promise(async(resolve, reject) => {
                        for (let i = 0; i < body.educations.length; i++) {
                            await applicant.addEducation(body.educations[i].fk_education, {
                                through: {
                                    description: body.educations[i].description,
                                    date_start: body.educations[i].date_start,
                                    date_end: body.educations[i].date_end,
                                    institution: body.educations[i].institution
                                }
                            }).then(result => {
                                if (result) {
                                    return resolve('Education Added');
                                } else {
                                    return reject(new Error('Education not added'));
                                }
                            }).catch(err => {
                                return next({ type: 'error', error: err.message });
                            })
                        }
                    });
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
                    return new Promise(async(resolve, reject) => {
                        for (let i = 0; i < body.skills.length; i++) {
                            await applicant.addSkill(body.skills[i].fk_skill, {
                                through: {
                                    description: body.skills[i].description,
                                    level: body.skills[i].level,
                                }
                            }).then(result => {
                                if (result) {
                                    return resolve('Skill added');
                                } else {
                                    return reject(new Error('Skill not added'));
                                }
                            }).catch(err => {
                                return next({ type: 'error', error: err.message });
                            })
                        }
                    });
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
                    return new Promise(async(resolve, reject) => {
                        for (let i = 0; i < body.languages.length; i++) {
                            await applicant.addLanguage(body.languages[i].fk_language, {
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
                            })
                        }
                    });
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
                            date_start: body.experiences[i].date_start,
                            date_end: body.experiences[i].date_end,
                        });
                    }
                }
            } catch (err) {
                return next({ type: 'error', error: err.message });
            }
        }
    }
}