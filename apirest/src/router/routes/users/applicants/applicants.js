const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const { tokenId, logger, sendVerificationEmail, pagination, uploadFile } = require('../../../../shared/functions');
const bcrypt = require('bcryptjs');

// File upload
const fileUpload = require('express-fileupload');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // app.use(fileUpload());

    // GET all users applicants
    app.get('/applicants', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'applicant', null, res);

            var attributes = {};

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
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;
            
            
            return db.sequelize.transaction(transaction => {
                return db.users.create({
                    name: body.name,
                    password: password,
                    email: body.email,
                    bio: body.bio,
                    //img: body.img, uploadFile saves it
                    //root: body.root
                    
                }, { transaction: transaction })
                .then(async user => {
                    uservar = user;
                    return createApplicant(body, user, next, transaction);
                })
                .then(ending => {
                    sendVerificationEmail(body, uservar);

                    if(req.files) {
                        uploadFile( req, res, next, 'users', ending.userId, db)
                        .then( output => {

                            if( output ){
                                return res.status(201).json({
                                    ok: true,
                                    message: `Applicant with id ${ending.userId} has been created.`
                                });
                            }
                            else{
                                return res.status(400).json({
                                    ok: output,
                                    message: 'Applicant created, but img was not saved.'
                                });
                            }
                        });
                    } else {
                        return res.status(201).json({
                            ok: true,
                            message: `Applicant with id ${ending.userId} has been created without picture.`
                        });
                    }
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
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }

    });

    // Update applicant by themself
    app.put('/applicant', async(req, res, next) => {
        const updates = req.body;

        try {
            let logId = await logger.saveLog('PUT', 'applicant', null, res);

            let id = tokenId.getTokenId(req.get('token'));
            logger.updateLog(logId, true, id);
            if(req.files) {
                updates.img = req.files.img.name;
                uploadFile( req, res, next, 'users', id, db)
                .then( output => {
                    if( output ){
                        console.log('foto subida');
                    }
                    else{
                        console.log('foto no subida');
                    }
                });
            }
            updateApplicant(id, updates, res, next);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    });

    // Update applicant by admin
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            await logger.saveLog('PUT', 'applicant', id, res);
            updateApplicant(id, updates, res, next);
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

    async function updateApplicant(id, updates, res, next) {
        let applicant = await db.applicants.findOne({
            where: { userId: id }
        });

        if (applicant) {

            let applicantuser = true;

            if (updates.password || updates.email || updates.name || updates.snSignIn || updates.root || updates.img || updates.bio) {
                // Update user values

                if (updates.password) updates.password = bcrypt.hashSync(updates.password, 10);

                applicantuser = await db.users.update(updates, {
                    where: { id: id }
                })
            }

            let updated = await db.applicants.update(updates, {
                where: { userId: id }
            });
            if (updated && applicantuser) {
                return res.status(200).json({
                    ok: true,
                    message: `Applicant ${ id } data updated successfuly`,
                    data: updates
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