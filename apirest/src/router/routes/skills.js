const {checkToken, checkAdmin} = require('../../middlewares/authentication');
const {logger, uploadImg, checkImg, deleteFile} = require('../../shared/functions');

// ============================
// ======== CRUD skills =========
// ============================

module.exports = (app, db) => {

    // GET all skills
    app.get('/skills', checkToken, async (req, res, next) => {
        try {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logger.saveLog('GET', 'skills', null, res, req.useragent, ip, null);

            return res.status(200).json({
                ok: true,
                message: 'Listing all skills',
                data: await db.skills.findAll()
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET skills by page limit to 10 skills/page
    app.get('/skills/:page([0-9]+)/:limit([0-9]+)', async (req, res, next) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `skills/${page}`, null, res, req.useragent, ip, null);

            let count = await db.skills.findAndCountAll();
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
                message: `${limit} skills of page ${page} of ${pages} pages`,
                data: await db.skills.findAll({
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

    // GET one skill by id
    app.get('/skill/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                message: 'Listing skill',
                data: await db.skills.findOne({
                    where: {id}
                })
            });

        } catch (err) {
            next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST single skill
    app.post('/skill', checkToken, async (req, res, next) => {

        try {
            if (req.body.name) {
                if (req.body.img) {
                    var imgName = uploadImg(req, res, next, 'skills');
                    req.body.img = imgName;
                }

                await db.skills.create(req.body);

                return res.status(201).json({
                    ok: true,
                    message: `Skill has been created.`,
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Name are required'
                })
            }
        } catch (err) {
            deleteFile('uploads/skills/' + req.body.img);
            return next({type: 'error', error: err.message});
        }

    });

    // PUT single skill
    app.put('/skill/:id([0-9]+)', checkToken, async (req, res, next) => {
        const id = req.params.id;
        const body = req.body;

        try {
            if (body.img && checkImg(body.img)) {
                let skill = await db.skills.findOne({
                    where: {id}
                });
                if (skill.img) deleteFile('uploads/skills/' + skill.img);

                var imgName = uploadImg(req, res, next, 'skills');
                body.img = imgName;
            }
            return res.status(200).json({
                ok: true,
                skill: await db.skills.update(body, {
                    where: {id}
                })
            });
        } catch (err) {
            return next({type: 'error', error: err.errors[0].message});
        }
    });

    // DELETE single skill
    app.delete('/skill/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;

        try {
            await db.skills.destroy({
                where: {id: id}
            });

            return res.json({
                ok: true,
                message: 'Skill created'
            });
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });
};
