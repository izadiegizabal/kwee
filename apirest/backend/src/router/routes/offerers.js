const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

//const { checks } = require('../../middlewares/validations')
//const { check, validationResult, checkSchema } = require('express-validator/check')
// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users offerers
    app.get('/offerers', checkToken, async(req, res, next) => {

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
                            workField: offerers[j].workField,
                            cif: offerers[j].cif,
                            dateVerification: offerers[j].dateVerification,
                            website: offerers[j].website,
                            companySize: offerers[j].companySize,
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

    // GET one offerer by id
    app.get('/offerer/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let user = await db.users.findOne({
                attributes: [
                    'name',
                    'email'
                ],
                where: { id }
            });

            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });

            if (user && offerer) {
                const userOfferer = {
                    id: offerers[j].userId,
                    name: users[i].name,
                    email: users[i].email,
                    adress: offerers[j].adress,
                    workField: offerers[j].workField,
                    cif: offerers[j].cif,
                    dateVerification: offerers[j].dateVerification,
                    website: offerers[j].website,
                    companySize: offerers[j].companySize,
                    year: offerers[j].year,
                    premium: offerers[j].premium,
                    createdAt: offerers[j].createdAt
                };

                return res.status(200).json({
                    ok: true,
                    userOfferer
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Offerer doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single offerer
    app.post('/offerer', async(req, res, next) => {
        let transaction;

        try {
            const body = req.body;
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;

            return db.sequelize.transaction( transaction => {
                return db.users.create({
                    name: body.name,
                    password,
                    email: body.email,

                    photo: body.photo,
                    bio: body.bio,
    
                }, { transaction: transaction })
                .then( _user => {
                    return createOfferer(body, _user, next, transaction);
                })
                .then( ending => {
                    return res.status(201).json({
                        ok: true,
                        message: `Offerer with id ${ending.userId} has been created.`
                    });
                })
            })
            .catch( err => {
                return next({ type: 'error', error: err.errors?err.errors[0].message:err.message });
            })

        } catch (err) {
            //await transaction.rollback();
            next({ type: 'error', error: (err.errors?err.errors[0].message:err.message) });
        }
    });

    // PUT single offerer
    app.put('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            if (updates.password)
                updates.password = bcrypt.hashSync(req.body.password, 10);

            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });

            if (offerer) {

                let offereruser = true;

                if( updates.password || updates.email || updates.name || updates.snSignIn || updates.root || updates.photo || updates.bio ){
                    // Update user values
    
                    if (updates.password)
                        updates.password = bcrypt.hashSync(req.body.password, 10);
    
                    offereruser = await db.users.update( updates, {
                        where: { id: id}
                    })
                }

                let updated = await db.offerers.update(updates, {
                    where: { userId: id }
                });

                if (updated && offereruser) {
                    return res.status(200).json({
                        ok: true,
                        message: updates
                    })
                } else {
                    return next({ type: 'error', error: 'Can\'t update offerer' });
                }
            } else {
                return next({ type: 'error', error: 'Offerer doesn\'t exist' });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE
    app.delete('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
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
                if (offererToDelete && user) {
                    res.json({
                        ok: true,
                        message: 'Offerer deleted'
                    });
                }
            } else {
                next({ type: 'error', error: 'Offerer doesn\'t exist' });
            }
            // Respuestas en json
            // offerer: 1 -> Deleted
            // offerer: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createOfferer(body, user, next, transaction) {
        try {
            let offerer = {
                userId: user.id,
                adress: body.adress,
                workField: body.workField,
                cif: body.cif,
                website: body.website ? body.website : null,
                companySize: body.companySize ? body.companySize : null,
                year: body.year ? body.year : null,
                premium: body.premium ? body.premium : 'basic'
            }

            return db.offerers.create(offerer, { transaction: transaction })
            .catch( err => {
                return next({ type: 'error', error: err.message });                 
            });


        } catch (err) {
            await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    }
}