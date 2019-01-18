const { checkToken } = require('../../middlewares/authentication');
const { tokenId, logger, pagination } = require('../../shared/functions');

// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    // GET all offers
    app.get('/offers', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'offers', null, res);

            var offers;
            
            var attributes = [
                'id',
                'fk_offerer',
                'status',
                'title',
                'description',
                'datePublished',
                'dateStart',
                'dateEnd',
                'location',
                'salary',
                'salaryFrecuency',
                'salaryCurrency',
                'workLocation',
                'seniority',
                'responsabilities'
            ]
            
            var output = await pagination(
                db.offers,
                "offers",
                req.query.limit,
                req.query.page,
                attributes,
                res,
                next
                );
                
            offers = output.data;

            users = await db.users.findAll({
                attributes: [
                    'id',
                    'name',
                    'img',
                    'bio',
                    'index'
                ]
            })

            var ret = [];

            for (var count in offers) {

                ret[count] = {};
                ret[count].offer = {};
                ret[count].user = {};
                ret[count].offer = offers[count];
                ret[count].user = users.find( element => offers[count]['fk_offerer'] == element.id);
            }

            return res.status(200).json({
                ok: true,
                message: output.message,
                data: ret,
                total: output.count
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one offer by id
    app.get('/offer/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
            resOffer = await db.offers.findOne({
                where: { id },
                attributes: [
                    'fk_offerer',
                    'status',
                    'title',
                    'description',
                    'datePublished',
                    'dateStart',
                    'dateEnd',
                    'location',
                    'salary',
                    'salaryFrecuency',
                    'salaryCurrency',
                    'workLocation',
                    'seniority',
                    'responsabilities',
                    'requeriments'
                ]
            });

            resUser = await db.users.findOne({
                where: { id: resOffer['fk_offerer'] },
                attributes: [
                    'name',
                    'img',
                    'bio',
                    'index'
                ]
            });

            resOffer.fk_offerer = undefined;

            return res.status(200).json({
                ok: true,
                offer: resOffer,
                user: resUser,
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

            console.log(id);
            await db.offers.create({
                fk_offerer: id,
                status: body.status,
                title: body.title,
                description: body.description,
                datePublished: body.datePublished,
                dateStart: body.dateStart,
                dateEnd: body.dateEnd,
                location: body.location,
                salary: body.salary,
                salaryFrecuency: body.salaryFrecuency,
                salaryCurrency: body.salaryCurrency,
                workLocation: body.workLocation,
                seniority: body.seniority,
                responsabilities: body.responsabilities,
                requeriments: body.requeriments
            }).then(result => {
                return res.status(201).json({
                    ok: true,
                    message: 'Offer created',
                    data: {
                        status: result.status,
                        title: result.title,
                        description: result.description,
                        datePublished: result.datePublished,
                        dateStart: result.dateStart,
                        dateEnd: result.dateEnd,
                        location: result.location,
                        salary: result.salary,
                        salaryFrecuency: result.salaryFrecuency,
                        salaryCurrency: result.salaryCurrency,
                        workLocation: result.workLocation,
                        seniority: result.seniority,
                        responsabilities: result.responsabilities,
                        requeriments: result.requeriments
                    }
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
                    // Comprobar return 
                    return res.status(200).json({
                        ok: true,
                        message: `Offer ${ id } updated ¿checkear si actualiza?`,
                        data: result
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
    app.delete('/offer/:id([0-9]+)', checkToken, async(req, res, next) => {
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