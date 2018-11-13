// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', async(req, res, next) => {
        try {
            res.status(200).json({
                ok: true,
                users: await db.users.findAll({
                    attributes: [
                        'name',
                        'email'
                    ]
                })
            });
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }

    });

    // GET one user by id
    app.get('/user/:id([0-9]+)', async(req, res, next) => {
        const id = req.params.id;

        try {
            res.status(200).json({
                ok: true,
                user: await db.users.findOne({
                    attributes: [
                        'name',
                        'email'
                    ],
                    where: { id }
                })
            });

        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });

    // POST single user
    app.post('/user', async(req, res, next) => {
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;

        try {
            let user = await db.users.create({
                name,
                password,
                email
            });

            res.status(201).json({
                ok: true,
                message: `User '${user.name}', with id ${user.id} has been created.`
            });

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        };
    });

    // PUT single user
    app.put('/user/:id', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            res.status(200).json({
                ok: true,
                user: await db.users.update(updates, {
                    where: { id }
                })
            });
            // json
            // user: [1] -> Updated
            // user: [0] -> Not updated
            // empty body will change 'updateAt'
        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // DELETE single user
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/user/:id', async(req, res, next) => {
        const id = req.params.id;

        try {
            res.json({
                ok: true,
                user: await db.users.destroy({
                    where: { id: id }
                })
            });
            // Respuestas en json
            // user: 1 -> Deleted
            // user: 0 -> User don't exists
        } catch (err) {
            next({ type: 'error', error: 'Error getting data' });
        }
    });
}