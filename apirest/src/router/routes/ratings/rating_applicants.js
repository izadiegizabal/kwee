const {checkToken, checkAdmin} = require('../../../middlewares/authentication');
const {logger, tokenId} = require('../../../shared/functions');
const {algorithm} = require('../../../shared/algorithm');
const moment = require('moment');


// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings rating_applicants
    app.get('/rating_applicants', async (req, res, next) => {

        try {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('GET', 'rating_applicants', null, res, req.useragent, ip);

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
                            efficiency: rating_applicants[j].efficiency,
                            skills: rating_applicants[j].skills,
                            punctuality: rating_applicants[j].punctuality,
                            hygiene: rating_applicants[j].hygiene,
                            teamwork: rating_applicants[j].teamwork,
                            createdAt: ratings[j].createdAt
                        }
                    }
                }
            }
            return res.status(200).json({
                ok: true,
                message: 'Rating applicants list',
                data: rating_applicantsView
            });
        } catch (err) {
            return next({type: 'error', error: err.message});
        }

    });

    // GET rating_applicants by page limit to 10 rating_applicants/page
    app.get('/rating_applicants/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        try {
            await logger.saveLog('GET', `rating_applicants/${page}`, null, res, req.useragent, ip);

            let count = await db.rating_applicants.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${page} pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${limit} rating_applicants of page ${page} of ${pages} pages`,
                data: await db.rating_applicants.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            return next({type: 'error', error: err});
        }
    });

    // GET one rating_applicant by id
    app.get('/rating_applicant/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;

        try {
            let ratings = await db.ratings.findAll({where: {fk_application: id}});
            let rating_applicants = await db.rating_applicants.findAll();
            let rating_applicant, rating;

            for (let i = 0; i < ratings.length; i++) {
                for (let j = 0; j < rating_applicants.length; j++) {
                    if (ratings[i].id === rating_applicants[j].ratingId) {
                        rating = ratings[i];
                        rating_applicant = rating_applicants[j];
                        break;
                    }
                }
            }

            if (rating && rating_applicant) {
                const ratingApplicant = {
                    id: rating.id,
                    overall: rating_applicant.overall,
                    efficiency: rating_applicant.efficiency,
                    skills: rating_applicant.skills,
                    punctuality: rating_applicant.punctuality,
                    hygiene: rating_applicant.hygiene,
                    teamwork: rating_applicant.teamwork,
                    satisfaction: rating_applicant.satisfaction,
                    createdAt: rating_applicant.createdAt
                };

                return res.status(200).json({
                    ok: true,
                    ratingApplicant
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'RatingApplicant doesn\'t exist',
                });
            }
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single rating_applicant
    app.post('/rating_applicant', async (req, res, next) => {
        let transaction;
        let rating;

        try {
            const body = req.body;
            let id = tokenId.getTokenId(req.get('token'), res);
            let fk_application = body.fk_application;
            let overall;
            let opinion;
            if (body.opinion) opinion = body.opinion;

            overall = (body.efficiency + body.skills + body.punctuality + body.hygiene + body.teamwork + body.satisfaction) / 6;

            let offerer = await db.offerers.findOne({where: {userId: id}});
            let application = await db.applications.findOne({where: {id: fk_application}});

            if (application) {
                if (offerer) {
                    let offers = await offerer.getOffers();
                    let offer = offers.find(o => o.id == application.fk_offer);
                    if (offer) {

                        if (application.oHasRated) {
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
                            }, {transaction: transaction});


                            if (!rating) {
                                await transaction.rollback();
                            }

                            // step 2
                            let rating_applicant = await createRatingApplicant(body, application, rating, next, transaction);

                            if (!rating_applicant) {
                                await transaction.rollback();
                            }

                            // commit
                            await transaction.commit();

                            // to check + clean
                            await db.applications.update({ oHasRated: 1, oHasRatedDate: moment() }, {
                                where: {id: fk_application}
                            });
                            await algorithm.indexUpdate(application.fk_applicant);


                            return res.status(201).json({
                                ok: true,
                                message: 'Applicant rated as offerer'
                            });
                        }
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: 'You may not rate applicants of others offerers'
                        });
                    }
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'You are not offerer to use this route'
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
            return next({type: 'error', error: err.message});
        }
    });

    // PUT single rating_applicant
    app.put('/rating_applicant/:id([0-9]+)', async (req, res, next) => {
        const ratingId = req.params.id;
        const body = req.body;
        let opinion;
        if (req.body.opinion) opinion = req.body.opinion;
        delete body.opinion;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);

            let offerer = await db.offerers.findOne({where: {userId: id}});
            let offers = await offerer.getOffers();

            let rating_applicant = await db.rating_applicants.findOne({
                where: {ratingId}
            });

            if (rating_applicant) {
                let fk_application = await db.ratings.findOne({where: {id: ratingId}});
                let application = await db.applications.findOne({where: {id: fk_application.fk_application}});
                let offer = offers.find(element => element.id == application.fk_offer);
                if (application.fk_offer == offer.id) {
                    let rating = {};
                    let efficiency = body.efficiency ? body.efficiency : rating_applicant.efficiency;
                    let skills = body.skills ? body.skills : rating_applicant.skills;
                    let punctuality = body.punctuality ? body.punctuality : rating_applicant.punctuality;
                    let hygiene = body.hygiene ? body.hygiene : rating_applicant.hygiene;
                    let teamwork = body.teamwork ? body.teamwork : rating_applicant.teamwork;
                    let satisfaction = body.satisfaction ? body.satisfaction : rating_applicant.satisfaction;
                    rating.overall = (efficiency + skills + punctuality + hygiene + teamwork + satisfaction) / 6;

                    if (opinion) rating.opinion = opinion;
                    await db.ratings.update(rating, {
                        where: {id: ratingId}
                    });

                    let updated = await db.rating_applicants.update(body, {
                        where: {ratingId}
                    });

                    if (updated) {
                        await algorithm.indexUpdate(id);

                        return res.status(200).json({
                            ok: true,
                            message: 'Update successful'
                        })
                    } else {
                        return next({type: 'error', error: 'Can\'t update rating_applicant'});
                    }
                } else {
                    return next({type: 'error', error: 'You are not applicant of this application'});
                }
            } else {
                return next({type: 'error', error: 'This rate does not exist'});
            }

        } catch (err) {
            return next({type: 'error', error: err.message});
        }
    });

    // DELETE by themeself
    app.delete('/rating_applicant/:id([0-9]+)', async (req, res, next) => {
        const ratingId = req.params.id;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);

            let offerer = await db.offerers.findOne({where: {userId: id}});
            let offers = await offerer.getOffers();

            let rating_applicant = await db.rating_applicants.findOne({
                where: {ratingId}
            });

            if (rating_applicant) {
                let fk_application = await db.ratings.findOne({where: {id: ratingId}});
                let application = await db.applications.findOne({where: {id: fk_application.fk_application}});
                let offer = offers.find(element => element.id == application.fk_offer);

                if (application.fk_offer == offer.id) {
                    await db.rating_applicants.destroy({where: {ratingId}});
                    await db.ratings.destroy({where: {id: ratingId}});
                    await algorithm.indexUpdate(id);

                    return res.json({
                        ok: true,
                        message: 'RatingApplicant deleted'
                    });
                } else {
                    return next({type: 'error', error: 'You may not delete ratings of others users'});
                }
            } else {
                return next({type: 'error', error: 'RatingApplicant doesn\'t exist'});
            }
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // DELETE by admin
    app.delete('/rating_applicant/admin/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;

        try {
            let rating_applicant = await db.rating_applicants.findOne({
                where: {ratingId: id}
            });

            if (rating_applicant) {
                let rating_applicantToDelete = await db.rating_applicants.destroy({where: {ratingId: id}});
                let rating_offerer = await db.rating_offerers.destroy({where: {ratingId: id}}); // Search first?
                let rating = await db.ratings.destroy({where: {id}});

                if (rating_applicant && rating && rating_offerer) {
                    await algorithm.indexUpdate(id);

                    res.json({
                        ok: true,
                        message: 'RatingApplicant deleted'
                    });
                }
            } else {
                return next({type: 'error', error: 'RatingApplicant doesn\'t exist'});
            }
            // Respuestas en json
            // rating_applicant: 1 -> Deleted
            // rating_applicant: 0 -> Rating don't exists
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    async function createRatingApplicant(body, application, rating, next, transaction) {
        try {
            let rating_applicant = {};

            rating_applicant.ratingId = rating.id;
            rating_applicant.userRated = application.fk_applicant;
            rating_applicant.efficiency = body.efficiency;
            rating_applicant.skills = body.skills;
            rating_applicant.punctuality = body.punctuality;
            rating_applicant.hygiene = body.hygiene;
            rating_applicant.teamwork = body.teamwork;
            rating_applicant.satisfaction = body.satisfaction;

            let newRating_applicant = await db.rating_applicants.create(rating_applicant, {transaction: transaction});

            return newRating_applicant;

        } catch (err) {
            await transaction.rollback();
            return next({type: 'error', error: err.message});
        }
    }
};
