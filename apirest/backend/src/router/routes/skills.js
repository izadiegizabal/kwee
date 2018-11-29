const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD skills =========
// ============================

module.exports = (app, db) => {

    // GET all skills
    app.get('/skills', checkToken, async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                skills: await db.skills.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET one skill by id
    app.get('/skill/:id', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                skill: await db.skills.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single skill
    app.post('/skill', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body;

        try {
            res.status(201).json({
                ok: true,
                skill: await db.skills.create({
                    name: body.name,
                }),
                message: `Skill has been created.`
            });
        } catch (err) {
            next({ type: 'error', error: err });
        }

    });

    // PUT single skill
    app.put('/skill/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                skill: await db.skills.update(updates, {
                    where: { id }
                })
            });
            // json
            // skill: [1] -> Updated
            // skill: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single skill
    app.delete('/skill/:id', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                skill: await db.skills.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // skill: 1 -> Deleted
            // skill: 0 -> Skill doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}