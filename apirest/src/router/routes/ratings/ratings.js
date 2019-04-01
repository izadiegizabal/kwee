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
            let attr = {};
            attr.where = { userRated: id };
            if ( req.query.limit && req.query.page ) {
                var limit = Number(req.query.limit);
                var page = Number(req.query.page)
                var offset = req.query.limit * (req.query.page - 1)
                attr.limit = limit;
                attr.offset = offset;
            } 
            let rating = [];
            let applicant = await db.applicants.findOne({ where: { userId: id }});

            if ( applicant ) {
                rating = await db.rating_applicants.findAll(attr);
                
            } else {
                if ( offerer ) {
                    rating = await db.rating_offerers.findAll(attr);
                } else {
                    return next({type: 'error', error: 'No user with this id'});   
                }
            }
            if ( rating.length > 0 ) {
                return res.json({
                    ok: true,
                    message: `Listing all rates done to user ${ id }`,
                    data: rating,
                    total: rating.length
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
