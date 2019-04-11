const {checkAdmin} = require('../../middlewares/authentication');
const {logger, tokenId} = require('../../shared/functions');

// =======================================
// ======== CRUD invoices =========
// =======================================

module.exports = (app, db) => {

    // GET all invoices of offerer
    app.get('/invoices/offerer/:id([0-9]+)', async (req, res, next) => {
        getUserInvoices('offerers', req, res, next);
    });
    
    // GET all invoices of applicant
    app.get('/invoices/applicant/:id([0-9]+)', async (req, res, next) => {
        getUserInvoices('applicants', req, res, next);
    });

    // GET one invoice by id
    app.get('/invoice/:id([0-9]+)', async (req, res, next) => {
        getInvoiceById(req, res, next);
    });

    // POST single invoice
    app.post('/invoice', async (req, res, next) => {
        postInvoice( req, res, next );
    });

    // PUT single invoice
    app.put('/invoice/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        updateInvoice( req, res, next );
    });

    // DELETE single invoice
    app.delete('/invoice/:id([0-9]+)', checkAdmin, async (req, res, next) => {
        deleteInvoice( req, res, next );
    });
    
    async function getUserInvoices( table, req, res, next ) {
        const id = req.params.id;
        let herency = {};
        

        try {
            switch ( table ) {
                case 'offerers': herency = {
                                        model: db.offerers,
                                        as: 'offerer'
                                    }; 
                                break;
                case 'applicants': herency = {
                                        model: db.applicants,
                                        as: 'applicant'
                                    };
                                break;

            }

            await logger.saveLog('GET', 'invoices', null, res);
            
            let attr = {
                include: [{
                    model: db.invoices,
                    where: { fk_user: id }
                }, herency
                ],
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

            if ( invoices.length > 0 ) {
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
    }

    async function getInvoiceById( req, res, next ) {
        const id = req.params.id;

        try {
            let invoice = await db.invoices.findOne({ where: { id }});

            return res.status(200).json({
                ok: true,
                message: 'Showing invoice',
                date: invoice
            });

        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    }

    async function postInvoice( req, res, next ) {
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
    }

    async function updateInvoice( req, res, next ) {
        const id = req.params.id;
        const updates = req.body;

        try {
            await db.invoices.update(updates, {
                where: {id}
            });
            return res.status(200).json({
                ok: true,
                message: 'updated'
            });
        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }
    }

    async function deleteInvoice( req, res, next ) {
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
    }
};

