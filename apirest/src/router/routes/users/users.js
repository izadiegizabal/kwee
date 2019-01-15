const { checkToken, checkAdmin } = require('../../../middlewares/authentication');
const { tokenId, logger, sendVerificationEmail } = require('../../../shared/functions');
const bcrypt = require('bcrypt');


// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', async(req, res, next) => {
        try {
            await logger.saveLog('GET', 'users', null, res);

            res.status(200).json({
                ok: true,
                message: 'All users list',
                data: await db.users.findAll({
                    attributes: [
                        'id',
                        'name',
                        'email'
                    ]
                })
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });

    // GET users by page limit to 10 users/page
    app.get('/users/:page([0-9]+)', async(req, res, next) => {
        let limit = 10;
        let page = req.params.page;

        try {
            await logger.saveLog('GET', `users/${ page }`, null, res);

            let count = await db.users.findAndCountAll();
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
                message: `${ limit } users of page ${ page } of ${ pages } pages`,
                data: await db.users.findAll({
                    attributes: [
                        'id',
                        'name',
                        'email'
                    ],
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

    // GET one user by id
    app.get('/user/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('GET', 'user', id, res);

            let user = await db.users.findOne({
                attributes: [
                    'id',
                    'name',
                    'email'
                ],
                where: { id }
            });

            if (user) {
                return res.status(200).json({
                    ok: true,
                    message: `Get user by id ${id} successful`,
                    data: user
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'User doesn\'t exist'
                });
            }
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST new user
    app.post('/user', async(req, res, next) => {
        try {
            await logger.saveLog('POST', 'user', null, res);

            const body = req.body;

            let user = await db.users.create({
                name: body.name ? body.name : null,
                password: body.password ? bcrypt.hashSync(body.password, 10) : null,
                email: body.email ? body.email : null,

                img: body.img ? body.img : null,
                bio: body.bio ? body.bio : null

            });

            if (user) {
                sendVerificationEmail(body, user);

                return res.status(201).json({
                    ok: true,
                    message: `User '${user.name}' with id ${user.id} has been created.`
                });
            } else {
                next({ type: 'error', error: 'Error creating user' });
            }

        } catch (err) {
            next({ type: 'error', error: (err.errors ? err.errors[0].message : err.message) });
        }
    });

    // Update user by themself
    app.put('/user', async(req, res, next) => {
        try {
            let logId = await logger.saveLog('PUT', 'user', null, res);

            let id = tokenId.getTokenId(req.get('token'));

            logger.updateLog(logId, id);

            const updates = req.body;

            // We can't let users update 'root' field themself
            delete updates.root;

            updateUser(id, updates, res);

        } catch (err) {
            next({ type: 'error', error: (err.errors ? err.errors[0].message : err.message) });
        }
    });

    // Update user by admin
    app.put('/user/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {

        try {
            await logger.saveLog('PUT', 'user', req.params.id, res);

            const id = req.params.id;
            const updates = req.body;

            updateUser(id, updates, res);

        } catch (err) {
            next({ type: 'error', error: (err.errors ? err.errors[0].message : err.message) });
        }
    });

    // DELETE single user
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/user/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'user', id, res);

            let result = await db.users.destroy({
                where: { id: id }
            });

            if (result > 0) {
                return res.status(200).json({
                    ok: true,
                    message: `User ${ id } deleted.`,
                    data: result
                });
            } else {
                return res.status(204).json({
                    // ok: true,
                    // message: "No deletes were done."
                })
            }
            // Respuestas en json
            // user: 1 -> Deleted
            // user: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error deleting user.' });
        }
    });

    async function updateUser(id, updates, res) {
        if (updates.password)
            updates.password = bcrypt.hashSync(updates.password, 10);

        let updated = await db.users.update(updates, {
            where: { id }
        });

        if (updated > 0) {
            return res.status(200).json({
                ok: true,
                message: `Updated ${updated} rows. New values showing in message.`,
                data: await db.users.findOne({ where: { id } })
            })
        } else {
            return res.status(400).json({
                ok: false,
                message: "No updates were done."
            })
        }
    }

}