const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { logger } = require('../../shared/functions');

// ============================
// ======== CRUD experiences =========
// ============================

module.exports = (app, db) => {

    // GET all experiences
    app.get('/experiences', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'experiences', null, res);

            return res.status(200).json({
                ok: true,
                experiences: await db.experiences.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET experiences by page limit to 10 experiences/page
    app.get('/experiences/:page([0-9]+)', async(req, res, next) => {
        let limit = 10;
        let page = req.params.page;

        try {
            await logger.saveLog('GET', `experiences/${ page }`, null, res);

            let count = await db.experiences.findAndCountAll();
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
                message: `${ limit } experiences of page ${ page } of ${ pages } pages`,
                data: await db.experiences.findAll({
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

    // GET one experience by id
    app.get('/experience/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                experience: await db.experiences.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single experience
    app.post('/experience', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body

        try {

            res.status(201).json({
                ok: true,
                experience: await db.experiences.create({
                    fk_applicant: body.fk_applicant,
                    title: body.title,
                    description: body.description,
                    date_start: body.date_start,
                    date_end: body.date_end,
                }),
                message: `Experience has been created.`
            });

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }

    });

    // PUT single experience
    app.put('/experience/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                experience: await db.experiences.update(updates, {
                    where: { id }
                })
            });
            // json
            // experience: [1] -> Updated
            // experience: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single experience
    app.delete('/experience/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                experience: await db.experiences.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // experience: 1 -> Deleted
            // experience: 0 -> Experience doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}