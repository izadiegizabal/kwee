const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const { tokenId, logger, sendVerificationEmail } = require('../../../../shared/functions');
const bcrypt = require('bcrypt');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users offerers
    app.get('/offerers', async(req, res, next) => {
        await logger.saveLog('GET', 'offerers', null, res);
        try {
            let users = await db.users.findAll();
            let offerers = await db.offerers.findAll();
            let offerersView = [];

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
                            img: users[i].img
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                message: 'All offerers list',
                data: offerersView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // GET one offerer by id
    app.get('/offerer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        await logger.saveLog('GET', 'offerer', id, res);
        try {
            let users = await db.users.findOne({
                where: { id }
            });

            let offerers = await db.offerers.findOne({
                where: { userId: id }
            });

            console.log("fdasfdsa");
            if (users && offerers) {
                console.log("entra");
                const userOfferer = {
                    id: offerers.userId,
                    index: users.index,
                    name: users.name,
                    email: users.email,
                    address: offerers.address,
                    workField: offerers.workField,
                    cif: offerers.cif,
                    dateVerification: offerers.dateVerification,
                    website: offerers.website,
                    companySize: offerers.companySize,
                    year: offerers.year,
                    premium: offerers.premium,
                    createdAt: offerers.createdAt,
                    lastAccess: users.lastAccess,
                    status: users.status,
                    img: users.img

                };

                return res.status(200).json({
                    ok: true,
                    message: `Offerer ${ id } data`,
                    data: userOfferer
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
        await logger.saveLog('POST', 'offerer', null, res);
        let transaction;

        try {
            const body = req.body;
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;
            var uservar;
            return db.sequelize.transaction(transaction => {
                    return db.users.create({
                            name: body.name,
                            password,
                            email: body.email,

                            img: body.img,
                            bio: body.bio,

                        }, { transaction: transaction })
                        .then(_user => {
                            uservar = _user;
                            return createOfferer(body, _user, next, transaction);
                        })
                        .then(ending => {
                            sendVerificationEmail(body,uservar);
                            return res.status(201).json({
                                ok: true,
                                message: `Offerer with id ${ending.userId} has been created.`
                            });
                        })
                })
                .catch(err => {
                    return next({ type: 'error', error: err.message });
                })

        } catch (err) {
            //await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    });

    // Update offerer by themself
    app.put('/offerer', async(req, res, next) => {
        let logId = await logger.saveLog('PUT', 'offerer', null, res);
        const updates = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            logger.updateLog(logId, id);
            updateOfferer(id, updates, res);
        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // Update offerer by admin
    app.put('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;
        await logger.saveLog('PUT', 'offerer', id, res);

        try {
            updateOfferer(id, updates, res);
        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE
    app.delete('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        await logger.saveLog('DELETE', 'offerer', id, res);

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

    async function updateOfferer(id, updates, res) {

        const offerer = await db.offerers.findOne({
            where: { userId: id }
        });

        if (offerer) {

            let offereruser = true;

            if (updates.password || updates.email || updates.name || updates.snSignIn || updates.root || updates.img || updates.bio) {
                // Update user values
                if (updates.password)
                    updates.password = bcrypt.hashSync(updates.password, 10);

                offereruser = await db.users.update(updates, {
                    where: { id: id }
                })
            }

            let updated = await db.offerers.update(updates, {
                where: { userId: id }
            });

            if (updated && offereruser) {
                return res.status(200).json({
                    ok: true,
                    message: `Values updated for offerer ${ id }`,
                    data: updates
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
                premium: body.premium ? body.premium : 'basic'
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
}