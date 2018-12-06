const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

//const { checks } = require('../../middlewares/validations')
//const { check, validationResult, checkSchema } = require('express-validator/check')
// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings rating_offerers
    app.get('/rating_offerers', checkToken, async(req, res, next) => {

        try {
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
                            enviroment: rating_applicants[j].enviroment,
                            partners: rating_applicants[j].partners,
                            services: rating_applicants[j].services,
                            instalations: rating_applicants[j].instalations,
                            createdAt: ratings[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                rating_offerers: rating_offerersView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
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
                    enviroment: rating_applicant.enviroment,
                    partners: rating_applicant.partners,
                    services: rating_applicant.services,
                    instalations: rating_applicant.instalations,
                    createdAt: rating.createdAt
                };

                res.status(200).json({
                    ok: true,
                    ratingRating_Offerer
                });
            } else {
                res.status(400).json({
                    ok: false,
                    message: 'Rating_Offerer doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single rating_offerer
    app.post('/rating_offerer', async(req, res, next) => {
        let transaction;
        let rating;

        try {
            const body = req.body;

            // get transaction
            transaction = await db.sequelize.transaction();


            // step 1
            // Have to be ratings from offerers and applicant both, so first,
            // search the application that user wants to rate
            let ratingBefore = await db.ratings.findOne({
                where: { fk_application: body.fk_application }
            });

            // If exists, create rating applicant with it,
            // if not, create new rating

            if (ratingBefore) {
                console.log("ya estaba rateado");
                rating = ratingBefore;
            } else {
                rating = await db.ratings.create({
                    fk_application: body.fk_application,
                    overall: body.overall ? body.overall : null
                }, { transaction: transaction });
            }

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

            return res.status(201).json({
                ok: true,
                message: `Rating_Offerer '${rating.name}' with id ${rating.id} has been created.`
            });
        } catch (err) {
            //await transaction.rollback();
            next({ type: 'error', error: err.message });
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
                    res.status(200).json({
                        ok: true,
                        message: updates
                    })
                } else {
                    return next({ type: 'error', error: 'Can\'t update rating_offerer' });
                }
            } else {
                return next({ type: 'error', error: 'Rating_Offerer doesn\'t exist' });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
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
                    res.json({
                        ok: true,
                        message: 'Rating_Offerer deleted'
                    });
                }
            } else {
                next({ type: 'error', error: 'Rating_Offerer doesn\'t exist' });
            }
            // Respuestas en json
            // rating_offerer: 1 -> Deleted
            // rating_offerer: 0 -> Rating don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createRating_Offerer(body, rating, next, transaction) {
        try {
            let rating_offerer = {
                ratingId: rating.id,
                salary: body.salary,
                enviroment: body.enviroment,
                partners: body.partners,
                services: body.services,
                instalations: body.instalations
            }

            let newRating_Offerer = await db.rating_offerers.create(rating_offerer, { transaction: transaction });

            return newRating_Offerer;

        } catch (err) {
            await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    }
}