const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// =======================================
// ======== CRUD invoices =========
// =======================================

module.exports = (app, db) => {

    // GET all invoices
    app.get('/invoices', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                invoices: await db.invoices.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one invoice by id
    app.get('/invoice/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                invoice: await db.invoices.findOne({ where: { id } })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single invoice
    app.post('/invoice', [checkToken, checkAdmin], async(req, res, next) => {
        const body = req.body;

        try {
            let invoice = await db.invoices.create({
                fk_applicant: body.fk_applicant,
                fk_offer: body.fk_offer
            });

            if (invoice) {
                res.status(201).json({
                    ok: true,
                    message: `Invoice with id ${invoice.id} has been created.`
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        };

    });

    // PUT single invoice
    app.put('/invoice/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                invoice: await db.invoices.update(updates, {
                    where: { id }
                })
            });
            // json
            // invoice: [1] -> Updated
            // invoice: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // DELETE single invoice
    app.delete('/invoice/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                invoice: await db.invoices.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // invoice: 1 -> Deleted
            // invoice: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}