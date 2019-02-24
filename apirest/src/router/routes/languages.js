const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { tokenId, logger } = require('../../shared/functions');

// ============================
// ======== CRUD languages =========
// ============================

module.exports = (app, db) => {

    // GET all languages
    app.get('/languages', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'languages', null, res);

            return res.status(200).json({
                ok: true,
                languages: await db.languages.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET languages by page limit to 10 languages/page
    app.get('/languages/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `languages/${ page }`, null, res);

            let count = await db.languages.findAndCountAll();
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
                message: `${ limit } languages of page ${ page } of ${ pages } pages`,
                data: await db.languages.findAll({
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

    // GET one language by id
    app.get('/language/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                language: await db.languages.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single language
    app.post('/language', async(req, res, next) => {
        let body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'));
            let language = await db.languages.create({
                fk_applicant: id,
                name: body.name,
                level: body.level,
            });

            if ( language ) {
                return res.status(201).json({
                    ok: true,
                    message: `Language has been created.`
                });
            }

        } catch (err) {
            return next({ type: 'error', error: err.message });
        }

    });

    // PUT single language by themself
    app.put('/language/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'));

            await db.languages.update(updates, {
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

    // PUT single language by admin
    app.put('/language/admin/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            await db.languages.update(updates, {
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

    // DELETE single language by themself
    app.delete('/language/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;
        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'));

            await db.languages.destroy({
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

    // DELETE single language by admin
    app.delete('/language/admin/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await db.languages.destroy({
                where: { id }
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