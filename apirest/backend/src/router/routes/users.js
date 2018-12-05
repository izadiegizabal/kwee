const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                users: await db.users.findAll({
                    attributes: [
                        'name',
                        'email'
                    ]
                })
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });

    // GET all users applicants
    app.get('/users/applicants', checkToken, async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let applicants = await db.applicants.findAll();
            let applicantsView = [];

            for (let i = 0; i < users.length - 1; i++) {
                for (let j = 0; j < applicants.length - 1; j++) {
                    if (users[i].id === applicants[j].userId) {
                        applicantsView[j] = {
                            id: applicants[j].userId,
                            name: users[i].name,
                            email: users[i].email,
                            date_born: applicants[j].date_born,
                            premium: applicants[j].premium,
                            createdAt: applicants[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                applicants: applicantsView
            });
        } catch (err) {
            next({ type: 'error', error: validationResult(err) });
        }

    });

    // GET all users offerers
    app.get('/users/offerers', checkToken, async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let offerers = await db.offerers.findAll();
            let offerersView = [];

            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < offerers.length; j++) {
                    if (users[i].id === offerers[j].userId) {
                        offerersView[j] = {
                            id: offerers[j].userId,
                            name: users[i].name,
                            email: users[i].email,
                            adress: offerers[j].adress,
                            work_field: offerers[j].work_field,
                            cif: offerers[j].cif,
                            date_verification: offerers[j].date_verification,
                            about_us: offerers[j].about_us,
                            website: offerers[j].website,
                            company_size: offerers[j].company_size,
                            year: offerers[j].year,
                            premium: offerers[j].premium,
                            createdAt: offerers[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                offerers: offerersView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // GET one user by id
    app.get('/user/:id([0-9]+)',
        checkToken,
        async(req, res, next) => {

            const id = req.params.id;

            try {

                let user = await db.users.findOne({
                    attributes: [
                        'name',
                        'email'
                    ],
                    where: { id }
                });

                if (user) {
                    res.status(200).json({
                        ok: true,
                        user
                    });
                } else {
                    res.status(400).json({
                        ok: false,
                        message: 'User doesn\'t exist'
                    });
                }


            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });


    app.post('/user', [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;
        const password = bcrypt.hashSync(body.password, 10);

        let msg;
        let user;

        let transaction;

        try {
            // get transaction
            transaction = await db.sequelize.transaction();

            // step 1
            let _user = await db.users.create({
                name: body.name,
                password,
                email: body.email
            }, { transaction: transaction });

            // step 2
            switch (body.type) {
                case 'a':
                    await createApplicant(body, _user, next, transaction);
                    msg = "Applicant";
                    break;

                case 'o':
                    await createOfferer(body, _user, next, transaction);
                    msg = "Offerer";
                    break;

                default:
                    console.log("rolling back on switch");

                    await transaction.rollback();
                    next({ type: 'error', error: "Type of user is wrong. Only 'a' (applicant) or 'o' (offerer)." });
                    break;
            }

            // commit
            await transaction.commit();

            return res.status(201).json({
                ok: true,
                message: `${ msg } '${_user.name}' with id ${_user.id} has been created.`
            });
        } catch (err) {
            console.log("rolling back on main");
            //await transaction.rollback();
            next({ type: 'error', error: validationResult(err) });
        }
    });

    // POST single user
    // app.post('/user', [checkToken, checkAdmin], async(req, res, next) => {

    //     const body = req.body;

    //     const password = bcrypt.hashSync(body.password, 10);

    //     console.log("después: ", password);

    //     try {
    //         let user = await db.users.create({
    //             name: body.name,
    //             password,
    //             email: body.email
    //         });
    //         if (user) {

    //             if (!body.type) {
    //                 // User not created
    //                 await db.users.destroy({ where: { id: user.id } });

    //                 return res.status(400).json({
    //                     ok: false,
    //                     message: `User not created.`
    //                 });
    //             } else {
    //                 let msg = '';
    //                 switch (body.type) {
    //                     case 'a':
    //                         msg = 'Applicant';
    //                         createApplicant(body, user, next);
    //                         break;

    //                     case 'o':
    //                         msg = 'Offerer';
    //                         createOfferer(body, user, next);
    //                         break;

    //                     default:
    //                         await db.users.destroy({ where: { id: user.id } });
    //                         next({ type: 'error', error: 'Must be \'type\' of user, \'a\' (applicant) or \'o\' (offerer)' });
    //                         break;
    //                 }
    //                 // Applicant / offerer created
    //                 console.log("mando return");
    //                 // return res.status(201).json({
    //                 //     ok: true,
    //                 //     message: `${ msg } '${user.name}' with id ${user.id} has been created.`
    //                 // });
    //             }
    //         }



    //     } catch (err) {
    //         next({ type: 'error', error: validationResult(err) });            
    //     }

    // });


    // PUT single user
    // actualiza db users !!!! hay que actualizar TABLAS applicants y/o offerers ( siwtch (type) )
    app.put('/user/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let updated = await db.users.update(updates, {
                where: { id }
            });
            if (updated) {
                res.status(200).json({
                    ok: true,
                    message: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // PUT single applicant
    app.put('/user/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let updated = await db.applicants.update(updates, {
                where: { userId: id }
            });
            if (updated) {
                res.status(200).json({
                    ok: true,
                    message: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // PUT single offerer
    app.put('/user/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let updated = await db.offerers.update(updates, {
                where: { userId: id }
            });
            if (updated) {
                res.status(200).json({
                    ok: true,
                    message: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE single user
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/user/:id([0-9]+)', [checkToken, checkAdmin /*, check*/ ], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                user: await db.users.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // user: 1 -> Deleted
            // user: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createApplicant(body, user, next, transaction) {
        try {
            //if (body.city) {
            let applicant = {};
            applicant.userId = user.id;
            if (body.city) applicant.city = body.city;
            if (body.date_born) applicant.date_born = body.date_born;
            if (body.premium) applicant.premium = body.premium;

            console.log(applicant);
            let newapplicant = await db.applicants.create(applicant, { transaction: transaction });
            // if(newapplicant){
            //     console.log('Applicant created');
            // return newapplicant;
            // }
            // else{
            //     console.log("errorrr");
            // }
            return newapplicant;
            /* } else {
                 await transaction.rollback();                    
                 next({ type: 'error', error: 'City required' });
             }*/
        } catch (err) {
            await transaction.rollback();
            next({ type: 'error', error: validationResult(err) });
        }
    }

    async function createOfferer(body, user, next, transaction) {
        if (body.adress && body.cif && body.work_field) {

            await db.offerers.create({
                userId: user.id,
                adress: body.adress,
                work_field: body.work_field,
                cif: body.cif,
                about_us: body.about_us ? body.about_us : null,
                website: body.website ? body.website : null,
                company_size: body.company_size ? body.company_size : null,
                year: body.year ? body.year : null,
                premium: body.premium ? body.premium : 'basic'
            }, { transaction: transaction });
            console.log('Offerer created');
        } else {
            await transaction.rollback();
            next({ type: 'error', error: validationResult(err) });
        }
    }
}