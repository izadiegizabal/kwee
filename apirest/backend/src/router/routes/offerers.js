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

    // POST single user
    app.post('/offerer', [checkToken, checkAdmin], async(req, res, next) => {

        const body = req.body;
        const password = bcrypt.hashSync(body.password, 10);

        try {
            let user = await db.users.create({
                name: body.name,
                password,
                email: body.email
            });
            if (user) {
                if (!body.type) {
                    // User created
                    return res.status(201).json({
                        ok: true,
                        message: `User '${user.name}' with id ${user.id} has been created.`
                    });
                } else {
                    let msg = '';
                    switch (body.type) {
                        case 'a':
                            msg = 'Applicant';
                            createApplicant(body, user);
                            break;

                        case 'o':
                            msg = 'Offerer';
                            createOfferer(body, user);
                            break;

                        default:
                            await db.users.destroy({ where: { id: user.id } });
                            next({ type: 'error', error: 'Must be \'type\' of user, \'a\' (applicant) or \'o\' (offerer)' });
                            break;
                    }
                    // Applicant / offerer created
                    return res.status(201).json({
                        ok: true,
                        message: `${ msg } '${user.name}' with id ${user.id} has been created.`
                    });
                }
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // PUT single offerer
    app.put('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
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
            }, {transaction: transaction});
            console.log('Offerer created');
        } else {
            await transaction.rollback();                    
            next({ type: 'error', error: validationResult(err) });
        }
    }
}