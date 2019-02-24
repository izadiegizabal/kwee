const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { tokenId, logger } = require('../../shared/functions');

// ============================
// ======== CRUD educations =========
// ============================

module.exports = (app, db) => {

    // GET all educations
    app.get('/educations', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'educations', null, res);
            
            return res.status(200).json({
                ok: true,
                educations: await db.educations.findAll()
            });
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET educations by page limit to 10 educations/page
    app.get('/educations/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `educations/${ page }`, null, res);

            let count = await db.educations.findAndCountAll();
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
                message: `${ limit } educations of page ${ page } of ${ pages } pages`,
                data: await db.educations.findAll({
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

    // GET one education by id
    app.get('/education/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            return res.status(200).json({
                ok: true,
                education: await db.educations.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single education
    app.post('/education', async(req, res, next) => {
        let body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let education = await db.educations.create({
                fk_applicant: id,
                title: body.title,
                description: body.description,
                dateStart: body.dateStart,
                dateEnd: body.dateEnd,
            });

            if ( education ) {
                return res.status(201).json({
                    ok: true,
                    message: `Education has been created.`
                });
            }

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });

    // PUT single education by themself
    app.put('/education/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'));

            await db.educations.update(updates, {
                where: { id, fk_applicant }
            });

            return res.status(200).json({
                ok: true,
                message: 'Updated' 
            });
        } catch (err) {
            return next({ type: 'error', error: err.errors[0].message });
        }
    });

    // PUT single education by admin
    app.put('/education/admin/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            await db.educations.update(updates, {
                where: { id }
            });

            return res.status(200).json({
                ok: true,
                message: 'Updated' 
            });
        } catch (err) {
            return next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single education by themself
    app.delete('/education/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'));

            await db.educations.destroy({
                where: { id, fk_applicant }
            });

            return res.json({
                ok: true,
                message: 'Deleted' 
            });
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });

    // DELETE single education by admin
    app.delete('/education/admin/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await db.educations.destroy({
                where: { id: id }
            });

            return res.json({
                ok: true,
                message: 'Deleted' 
            });
        } catch (err) {
            return next({ type: 'error', error: 'Error getting data' });
        }
    });
}