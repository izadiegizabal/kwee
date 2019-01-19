const { checkToken } = require('../../middlewares/authentication');
const { tokenId, logger, pagination } = require('../../shared/functions');
const { Op } = require('../../database/op');

// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    app.get('/offers/search', async(req, res, next) => {

        try {
            let query = '';
            let buildedQuery = buildQuery(req.body);

            for(let i = 0; i < buildedQuery.length; i++){   
                query += buildedQuery[i];
                if( i < buildedQuery.length - 1 ){
                    query += ` AND `;
                }
            }
            
            // console.log("query: ", query)

            let offers = (await db.sequelize.query(`SELECT * FROM offers WHERE ${ query }`))[0];
            
            if (offers && offers.length > 0) {
                res.json({
                    ok: true,
                    message: "Showing the results",
                    data: offers
                })
            } else {
                res.json({
                    ok: false,
                    message: "No results were found"
                })
            }

        } catch (err) {
            next({ type: 'error', error: err });
        }
    });

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
                ret[count].user = users.find(element => offers[count]['fk_offerer'] == element.id);
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

    function buildQuery(body) {
        let title, description, dateStart, dateEnd, location, salary, status, datePublished, requeriments, skills;

        let query = [];

        body.title ? query.push(`title = '${ body.title }'`) : null;
        body.description ? description = body.description : null;
        body.dateStart ? dateStart = body.dateStart : null;
        body.dateEnd ? dateEnd = body.dateEnd : null;
        body.location ? query = getQuerySearch(query, 'location', body.location) : null;
        body.salary ? query.push(`(salary >= ${ body.salary[0] } AND salary <= ${ body.salary[1] })`) : null;
        body.status ? status = body.status : null;
        body.datePublished ? datePublished = body.datePublished : null;
        body.requeriments ? requeriments = body.requeriments : null;
        body.skills ? query = getQuerySearch(query, 'skills', body.skills) : null;
    
        return query;
    }

    function getQuerySearch(query, colum,  value ) {
        if ( typeof(value) == 'string' ) {
            query.push(`${ colum } = '${ value }'`);
        } else {
            let values = `(${ colum } = `;
            for(let i = 0; i < value.length; i++){
                values += `'${ value[i] }'`;
                if ( i < value.length - 1 ) {
                    values += ` OR ${ colum } = `;
                }
            }
            values += `)`;
            query.push(values);
        }
        return query;
    }

}