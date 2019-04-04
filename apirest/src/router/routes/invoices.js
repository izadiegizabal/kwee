const {checkAdmin} = require('../../middlewares/authentication');
const {logger, tokenId} = require('../../shared/functions');

// =======================================
// ======== CRUD invoices =========
// =======================================

module.exports = (app, db) => {

    // GET all invoices of user

    app.get('/invoices/user/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;
        try {
            await logger.saveLog('GET', 'invoices', null, res);
            
            let attr = {
                include: [{
                    model: db.invoices,
                    where: { fk_user: id }
                }],
                attributes: {
                    exclude: ["password"]
                }
            }
            if ( req.query.limit && req.query.page ) {
                var limit = Number(req.query.limit);
                var page = Number(req.query.page)
                var offset = limit * (page - 1)
                attr.limit = limit;
                attr.offset = offset;
            }
            
            let invoices = await db.users.findAll(attr);

            if ( invoices ) {
                return res.status(200).json({
                    ok: true,
                    message: 'Listing all invoices',
                    data: invoices
                });
            } else {
                return next({type: 'error', error: 'No invoices'});
            }
        } catch (err) {
            next({type: 'error', error: err.message});
        }
    });

    // GET invoices by page limit to 10 invoices/page
    app.get('/invoices/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `invoices/${page}`, null, res);

            let count = await db.invoices.findAndCountAll();
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
                message: `${limit} invoices of page ${page} of ${pages} pages`,
                data: await db.invoices.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // GET one invoice by id
    app.get('/invoice/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                invoice: await db.invoices.findOne({where: {id}})
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single invoice
    app.post('/invoice', async (req, res, next) => {
        const body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let user = await db.users.findOne({where: {id}});

            let invoice = await db.invoices.create({
                fk_user: id,
                userName: user.name,
                product: body.product,
                price: body.price
            });

            if (invoice) {
                res.status(201).json({
                    ok: true,
                    message: `Invoice with id ${invoice.id} has been created.`
                });
            }

        } catch (err) {
            next({type: 'error', error: err.message});
        }
    });

    // PUT single invoice
    app.put('/invoice/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            return res.status(200).json({
                ok: true,
                invoice: await db.invoices.update(updates, {
                    where: {id}
                })
            });
        } catch (err) {
            next({type: 'error', error: err.errors[0].message});
        }

    });

    // DELETE single invoice
    app.delete('/invoice/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        const id = req.params.id;

        try {
            return res.json({
                ok: true,
                invoice: await db.invoices.destroy({
                    where: {id: id}
                })
            });
        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });
};
