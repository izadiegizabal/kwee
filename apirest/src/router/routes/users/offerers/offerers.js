const { checkToken, checkAdmin } = require('../../../../middlewares/authentication');
const { tokenId, logger, sendVerificationEmail, pagination } = require('../../../../shared/functions');
const bcrypt = require('bcryptjs');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users offerers
    app.get('/offerers', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'offerers', null, res);

            var attributes = {};

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
                            img: users[i].img
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
        let statusName;
        let statusBool = false;
        if ( status >=0 && status <= 3 ) {
            statusBool = true;
        }
        let draft = 0;
        let open = 0;
        let selection = 0;
        let closed = 0;
        let pages = 0;

        
        try {
            await logger.saveLog('GET', 'offerer', id, res);
            
            let message = ``;

            // But paginated OFFERERS
            let offerer = await db.offerers.findOne({
                where: { userId: id }
            });
            
            if ( offerer ) {
                let offers = await offerer.getOffers();
                
                let count = offers.length;

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

                if( req.query.summary ){
                    var totalOffers = count;
                    count = [];
                    count.push("Total: " + totalOffers);
                    count.push("Draft: " + draft);
                    count.push("Open: " + open);
                    count.push("Selection: " + selection);
                    count.push("Closed: " + closed);
                }

                if( limit && page ) {
                    if ( offersWithStatus.length > 0 ) {
                        console.log("offersWithStatus.length: ", offersWithStatus.length);
                        pages = Math.ceil(offersWithStatus.length / limit);
                    } else {
                        console.log("offersWithStatus.length: ", offersWithStatus.length);
                        pages = Math.ceil(totalOffers / limit);
                    }
                    
                    offset = limit * (page - 1);
                    
                    if (page > pages) {
                        return res.status(400).json({
                            ok: false,
                            message: `It doesn't exist ${ page } pages. Total of pages ${ pages }`
                        })
                    }
                    if ( statusBool ){
                        offers = await db.offers.findAll({where: {fk_offerer: id, status }, limit, offset})
                    } else {
                        offers = await offerer.getOffers({limit, offset});
                    }
                    message = `Listing ${ limit } of this user. Page ${ page } of ${ pages }.`;
                } else {
                    message = `Listing all offers of this user.`;
                }

                if ( statusBool ) {
                    offers = offersWithStatus;
                    message += ` With status = ${ status }`
                }

                return res.json({
                    ok: true,
                    message,
                    data: offers,
                    count
                });

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

        try {
            await logger.saveLog('POST', 'offerer', null, res);

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

                        }, { transaction })
                        .then(_user => {
                            uservar = _user;
                            return createOfferer(body, _user, next, transaction);
                        })
                        .then(ending => {
                            sendVerificationEmail(body, uservar);
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
        const updates = req.body;

        try {
            let logId = await logger.saveLog('PUT', 'offerer', null, res);

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

        try {
            await logger.saveLog('PUT', 'offerer', id, res);
            updateOfferer(id, updates, res);
        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE
    app.delete('/offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'offerer', id, res);

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