const {checkToken, checkAdmin} = require('../../middlewares/authentication');
const {tokenId, logger} = require('../../shared/functions');

// ============================
// ======== CRUD languages =========
// ============================

module.exports = (app, db) => {

    // GET all languages
    app.get('/languages', checkToken, async (req, res, next) => {
        try {
            await logger.saveLog('GET', 'languages', null, res);

            let languages = await db.languages.findAll();

            return res.status(200).json({
                ok: true,
                message: 'Listing all languages',
                data: languages
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET languages by page limit to 10 languages/page
    app.get('/languages/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `languages/${page}`, null, res);

            let count = await db.languages.findAndCountAll();
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
                message: `${limit} languages of page ${page} of ${pages} pages`,
                data: await db.languages.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            return next({type: 'error', error: err});
        }
    });

    // GET one language by id
    app.get('/language/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;

        try {
            let language = await db.languages.findOne({
                where: {id}
            });
            return res.status(200).json({
                ok: true,
                message: 'Listing language',
                data: language
            });

        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single language
    app.post('/language', checkToken, async (req, res, next) => {
        let body = req.body;

        try {
            let language = await db.languages.create({
                name: body.name
            });

            if (language) {
                return res.status(201).json({
                    ok: true,
                    message: `Language has been created.`
                });
            }

        } catch (err) {
            return next({type: 'error', error: err.message});
        }

    });

    // PUT single language
    app.put('/language/admin/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            await db.languages.update(updates, {
                where: {id}
            });

            return res.status(200).json({
                ok: true,
                message: 'Updated'
            });
        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }
    });

    // DELETE single language
    app.delete('/language/admin/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;

        try {
            await db.languages.destroy({
                where: {id}
            });

            return res.json({
                ok: true,
                message: 'Deleted'
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });
};
