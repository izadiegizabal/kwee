const { checkToken } = require('../../middlewares/authentication');
const { tokenId, logger, pagination, validateDate } = require('../../shared/functions');
const { Op } = require('../../database/op');

// ============================
// ======== CRUD offers =========
// ============================

module.exports = (app, db) => {

    app.get('/offers/search', async(req, res, next) => {
        let query = '';
        let offers = [];
        try {
            // Function to obtain what is searched in an array
            let buildedQuery = buildQuery( req.body );

            // If it is searched something that exists in 'offers'
            if ( buildedQuery.length > 0 ) {
                // The first element of the array will become error if it's something data wrong
                if( buildedQuery[0] !== 'error' ) {
                    // This will build the "AND" condition beetween each array position
                    // example: (location = "Madrid" OR location = "Alicante") AND title = "FullStack"
                    //           < - - - - - -  F  I  R  S T - - - - - - - ->      < - S E C O N D - >
                    for(let i = 0; i < buildedQuery.length; i++){   
                        query += buildedQuery[i];
                        if( i < buildedQuery.length - 1 ) query += ` AND `;
                    }
                } else {
                    // If it's error, the second element will be the error message
                    return res.json({
                        ok: false,
                        message: buildedQuery[1]
                    });
                }
            } else {
                // For empty search or invalid colum values
                return res.json({
                    ok: false,
                    message: "You must find something."
                });
            }
            
            offers = (await db.sequelize.query(`SELECT * FROM offers WHERE ${ query }`))[0];
            
            if (offers && offers.length > 0) {
                return res.json({
                    ok: true,
                    message: "Showing the results",
                    data: offers,
                    total: offers.length
                })
            } else {
                return res.json({
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
                'title',
                'status',
                'description',
                'datePublished',
                'dateStart',
                'dateEnd',
                'location',
                'isIndefinite',
                'salaryAmount',
                'salaryFrecuency',
                'salaryCurrency',
                'workLocation',
                'contractType',
                'maxApplicants',
                'currentApplications',
                //'seniority',
                //'responsabilities',
                //'skills',
                //'duration',
                //'durationUnit',
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
                    'index',
                    //'bio'
                ]
            })

            var ret = [];

            for (var count in offers) {

                ret[count] = {};
                ret[count].offer = {};
                ret[count].user = {};
                ret[count].offer = offers[count];
                ret[count].user = users.find(element => offers[count]['fk_offerer'] == element.id);
                
                ret[count].offer.fk_offerer = undefined;
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
                    'salaryAmount',
                    'salaryFrecuency',
                    'salaryCurrency',
                    'workLocation',
                    'seniority',
                    'responsabilities',
                    'requeriments', //
                    'skills',
                    'maxApplicants',
                    'currentApplications',
                    'duration',
                    'durationUnit',
                    'contractType',
                    'isIndefinite'
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

            //resOffer.fk_offerer = undefined;

            return res.status(200).json({
                ok: true,
                data: {
                    offer: resOffer,
                    user: resUser
                }
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
                salaryAmount: body.salaryAmount,
                salaryFrecuency: body.salaryFrecuency,
                salaryCurrency: body.salaryCurrency,
                workLocation: body.workLocation,
                seniority: body.seniority,
                responsabilities: body.responsabilities,
                requeriments: body.requeriments,
                skills: body.skills,
                maxApplicants: body.maxApplicants,
                currentApplications: body.currentApplications,
                duration: body.duration,
                durationUnit: body.durationUnit,
                contractType: body.contractType,
                isIndefinite: body.isIndefinite
            }).then(result => {
                return res.status(201).json({
                    ok: true,
                    message: 'Offer created',
                    data: {
                        fk_offerer: result.id,
                        status: result.status,
                        title: result.title,
                        description: result.description,
                        datePublished: result.datePublished,
                        dateStart: result.dateStart,
                        dateEnd: result.dateEnd,
                        location: result.location,
                        salaryAmount: result.salaryAmount,
                        salaryFrecuency: result.salaryFrecuency,
                        salaryCurrency: result.salaryCurrency,
                        workLocation: result.workLocation,
                        seniority: result.seniority,
                        responsabilities: result.responsabilities,
                        requeriments: result.requeriments,
                        skills: body.skills,
                        maxApplicants: body.maxApplicants,
                        currentApplications: body.currentApplications,
                        duration: body.duration,
                        durationUnit: body.durationUnit,
                        contractType: body.contractType,
                        isIndefinite: body.isIndefinite
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

    function buildQuery( body ) {
        let title, description, dateStart, dateEnd, location, salaryAmount, status, datePublished, requeriments, skills;

        // Building an array with all the searchs
        // one element to each search parametre
        let query = [];

        body.title ? query.push(`title LIKE '%${ body.title }%'`) : null;
        body.description ? query.push(`description LIKE '%${ body.description }%'`) : null;
        body.dateStart ? query = getQueryDate(query, 'dateStart', body.dateStart) : null;
        body.dateEnd ? query = getQueryDate(query, 'dateEnd', body.dateEnd) : null;
        body.location ? query = getQuerySearch(query, 'location', body.location) : null;
        body.salaryAmount ? query.push(`(salaryAmount >= ${ body.salaryAmount[0] } AND salaryAmount <= ${ body.salaryAmount[1] })`) : null;
        body.status ? query = getQuerySearch(query, 'location', body.location) : null;
        body.datePublished ? query = getQueryDate(query, 'datePublished', body.datePublished) : null;
        body.requeriments ? query.push(`requeriments LIKE '%${ body.requeriments }%'`) : null;
        body.skills ? query = getQuerySearch(query, 'skills', body.skills) : null;
        body.maxApplicants ? query.push(`(maxApplicants >= ${ body.maxApplicants[0] } AND maxApplicants <= ${ body.maxApplicants[1] })`) : null;
        body.currentApplications ? query.push(`(currentApplications >= ${ body.currentApplications[0] } AND currentApplications <= ${ body.currentApplications[1] })`) : null;
        body.duration ? query.push(`(duration >= ${ body.duration[0] } AND duration <= ${ body.duration[1] })`) : null;
        body.durationUnit ? query.push(`(durationUnit >= ${ body.durationUnit[0] } AND durationUnit <= ${ body.durationUnit[1] })`) : null;
        body.contractType ? query.push(`(contractType >= ${ body.contractType[0] } AND contractType <= ${ body.contractType[1] })`) : null;
        body.isIndefinite ? query.push(`(isIndefinite >= ${ body.isIndefinite[0] } AND isIndefinite <= ${ body.isIndefinite[1] })`) : null;

        return query;
    }

    // Used when the user search more than one parametre in the same column
    // example: (location = "Madrid" OR location = "Alicante")
    function getQuerySearch(query, colum,  value ) {
        if ( typeof(value) != 'string' ) {
            if ( value.length == 1 ) {
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
        } else {
            query.unshift(`Send ${ colum } as array`);
            query.unshift(`error`);
        }
        return query;
    }

    function getQueryDate( query, colum, value ) {
        if ( typeof(value) != 'string' && (value.length == 1 || value.length == 2) ) {
            if ( value.length == 1 ) {
                validateDate(value) ? query.push(`${ colum } = '${ value }'`) : null;
            } else {
                if( value.length == 2 && 
                    value[0].length > 0 && 
                    value[1].length > 0 && 
                    validateDate(value[0]) && 
                    validateDate(value[1]) ) {
                    if ( value[0].length > 0 && value[1].length > 0) {
                        query.push(`${ colum } BETWEEN '${ value[0] }' AND '${ value[1] }'`);
                    } else {
                        if ( value[0].length > 0 && value[1].length == 0) {
                            query.push(`${ colum } >= '${ value[0] }'`);
                        } else {
                            if ( value[0].length == 0 && value[1].length > 0) {
                                query.push(`${ colum } <= '${ value[1] }'`);
                            }
                        }
                    }
                }
            }
        } else {
            query.unshift(`Send ${ colum } as array of one or two elements`);
            query.unshift(`error`);
        }

        return query;
    }

}