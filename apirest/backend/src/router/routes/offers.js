const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    // GET all offers
    app.get('/offers', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                offers: await db.offers.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one offer by id
    app.get('/offer/:id', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                offer: await db.offers.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single offer
    app.post('/offer', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body

        try {

            res.status(201).json({
                ok: true,
                offer: await db.offers.create({
                    fk_offerer: body.fk_offerer,
                    title: body.title,
                    description: body.description,
                    date_start: body.date_start,
                    date_end: body.date_end,
                    location: body.location,
                    salary: body.salary
                }),
                message: `Offer has been created.`
            });

        } catch (err) {
            next({ type: 'error', error: err });
        }

    });

    // PUT single offer
    app.put('/offer/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                offer: await db.offers.update(updates, {
                    where: { id }
                })
            });
            // json
            // offer: [1] -> Updated
            // offer: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single offer
    app.delete('/offer/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                offer: await db.offers.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // offer: 1 -> Deleted
            // offer: 0 -> Offer doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}