const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings
    app.get('/ratings', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                ratings: await db.ratings.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });

    // GET one rating by id
    app.get('/rating/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {

            let rating = await db.ratings.findOne({
                where: { id }
            });

            if (rating) {
                res.status(200).json({
                    ok: true,
                    rating
                });
            } else {
                res.status(400).json({
                    ok: false,
                    message: 'Rating doesn\'t exist'
                });
            }


        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single rating
    app.post('/rating', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body;

        try {
            let rating = await db.ratings.create({
                fk_applicant: body.fk_applicant,
                fk_offer: body.fk_offer
            });

            if (rating) {
                if (body.type && (body.type === 'a' || body.type === 'o')) {
                    switch (body.type) {
                        case 'a':
                            createApplicantRating(body, rating, next);
                            break;

                        case 'o':
                            createOfferRating(body, rating, next);
                            break;
                    }
                } else {
                    await db.ratings.destroy({ where: { id: rating.id } });
                    next({ type: 'error', error: 'Must be \'type\' of rating, \'a\' (applicant) or \'o\' (offer)' });
                }
            }
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        };

    });

    // PUT single rating
    app.put('/rating/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                rating: await db.ratings.update(updates, {
                    where: { id }
                })
            });
            // json
            // rating: [1] -> Updated
            // rating: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single rating
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/rating/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                rating: await db.ratings.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // rating: 1 -> Deleted
            // rating: 0 -> Rating don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    async function createApplicantRating(body, rating, next) {
        if (body.efficience && body.skills && body.puntuality && body.hygiene && body.teamwork) {
            let rating_applicant = {};
            rating_applicant.ratingId = rating.id;
            rating_applicant.efficience = body.efficience;
            rating_applicant.skills = body.skills;
            rating_applicant.puntuality = body.puntuality;
            rating_applicant.hygiene = body.hygiene;
            rating_applicant.teamwork = body.teamwork;

            await db.rating_applicants.create(rating_applicant);
            console.log('Applicant rating created');
        } else {
            await db.ratings.destroy({ where: { id: rating.id } });
            next({ type: 'error', error: 'All ratings required' });
        }
    }

    async function createOfferRating(body, rating, next) {
        if (body.salary && body.enviroment && body.partners && body.services && body.instalations) {
            let rating_applicant = {};
            rating_applicant.ratingId = rating.id;
            rating_applicant.salary = body.salary;
            rating_applicant.enviroment = body.enviroment;
            rating_applicant.partners = body.partners;
            rating_applicant.services = body.services;
            rating_applicant.instalations = body.instalations;

            await db.rating_offerers.create(rating_applicant);
            console.log('Offer rating created');
        } else {
            await db.ratings.destroy({ where: { id: rating.id } });
            next({ type: 'error', error: 'All ratings required' });
        }
    }
}