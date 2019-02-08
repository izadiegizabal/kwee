const { checkToken, checkAdmin } = require('../../middlewares/authentication');
const { logger, uploadFile } = require('../../shared/functions');
const Busboy = require('busboy'),
        path = require('path'),
        fs = require('fs');

// ============================
// ======== CRUD skills =========
// ============================

module.exports = (app, db) => {

    // GET all skills
    app.get('/skills', checkToken, async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'skills', null, res);

            return res.status(200).json({
                ok: true,
                skills: await db.skills.findAll()
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // GET skills by page limit to 10 skills/page
    app.get('/skills/:page([0-9]+)/:limit([0-9]+)', async(req, res, next) => {
        let limit = Number(req.params.limit);
        let page = Number(req.params.page);

        try {
            await logger.saveLog('GET', `skills/${ page }`, null, res);

            let count = await db.skills.findAndCountAll();
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
                message: `${ limit } skills of page ${ page } of ${ pages } pages`,
                data: await db.skills.findAll({
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

    // GET one skill by id
    app.get('/skill/:id([0-9]+)', checkToken, async(req, res, next) => {
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
    app.post('/skill', checkAdmin, async(req, res, next) => {
        
        try {
            
            var busboy = new Busboy({ headers: req.headers });
            busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
                req.body[fieldname] = val;
            });
            busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                if (!fs.existsSync('uploads/skills')){
                    fs.mkdirSync('uploads/skills', { recursive: true });
                }
                let fileNameCut = filename.split('.');
                let fileExt = fileNameCut[fileNameCut.length - 1];
                let nameToSave = req.body['name'] + '.' + fileExt;
                req.body['img'] = nameToSave;
                console.log('name',req.body['name']);
                if ( mimetype.split('/')[0] == 'image' ) {
                    var saveTo = path.join('./uploads/skills', nameToSave);
                    if ( req.body['name'] ) {
                        console.log('Uploading: ' + saveTo);
                        file.pipe(fs.createWriteStream(saveTo));
                    } else {
                        return res.status(400).json({
                            ok: false,
                            message: 'Name is required'
                        });
                    }
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'File should be an image'
                    });
                }
            });
            busboy.on('finish', async function() {
                try {
                    let skill = await db.skills.create({
                        name: req.body.name,
                        img: req.body.img
                    });
                    res.status(201).json({
                        ok: true,
                        message: `Skill has been created.`,
                        skill
                    });
                } catch (err) {
                    next({ type: 'error', error: err.message });
                }
            });
            return req.pipe(busboy);
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // PUT single skill
    app.put('/skill/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
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
    app.delete('/skill/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
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