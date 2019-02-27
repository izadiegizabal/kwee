const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { logger } = require('../../shared/functions');

// ============================
// ======== CRUD comments =========
// ============================

module.exports = (app, db) => {

    // GET all comments
    app.get('/comments', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'comments', null, res);
            
            return res.status(200).json({
                ok: true,
                comments: await db.comments.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET comments by page limit to 10 comments/page
    app.get('/comments/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `comments/${ page }`, null, res);

            let count = await db.comments.findAndCountAll();
            let pages = Math.ceil(count.count / limit);
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(204).json({
                    ok: true,
                    message: `It doesn't exist ${ page } pages`
                })
            }

            return res.status(200).json({
                ok: true,
                message: `${ limit } comments of page ${ page } of ${ pages } pages`,
                data: await db.comments.findAll({
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

    // GET one comment by id
    app.get('/comment/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                comment: await db.comments.findOne({
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single comment
    app.post('/comment', checkToken, async(req, res, next) => {
        let body = req.body;

        try {


            res.status(201).json({
                ok: true,
                comment: await db.comments.create({
                    fk_user: body.fk_user,
                    fk_rating_applicant: body.fk_rating_applicant ? body.fk_rating_applicant : null,
                    fk_rating_offerer: body.fk_rating_offerer ? body.fk_rating_offerer : null,
                    description: body.description
                }),
                message: `Comment has been created.`
            });

        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // PUT single comment
    app.put('/comment/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                comment: await db.comments.update(updates, {
                    where: { id }
                })
            });
            // json
            // comment: [1] -> Updated
            // comment: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single comment
    app.delete('/comment/:id([0-9]+)', checkToken, async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                comment: await db.comments.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // comment: 1 -> Deleted
            // comment: 0 -> Comment doesn't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}