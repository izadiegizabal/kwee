const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const getTokenId = require('../../../../shared/functions');
const bcrypt = require('bcrypt');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users applicants
    app.get('/applicants', async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let applicants = await db.applicants.findAll();
            let applicantsView = [];

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
                            createdAt: applicants[j].createdAt,
                            lastAccess: users[i].lastAccess,
                            status: users[i].status
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
    app.get('/applicant/:id([0-9]+)', async(req, res, next) => {
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
                    index: user.index,
                    name: user.name,
                    email: user.email,
                    city: applicant.city,
                    dateBorn: applicant.dateBorn,
                    premium: applicant.premium,
                    createdAt: applicant.createdAt,
                    status: user.status,
                    lastAccess: user.lastAccess
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

        try {
            const body = req.body;
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;

            return db.sequelize.transaction(transaction => {
                    return db.users.create({
                            name: body.name,
                            password: password,
                            email: body.email,

                            photo: body.photo,
                            bio: body.bio,
                            //root: body.root

                        }, { transaction: transaction })
                        .then(async user => {
                            return createApplicant(body, user, next, transaction);
                        })
                        .then(ending => {
                            return res.status(201).json({
                                ok: true,
                                message: `Applicant with id ${ending.userId} has been created.`
                            });
                        })
                })
                .catch(err => {
                    return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
                })

        } catch (err) {
            return next({ type: 'error', error: (err.errors ? err.errors[0].message : err.message) });
        }
    });

    // Update applicant by themself
    app.put('/applicant', async(req, res, next) => {
        const updates = req.body;

        try {
            let id = getTokenId.tokenId.getTokenId(req.get('token'));
            updateApplicant(id, updates, res);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
        }
    });

    // Update applicant by admin
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            updateApplicant(id, updates, res);
        } catch (err) {
            return next({ type: 'error', error: err.errors ? err.errors[0].message : err.message });
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

    async function updateApplicant(id, updates, res) {
        let applicant = await db.applicants.findOne({
            where: { userId: id }
        });

        if (applicant) {

            let applicantuser = true;

            if (updates.password || updates.email || updates.name || updates.snSignIn || updates.root || updates.photo || updates.bio) {
                // Update user values

                if (updates.password)
                    updates.password = bcrypt.hashSync(updates.password, 10);

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
                    message: updates
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
}