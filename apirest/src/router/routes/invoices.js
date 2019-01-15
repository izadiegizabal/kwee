const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { logger } = require('../../shared/functions');

// =======================================
// ======== CRUD invoices =========
// =======================================

module.exports = (app, db) => {

    // GET all invoices
    app.get('/invoices', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'invoices', null, res);

            return res.status(200).json({
                ok: true,
                invoices: await db.invoices.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET invoices by page limit to 10 invoices/page
    app.get('/invoices/:page([0-9]+)', async(req, res, next) => {
        let limit = 10;
        let page = req.params.page;

        try {
            await logger.saveLog('GET', `invoices/${ page }`, null, res);

            let count = await db.invoices.findAndCountAll();
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
                message: `${ limit } invoices of page ${ page } of ${ pages } pages`,
                data: await db.invoices.findAll({
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
                fk_application: body.fk_application,
            });

            if (invoice) {
                res.status(201).json({
                    ok: true,
                    message: `Invoice with id ${invoice.id} has been created.`
                });
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        };

    });

    // PUT single invoice
    app.put('/invoice/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
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
    app.delete('/invoice/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
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