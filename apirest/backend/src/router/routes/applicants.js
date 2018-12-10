const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

//const { checks } = require('../../middlewares/validations')
//const { check, validationResult, checkSchema } = require('express-validator/check')
// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users applicants
    app.get('/applicants', checkToken, async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let applicants = await db.applicants.findAll();
            let applicantsView = [];

            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < applicants.length; j++) {
                    if (users[i].id === applicants[j].userId) {
                        applicantsView[j] = {
                            id: applicants[j].userId,
                            name: users[i].name,
                            email: users[i].email,
                            city: applicants[j].city,
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
            next({ type: 'error', error: err.message });
        }

    });

    // GET one applicant by id
    app.get('/applicant/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let user = await db.users.findOne({
                attributes: [
                    'name',
                    'email'
                ],
                where: { id }
            });

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });

            if (user && applicant) {
                const userApplicant = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    city: applicant.city,
                    date_born: applicant.date_born,
                    premium: applicant.premium,
                    createdAt: applicant.createdAt
                };

                return res.status(200).json({
                    ok: true,
                    userApplicant
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Applicant doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single applicant
    app.post('/applicant', async(req, res, next) => {
        let transaction;

        try {
            const body = req.body;
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;

            // get transaction
            transaction = await db.sequelize.transaction();

            // step 1
            let _user = await db.users.create({
                name: body.name,
                password,
                email: body.email,

            }, { transaction: transaction });

            if (!_user) {
                await transaction.rollback();
            }

            // step 2
            let applicant = await createApplicant(body, _user, next, transaction);

            if (!applicant) {
                await transaction.rollback();
            }

            // commit
            await transaction.commit();

            return res.status(201).json({
                ok: true,
                message: `Applicant '${_user.name}' with id ${_user.id} has been created.`
            });
        } catch (err) {
            //await transaction.rollback();
            return next({ type: 'error', error: (err.errors?err.errors[0].message:err.message) });
        }
    });

    // PUT single applicant
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        // let transaction; for updating users table ???

        try {
    
            if (updates.password)
                updates.password = bcrypt.hashSync(req.body.password, 10);

            let applicant = await db.applicants.findOne({
                where: { userId: id }
            });
            
            if (applicant) {
                let updated = await db.applicants.update(updates, {
                    where: { userId: id }
                });
                if (updated) {
                    return res.status(200).json({
                        ok: true,
                        message: updates
                    })
                } else {
                    return next({ type: 'error', error: 'Can\'t update Applicant' });
                }
            } else {
                return next({ type: 'error', error: 'Applicant doesn\'t exist' });
            }

        } catch (err) {
            return next({ type: 'error', error: err.errors?err.errors[0].message:err.message });
        }
    });

    // DELETE
    app.delete('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
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

    async function createApplicant(body, user, next, transaction) {
        try {
            let applicant = {};

            applicant.userId = user.id;
            applicant.city = body.city ? body.city : null;
            applicant.date_born = body.date_born ? body.date_born : null;
            applicant.premium = body.premium ? body.premium : null;

            let newapplicant = await db.applicants.create(applicant, { transaction: transaction });

            return newapplicant;

        } catch (err) {
            await transaction.rollback();
            return next({ type: 'error', error: err.errors?err.errors[0].message:err.message });
        }
    }
}