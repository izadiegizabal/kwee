const { checkToken, checkAdmin } = require('../../../middlewares/authentication');
const { logger, tokenId } = require('../../../shared/functions');
const bcrypt = require('bcryptjs');
const { algorithm } = require('../../../shared/algorithm');

// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings rating_offerers
    app.get('/rating_offerers', checkToken, async(req, res, next) => {

        try {
            await logger.saveLog('GET', 'rating_offerers', null, res);

            let ratings = await db.ratings.findAll();
            let rating_offerers = await db.rating_offerers.findAll();
            let rating_offerersView = [];

            for (let i = 0; i < ratings.length; i++) {
                for (let j = 0; j < rating_offerers.length; j++) {
                    if (ratings[i].id === rating_offerers[j].ratingId) {
                        rating_offerersView[j] = {
                            id: rating_offerers[j].ratingId,
                            fk_applicant: ratings[i].fk_applicant,
                            fk_offer: ratings[i].fk_offer,
                            overall: ratings[j].overall,
                            salary: rating_applicants[j].salary,
                            environment: rating_applicants[j].environment,
                            partners: rating_applicants[j].partners,
                            services: rating_applicants[j].services,
                            installations: rating_applicants[j].installations,
                            createdAt: ratings[j].createdAt
                        }
                    }
                }
            }
            return res.status(200).json({
                ok: true,
                message: 'Rating offerers list',
                data: rating_offerersView
            });
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });

    // GET rating_offerers by page limit to 10 rating_offerers/page
    app.get('/rating_offerers/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `rating_offerers/${ page }`, null, res);
            let count = await db.rating_offerers.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${ page } pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${ limit } rating_offerers of page ${ page } of ${ pages } pages`,
                data: await db.rating_offerers.findAll({
                    limit,
                    offset,
                    $sort: { id: 1 }
                }),
                total: count.count
            });
        } catch (err) {
            return next({ type: 'error', error: err });
        }
    });

    // GET one rating_offerer by id
    app.get('/rating_offerer/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let rating = await db.ratings.findOne({
                where: { id }
            });

            let rating_offerer = await db.rating_offerers.findOne({
                where: { ratingId: id }
            });

            if (rating && rating_offerer) {
                const ratingRating_Offerer = {
                    id: rating_offerer.ratingId,
                    fk_applicant: rating.fk_applicant,
                    fk_offer: rating.fk_offer,
                    overall: rating.overall,
                    salary: rating_applicant.salary,
                    environment: rating_applicant.environment,
                    partners: rating_applicant.partners,
                    services: rating_applicant.services,
                    installations: rating_applicant.installations,
                    createdAt: rating.createdAt
                };

                return res.status(200).json({
                    ok: true,
                    message: 'Rating offerer list',
                    data: ratingRating_Offerer
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'Rating_Offerer doesn\'t exist'
                });
            }
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single rating_offerer
    app.post('/rating_offerer', async(req, res, next) => {
        let transaction;
        let rating;

        try {
            const body = req.body;
            let id = tokenId.getTokenId(req.get('token'));
            let fk_application = body.fk_application;
            let overall;
            let opinion;
            if( body.opinion ) opinion = body.opinion;

            overall = (body.satisfaction + body.salary + body.environment + body.partners + body.services + body.installations) / 6;

            let applicant = await db.applicants.findOne({where: { userId: id }});
            let application = await db.applications.findOne({where: { id: fk_application }});
            
            if ( application ) {
                if ( applicant ) {
                    if ( application.fk_applicant == id ) {
                        if ( application.aHasRated ) {
                            return res.status(400).json({
                                ok: false,
                                message: 'It is already rated'
                            });
                        } else {
                            
                            // get transaction
                            transaction = await db.sequelize.transaction();
                            
                            rating = await db.ratings.create({
                                fk_application,
                                overall,
                                opinion
                            }, { transaction: transaction });
                            
                            
                            if (!rating) {
                                await transaction.rollback();
                            }
                            
                            // step 2
                            let rating_offerer = await createRating_Offerer(body, rating, next, transaction);

                            if (!rating_offerer) {
                                await transaction.rollback();
                            }
                            
                            // commit
                            await transaction.commit();
                            
                            // to check + clean
                            await db.applications.update({aHasRated: 1}, {
                                where: { id: fk_application }
                            });
                            await algorithm.indexUpdate(id);
                            
                            
                            return res.status(201).json({
                                ok: true,
                                message: 'Offerer rated as applicant'
                            });
                        }
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: 'You may not rate offerers of others applicants'
                        });
                    }
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'You are not applicant to use this route'
                    });
                }
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'No application with this id'
                });
            }
        } catch (err) {
            //await transaction.rollback();
            return next({ type: 'error', error: err.message });
        }
    });

    // PUT single rating_offerer
    app.put('/rating_offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let rating_offerer = await db.rating_offerers.findOne({
                where: { ratingId: id }
            });

            if (rating_offerer) {
                let updated = await db.rating_offerers.update(updates, {
                    where: { ratingId: id }
                });
                if (updated) {
                    await algorithm.indexUpdate(id);

                    return res.status(200).json({
                        ok: true,
                        message: 'Updates successful',
                        data: updates
                    })
                } else {
                    return next({ type: 'error', error: 'Can\'t update rating_offerer' });
                }
            } else {
                return next({ type: 'error', error: 'Rating_Offerer doesn\'t exist' });
            }

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE
    app.delete('/rating_offerer/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            let rating_offerer = await db.rating_offerers.findOne({
                where: { ratingId: id }
            });

            if (rating_offerer) {
                let rating_offererToDelete = await db.rating_offerers.destroy({ where: { ratingId: id } });
                let rating_applicant = await db.rating_applicants.destroy({ where: { ratingId: id } }); // search first?
                let rating = await db.ratings.destroy({ where: { id } });

                if (rating_offererToDelete && rating && rating_applicant) {
                    await algorithm.indexUpdate(id);

                    return res.json({
                        ok: true,
                        message: 'Rating_Offerer deleted'
                    });
                }
            } else {
                return next({ type: 'error', error: 'Rating_Offerer doesn\'t exist' });
            }
            // Respuestas en json
            // rating_offerer: 1 -> Deleted
            // rating_offerer: 0 -> Rating don't exists
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createRating_Offerer(body, rating, next, transaction) {
        try {
            let rating_offerer = {
                ratingId: rating.id,
                salary: body.salary,
                environment: body.environment,
                partners: body.partners,
                services: body.services,
                installations: body.installations,
                satisfaction: body.satisfaction
            }

            let newRating_Offerer = await db.rating_offerers.create(rating_offerer, { transaction: transaction });

            return newRating_Offerer;

        } catch (err) {
            await transaction.rollback();
            return next({ type: 'error', error: err.message });
        }
    }
}