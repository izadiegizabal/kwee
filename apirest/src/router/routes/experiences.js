const {checkToken, checkAdmin} = require('../../middlewares/authentication');
const {tokenId, logger} = require('../../shared/functions');

const {algorithm} = require('../../shared/algorithm');

// ============================
// ======== CRUD experiences =========
// ============================

module.exports = (app, db) => {

    // GET all experiences
    app.get('/experiences', checkToken, async (req, res, next) => {
        try {
            await logger.saveLog('GET', 'experiences', null, res);

            return res.status(200).json({
                ok: true,
                experiences: await db.experiences.findAll()
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET experiences by page limit to 10 experiences/page
    app.get('/experiences/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `experiences/${page}`, null, res);

            let count = await db.experiences.findAndCountAll();
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
                message: `${limit} experiences of page ${page} of ${pages} pages`,
                data: await db.experiences.findAll({
                    limit,
                    offset,
                    $sort: {id: 1}
                }),
                total: count.count
            });
        } catch (err) {
            next({type: 'error', error: err});
        }
    });

    // GET one experience by id
    app.get('/experience/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                experience: await db.experiences.findOne({
                    where: {id}
                })
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single experience
    app.post('/experience', async (req, res, next) => {
        let body = req.body;

        try {
            let id = tokenId.getTokenId(req.get('token'), res);
            let experience = await db.experiences.create({
                fk_applicant: id,
                title: body.title,
                description: body.description,
                dateStart: body.dateStart,
                dateEnd: body.dateEnd,
            });

            if (experience) {
                return res.status(201).json({
                    ok: true,
                    message: `Experience has been created.`
                });
            }

        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }

    });

    // PUT single experience by themself
    app.put('/experience/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'), res);

            await db.experiences.update(updates, {
                where: {id, fk_applicant}
            });

            return res.status(200).json({
                ok: true,
                message: 'Updated'
            });
        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }
    });

    // PUT single experience by admin
    app.put('/experience/admin/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            await db.experiences.update(updates, {
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

    // DELETE single experience by themself
    app.delete('/experience/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;

        try {
            let fk_applicant = tokenId.getTokenId(req.get('token'), res);

            await db.experiences.destroy({
                where: {id, fk_applicant}
            });

            return res.json({
                ok: true,
                message: 'Deleted'
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // DELETE single experience by admin
    app.delete('/experience/admin/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;

        try {
            await db.experiences.destroy({
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

    app.get('/experiences/index/:id', async (req, res, next) => {
        const id = req.params.id;

        let index = await algorithm.indexUpdate(id);

        return res.json({
            ok: true,
            index
        });
    });
};
