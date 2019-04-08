const {checkToken, checkAdmin} = require('../../../middlewares/authentication');
const {logger} = require('../../../shared/functions');

// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings
    app.get('/ratings', checkToken, async (req, res, next) => {
        try {
            await logger.saveLog('GET', 'ratings', null, res);

            return res.status(200).json({
                ok: true,
                message: 'All ratings list',
                data: await db.ratings.findAll()
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }

    });

    // GET ratings by page limit to 10 ratings/page
    app.get('/ratings/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `ratings/${page}`, null, res);

            let count = await db.ratings.findAndCountAll();
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
                message: `${limit} ratings of page ${page} of ${pages} pages`,
                data: await db.ratings.findAll({
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

    // GET all ratings of user ID
    app.get('/ratings/user/:id([0-9]+)', checkToken, async (req, res, next) => {
        let id = req.params.id;

        try {
            let count;
            let attr = {};
            let where = { userRated: id };
            let ratingsToShow = [];
            attr.where = where;
            if ( req.query.limit && req.query.page ) {
                var limit = Number(req.query.limit);
                var page = Number(req.query.page)
                var offset = req.query.limit * (req.query.page - 1)
                attr.limit = limit;
                attr.offset = offset;
            }
            let ratingA = [];
            let ratingO = [];
            let applicants = await db.applicants.findAll();
            let applicant = applicants.find( appli => appli.userId == id );

            if ( applicant ) {
                count = await db.rating_applicants.findAndCountAll({ where });
                ratingA = await db.rating_applicants.findAll(attr);
                
            } else {
                let offerers = await db.offerers.findAll({ where: { userId: id }});
                let offerer = offerers.find( off => off.userId == id);
                if ( offerer ) {
                    count = await db.rating_offerers.findAndCountAll({ where });
                    ratingO = await db.rating_offerers.findAll(attr);
                } else {
                    return next({type: 'error', error: 'No user with this id'});   
                }
            }

            if ( count.count > 0 ) {
                let ratingTable = await db.ratings.findAll();
                let applications = await db.applications.findAll();
                let offers = await db.offers.findAll();
                let users = await db.users.findAll();
                // We need agregate info that is in rating table
                if ( ratingA.length > 0 ) {
                    ratingA.forEach( rate => {
                        let object = {};
                        let ratingFind = ratingTable.find( element => element.id == rate.ratingId );
                        let applicationFind = applications.find( application => application.id == ratingFind.fk_application );
                        let offer = offers.find( off => off.id == applicationFind.fk_offer );
                        let user = users.find( usu => usu.id == offer.fk_offerer );
                        object.id = rate.ratingId;
                        object.userName = user.name;
                        object.title = offer.title;
                        object.overall = ratingFind.overall;
                        object.opinion = ratingFind.opinion;
                        object.efficiency = rate.efficiency;
                        object.skills = rate.skills;
                        object.punctuality = rate.punctuality;
                        object.hygiene = rate.hygiene;
                        object.teamwork = rate.teamwork;
                        object.satisfaction = rate.satisfaction;
                        object.createdAt = rate.createdAt;
                        ratingsToShow.push(object);
                    });
                }
                    
                if ( ratingO.length > 0 ){
                    ratingO.forEach( rate => {
                        let object = {};
                        let ratingFind = ratingTable.find( element => element.id == rate.ratingId );
                        let applicationFind = applications.find( application => application.id == ratingFind.fk_application );
                        let offer = offers.find( off => off.id == applicationFind.fk_offer );
                        let user = users.find( usu => usu.id == applicationFind.fk_applicant );
                        object.id = rate.ratingId;
                        object.userName = user.name;
                        object.title = offer.title;
                        object.overall = ratingFind.overall;
                        object.opinion = ratingFind.opinion;
                        object.satisfaction = rate.satisfaction;
                        object.salary = rate.salary;
                        object.environment = rate.environment;
                        object.partners = rate.partners;
                        object.services = rate.services;
                        object.installations = rate.installations;
                        object.createdAt = rate.createdAt;
                        ratingsToShow.push(object);
                    });
                }

                return res.json({
                    ok: true,
                    message: `Listing all rates done to user ${ id }`,
                    data: ratingsToShow,
                    total: count.count,
                    page,
                    limit
                });
            } else {
                return next({type: 'error', error: 'This user does not have rates yet'});
            }
        } catch (error) {
            return next({type: 'error', error: error.message});
        }

    });

    // GET one rating by id
    app.get('/rating/:id([0-9]+)',
        checkToken,
        async (req, res, next) => {

            const id = req.params.id;

            try {

                let rating = await db.ratings.findOne({
                    where: {id}
                });

                if (rating) {
                    return res.status(200).json({
                        ok: true,
                        message: `${id} ratings`,
                        data: rating
                    });
                } else {
                    return res.status(200).json({
                        ok: true,
                        message: 'Rating doesn\'t exist'
                    });
                }


            } catch (err) {
                return next({type: 'error', error: 'Error getting data'});
            }
        });


    app.post('/rating', async (req, res, next) => {

        try {

            const body = req.body;

            let rating = await db.ratings.create({
                fk_application: body.fk_application,
                overall: body.overall ? body.overall : null
            });

            if (rating) {
                return res.status(201).json({
                    ok: true,
                    message: `Rating has been created.`
                });
            } else {
                return next({type: 'error', error: 'Error creating rating'});
            }

        } catch (err) {
            return next({type: 'error', error: err.message});
        }
    });

    // PUT single rating
    app.put('/rating/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;

            let updated = await db.ratings.update(updates, {
                where: {id}
            });
            if (updated) {
                return res.status(200).json({
                    ok: true,
                    message: `Updated single rating`,
                    data: updates
                })
            }

        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }
    });


    // DELETE single rating
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/rating/:id([0-9]+)', [checkToken, checkAdmin /*, check*/], async (req, res, next) => {
        const id = req.params.id;

        try {
            return res.json({
                ok: true,
                message: 'Rating deleted',
                data: await db.ratings.destroy({
                    where: {id: id}
                })
            });
            // Respuestas en json
            // rating: 1 -> Deleted
            // rating: 0 -> Rating don't exists
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

};
