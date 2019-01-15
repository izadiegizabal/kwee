const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD languages =========
// ============================

module.exports = (app, db) => {

    // GET all languages
    app.get('/languages', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                languages: await db.languages.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET languages by page limit to 10 languages/page
    app.get('/languages/:page([0-9]+)', async(req, res, next) => {
        let limit = 10;
        let page = req.params.page;
        // logger.saveLog('GET', `languages/${ page }`, null, res);

        try {
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
    app.post('/language', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body;

        try {
            res.status(201).json({
                ok: true,
                language: await db.languages.create({
                    language: body.language,
                }),
                message: `Language has been created.`
            });
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // PUT single language
    app.put('/language/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                language: await db.languages.update(updates, {
                    where: { id }
                })
            });
            // json
            // language: [1] -> Updated
            // language: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single language
    app.delete('/language/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                language: await db.languages.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // language: 1 -> Deleted
            // language: 0 -> Language doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}