const { checkToken, checkAdmin } = require('../../../middlewares/authentication');
const { logger } = require('../../../shared/functions');
const bcrypt = require('bcrypt');

// ============================
// ======== CRUD rating =========
// ============================

module.exports = (app, db) => {

    // GET all ratings
    app.get('/ratings', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'ratings', null, res);

            return res.status(200).json({
                ok: true,
                message: 'All ratings list',
                data: await db.ratings.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });

    // GET ratings by page limit to 10 ratings/page
    app.get('/ratings/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `ratings/${ page }`, null, res);

            let count = await db.ratings.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(400).json({
                    ok: false,
                    message: `It doesn't exist ${ page } pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${ limit } ratings of page ${ page } of ${ pages } pages`,
                data: await db.ratings.findAll({
                    limit,
                    offset,
                    $sort: { id: 1 }
                }),
                total: count.count
            });
        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

    // GET one rating by id
    app.get('/rating/:id([0-9]+)',
        checkToken,
        async(req, res, next) => {

            const id = req.params.id;

            try {

                let rating = await db.ratings.findOne({
                    where: { id }
                });

                if (rating) {
                    return res.status(200).json({
                        ok: true,
                        message: `${id} ratings`,
                        data: rating
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'Rating doesn\'t exist'
                    });
                }


            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });


    app.post('/rating', async(req, res, next) => {

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
                next({ type: 'error', error: 'Error creating rating' });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    // PUT single rating
    app.put('/rating/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;

            let updated = await db.ratings.update(updates, {
                where: { id }
            });
            if (updated) {
                return res.status(200).json({
                    ok: true,
                    message: `Updated single rating`,
                    data: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });


    // DELETE single rating
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/rating/:id([0-9]+)', [checkToken, checkAdmin /*, check*/ ], async(req, res, next) => {
        const id = req.params.id;

        try {
            return res.json({
                ok: true,
                message: 'Rating deleted',
                data: await db.ratings.destroy({
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

}