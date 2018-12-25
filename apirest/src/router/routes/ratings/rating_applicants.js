const { checkToken, checkAdmin } = require('../../../middlewares/authentication');
const bcrypt = require('bcrypt');

// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings rating_applicants
    app.get('/rating_applicants', checkToken, async(req, res, next) => {

        try {
            let ratings = await db.ratings.findAll();
            let rating_applicants = await db.rating_applicants.findAll();
            let rating_applicantsView = [];

            for (let i = 0; i < ratings.length; i++) {
                for (let j = 0; j < rating_applicants.length; j++) {
                    if (ratings[i].id === rating_applicants[j].ratingId) {
                        rating_applicantsView[j] = {
                            id: rating_applicants[j].ratingId,
                            fk_applicant: ratings[i].fk_applicant,
                            fk_offer: ratings[i].fk_offer,
                            overall: ratings[j].overall,
                            efficience: rating_applicants[j].efficience,
                            skills: rating_applicants[j].skills,
                            puntuality: rating_applicants[j].puntuality,
                            hygiene: rating_applicants[j].hygiene,
                            teamwork: rating_applicants[j].teamwork,
                            createdAt: ratings[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                rating_applicants: rating_applicantsView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // GET one rating_applicant by id
    app.get('/rating_applicant/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let rating = await db.ratings.findOne({
                where: { id }
            });

            let rating_applicant = await db.rating_applicants.findOne({
                where: { ratingId: id }
            });

            if (rating && rating_applicant) {
                const ratingApplicant = {
                    id: rating.id,
                    overall: rating_applicant.overall,
                    efficience: rating_applicant.efficience,
                    skills: rating_applicant.skills,
                    puntuality: rating_applicant.puntuality,
                    hygiene: rating_applicant.hygiene,
                    teamwork: rating_applicant.teamwork,
                    createdAt: rating_applicant.createdAt
                };

                res.status(200).json({
                    ok: true,
                    ratingApplicant
                });
            } else {
                res.status(400).json({
                    ok: false,
                    message: 'RatingApplicant doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single rating_applicant
    app.post('/rating_applicant', async(req, res, next) => {
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
            let rating_applicant = await createRatingApplicant(body, rating, next, transaction);

            if (!rating_applicant) {
                await transaction.rollback();
            }

            // commit
            await transaction.commit();

            return res.status(201).json({
                ok: true,
                message: `RatingApplicant '${rating.name}' with id ${rating.id} has been created.`
            });
        } catch (err) {
            //await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    });

    // PUT single rating_applicant
    app.put('/rating_applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let rating_applicant = await db.rating_applicants.findOne({
                where: { ratingId: id }
            });

            if (rating_applicant) {
                let updated = await db.rating_applicants.update(updates, {
                    where: { ratingId: id }
                });
                if (updated) {
                    res.status(200).json({
                        ok: true,
                        message: updates
                    })
                } else {
                    return next({ type: 'error', error: 'Can\'t update RatingApplicant' });
                }
            } else {
                return next({ type: 'error', error: 'RatingApplicant doesn\'t exist' });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // DELETE
    app.delete('/rating_applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            let rating_applicant = await db.rating_applicants.findOne({
                where: { ratingId: id }
            });

            if (rating_applicant) {
                let rating_applicantToDelete = await db.rating_applicants.destroy({ where: { ratingId: id } });
                let rating_offerer = await db.rating_offerers.destroy({ where: { ratingId: id } }); // Search first?
                let rating = await db.ratings.destroy({ where: { id } });

                if (rating_applicant && rating && rating_offerer) {
                    res.json({
                        ok: true,
                        message: 'RatingApplicant deleted'
                    });
                }
            } else {
                next({ type: 'error', error: 'RatingApplicant doesn\'t exist' });
            }
            // Respuestas en json
            // rating_applicant: 1 -> Deleted
            // rating_applicant: 0 -> Rating don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createRatingApplicant(body, rating, next, transaction) {
        try {
            let rating_applicant = {};

            rating_applicant.ratingId = rating.id;
            rating_applicant.efficience = body.efficience;
            rating_applicant.skills = body.skills;
            rating_applicant.puntuality = body.puntuality;
            rating_applicant.hygiene = body.hygiene;
            rating_applicant.teamwork = body.teamwork;

            let newRating_applicant = await db.rating_applicants.create(rating_applicant, { transaction: transaction });

            return newRating_applicant;

        } catch (err) {
            await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    }
}