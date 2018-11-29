const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD educations =========
// ============================

module.exports = (app, db) => {

    // GET all educations
    app.get('/educations', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                educations: await db.educations.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one education by id
    app.get('/education/:id', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                education: await db.educations.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single education
    app.post('/education', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body;

        try {
            res.status(201).json({
                ok: true,
                education: await db.educations.create({
                    title: body.title,
                }),
                message: `Education has been created.`
            });
        } catch (err) {
            next({ type: 'error', error: err });
        }

    });

    // PUT single education
    app.put('/education/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                education: await db.educations.update(updates, {
                    where: { id }
                })
            });
            // json
            // education: [1] -> Updated
            // education: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single education
    app.delete('/education/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                education: await db.educations.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // education: 1 -> Deleted
            // education: 0 -> Education doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}