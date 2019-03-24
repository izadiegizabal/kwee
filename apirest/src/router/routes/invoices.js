const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { logger, tokenId } = require('../../shared/functions');

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
    app.get('/invoices/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `invoices/${ page }`, null, res);

            let count = await db.invoices.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
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
    app.post('/invoice', async(req, res, next) => {
        const body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let user = await db.users.findOne({ where: { id } });

            let invoice = await db.invoices.create({
                fk_user: id, 
                userName: user.name,
                product: body.product,
                price: body.price
            });

            if ( invoice ) {
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
            return res.status(200).json({
                ok: true,
                invoice: await db.invoices.update(updates, {
                    where: { id }
                })
            });
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // DELETE single invoice
    app.delete('/invoice/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            return res.json({
                ok: true,
                invoice: await db.invoices.destroy({
                    where: { id: id }
                })
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}