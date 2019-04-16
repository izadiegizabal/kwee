const {tokenId, logger, sendVerificationEmail, sendEmailResetPassword, pagination} = require('../../../shared/functions');
const {checkToken, checkAdmin} = require('../../../middlewares/authentication');
const elastic = require('../../../database/elasticsearch');
const bcrypt = require('bcryptjs');


// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {


    app.get('/users', async (req, res, next) => {

        try {

            var attributes = {
                exclude: ['password', 'root']
            };

            var output = await pagination(
                db.users,
                "users",
                req.query.limit,
                req.query.page,
                attributes,
                res,
                next);


            if (output.data) {
                return res.status(200).json({
                    ok: true,
                    message: output.message,
                    data: output.data,
                    count: output.count
                });
            }
        } catch {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // GET one user by id
    app.get('/user/:id([0-9]+)', async (req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('GET', 'user', id, res);

            let user = await db.users.findOne({
                attributes: {
                    exclude: [
                        'password'
                    ]
                },
                where: {id}
            });

            if (user) {
                return res.status(200).json({
                    ok: true,
                    message: `Get user by id ${id} successful`,
                    data: user
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: 'User doesn\'t exist'
                });
            }
        } catch (err) {
            return next({type: 'error', error: 'Error getting data'});
        }
    });

    // POST new user
    app.post('/user', async (req, res, next) => {
        try {
            await logger.saveLog('POST', 'user', null, res);

            const body = req.body;
            body.password ? body.password = bcrypt.hashSync(body.password, 10) : null;
            if (body.img && checkImg(body.img)) {
                var imgName = uploadImg(req, res, next, 'users');
                body.img = imgName;
            }
            delete body.root;

            let user = await db.users.create(body);

            elastic.index({
                index: 'users',
                id: user.id,
                type: 'users',
                body

            }, function (err, resp, status) {
                if (err) {
                    return next({type: 'error', error: err.message});
                }
            });

            if (user) {
                sendVerificationEmail(body, user);

                return res.status(201).json({
                    ok: true,
                    message: `User '${user.name}' with id ${user.id} has been created.`
                });
            } else {
                return next({type: 'error', error: 'Error creating user'});
            }

        } catch (err) {
            return next({type: 'error', error: (err.errors ? err.errors[0].message : err.message)});
        }
    });

    // Update user by themself
    app.put('/user', async (req, res, next) => {
        try {
            let logId = await logger.saveLog('PUT', 'user', null, res);

            let id = tokenId.getTokenId(req.get('token'), res);

            logger.updateLog(logId, id);

            updateUser(id, req, res, next);

        } catch (err) {
            return next({type: 'error', error: (err.errors ? err.errors[0].message : err.message)});
        }
    });

    // Update user by admin
    app.put('/user/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {

        try {
            await logger.saveLog('PUT', 'user', req.params.id, res);

            const id = req.params.id;
            updateUser(id, req, res, next);

        } catch (err) {
            return next({type: 'error', error: (err.errors ? err.errors[0].message : err.message)});
        }
    });

    // DELETE single user
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/user/:id([0-9]+)', [checkToken, checkAdmin], async (req, res, next) => {
        const id = req.params.id;

        try {
            await logger.saveLog('DELETE', 'user', id, res);

            let result = await db.users.destroy({
                where: {id: id}
            });

            if (result > 0) {
                return res.status(200).json({
                    ok: true,
                    message: `User ${id} deleted.`,
                    data: result
                });
            } else {
                return res.status(200).json({
                    // ok: true,
                    // message: "No deletes were done."
                })
            }
            // Respuestas en json
            // user: 1 -> Deleted
            // user: 0 -> User don't exists
        } catch (err) {
            return next({type: 'error', error: 'Error deleting user.'});
        }
    });

    app.post('/forgot', async (req, res, next) => {
        try {
            let email = req.body.email;
            let user = await db.users.findOne({where: {email}});

            if (user) {
                sendEmailResetPassword(user, res);
            } else {
                return res.status(400).json({
                    ok: false,
                    message: "Email not found in our database"
                });
            }
        } catch (error) {
            return next({type: 'error', error});
        }
    });

    app.post('/reset', async (req, res, next) => {
        let token = req.body.token;
        let password = req.body.password;

        try {
            let id = tokenId.getTokenId(token);
            let user = await db.users.findOne({where: {id}});

            if (user) {
                password = bcrypt.hashSync(password, 10);
                let updated = await db.users.update({password}, {
                    where: {id}
                });
                if (updated) {
                    return res.json({
                        ok: true,
                        message: 'Password changed'
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: "Password not updated."
                    });
                }
            } else {
                return res.status(200).json({
                    ok: true,
                    message: "User not matched."
                });
            }
        } catch (error) {
            return next({type: 'error', error});
        }

    });

    async function updateUser(id, req, res, next) {
        let body = req.body;
        // We can't let users update 'root' field themself
        delete body.root;

        if (body.password) body.password = bcrypt.hashSync(body.password, 10);

        if (body.img && checkImg(body.img)) {
            let user = await db.users.findOne({
                where: {id}
            });
            if (user.img) deleteFile('uploads/users/' + user.img);

            var imgName = uploadImg(req, res, next, 'users');
            body.img = imgName;
        }

        let updated = await db.users.update(body, {
            where: {id}
        });

        if (updated > 0) {
            return res.status(200).json({
                ok: true,
                message: `Updated ${updated} rows. New values showing in message.`,
                data: await db.users.findOne({where: {id}})
            })
        } else {
            return res.status(400).json({
                ok: false,
                message: "No updates were done."
            })
        }
    }

};
