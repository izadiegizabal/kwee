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

    // GET one language by id
    app.get('/language/:id', checkToken, async(req, res, next) => {
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
            next({ type: 'error', error: err });
        }

    });

    // PUT single language
    app.put('/language/:id', [checkToken, checkAdmin], async(req, res, next) => {
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
    app.delete('/language/:id', [checkToken, checkAdmin], async(req, res, next) => {
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