const errorHandler = require('../../middlewares/errorHandlet');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', async(req, res) => {
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
            res.status(400).json({
                ok: false,
                err
            });
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
    app.post('/user', async(req, res) => {
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
            res.status(400).json({
                ok: false,
                error: err.errors[0].message
            });
        };

    });

    // PUT single user
    app.put('/user/:id', async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        try {
            // respuesta 1 actualizado
            // respuesta 0 no actualizado
            res.status(200).json({
                ok: true,
                user: await db.users.update(updates, {
                    where: { id }
                })
            });
        } catch (err) {
            // res.status(400).json({
            //     ok: false,
            //     error: err.errors[0].message
            // });
            next({ type: 'error', error: 'Error getting data' });
        }



        // db.users.update(updates, {
        //         where: { id }
        //     })
        //     .then(updatedUser => {
        //         if (updatedUser[0]) {
        //             res.json({
        //                 ok: true,
        //                 id
        //             });
        //         } else {
        //             res.json({
        //                 ok: false,
        //                 error: `This user doesnt exists`
        //             });
        //         }
        //     }).catch((err) => {
        //         res.status(400).json({
        //             ok: false,
        //             error: err.errors[0].message
        //         });
        //     });
    });

    // DELETE single user
    app.delete('/user/:id', (req, res) => {
        const id = req.params.id;
        db.users.destroy({
                where: { id: id }
            })
            .then(deletedUser => {
                if (deletedUser) {
                    res.json({
                        ok: true,
                        message: `User with ID ${ id } has beend deleted`
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `User with ID ${ id } doesn't exists`
                    });
                }
            });
    });
}