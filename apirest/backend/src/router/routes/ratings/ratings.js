const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../../middlewares/authentication');

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
    app.get('/rating/:id([0-9]+)',
        checkToken,
        async(req, res, next) => {

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
                res.status(200).json({
                    ok: true,
                    message: updates
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

}