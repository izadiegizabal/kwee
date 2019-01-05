const { checkToken } = require('../../middlewares/authentication');
const tokenId = require('../../shared/functions');

// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    // GET all offers
    app.get('/offers', async(req, res, next) => {
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
    app.get('/offer/:id([0-9]+)', async(req, res, next) => {
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
    app.post('/offer', async(req, res, next) => {

        let body = req.body

        try {
            let id = tokenId.getTokenId(req.get('token'));

            await db.offers.create({
                fk_offerer: id,
                title: body.title,
                description: body.description,
                dateStart: body.dateStart,
                dateEnd: body.dateEnd,
                location: body.location,
                salary: body.salary
            }).then(result => {
                return res.status(201).json({
                    ok: true,
                    offer: result,
                    message: `Offer has been created.`
                });
            });

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });

    // PUT single offer
    app.put('/offer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'));
            let offerUpdate = await db.offers.update(updates, {
                    where: { id, fk_offerer }
                }).then(result => {
                    return res.status(200).json({
                        ok: true,
                        offer: result
                    });
                })
                // json
                // offer: [1] -> Updated
                // offer: [0] -> Not updated
                // empty body will change 'updateAt'
        } catch (err) {
            return next({ type: 'error', error: err.message });
        }
    });

    // DELETE single offer
    app.delete('/offer/:id', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            let fk_offerer = tokenId.getTokenId(req.get('token'));
            res.json({
                ok: true,
                offer: await db.offers.destroy({
                    where: { id, fk_offerer }
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