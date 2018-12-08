const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', checkToken, async(req, res, next) => {
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
    app.get('/user/:id([0-9]+)',
        checkToken,
        async(req, res, next) => {

            const id = req.params.id;

            try {

                let user = await db.users.findOne({
                    attributes: [
                        'name',
                        'email'
                    ],
                    where: { id }
                });

                if (user) {
                    res.status(200).json({
                        ok: true,
                        user
                    });
                } else {
                    res.status(400).json({
                        ok: false,
                        message: 'User doesn\'t exist'
                    });
                }


            } catch (err) {
                next({ type: 'error', error: 'Error getting data' });
            }
        });


    app.post('/user', async(req, res, next) => {

        try {

            const body = req.body;

            let user = await db.users.create({
                name: body.name ? body.name : null,
                password: body.password ? bcrypt.hashSync(body.password, 10) : null,
                email: body.email ? body.email : null
            });

            if (user) {
                return res.status(201).json({
                    ok: true,
                    message: `User '${user.name}' with id ${user.id} has been created.`
                });
            } else {
                next({ type: 'error', error: 'Error creating user' });
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });

    // PUT single user
    app.put('/user/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;

            if (updates.password)
                updates.password = bcrypt.hashSync(req.body.password, 10);

            let updated = await db.users.update(updates, {
                where: { id }
            });
            
            if (updated > 0) {
                return res.status(200).json({
                    ok: true,
                    result: `Updated ${updated} rows. New values showing in message.`,
                    message: await db.users.findOne( { where: { id }})
                })
            }
            else{
                return res.status(400).json({
                    ok: false,
                    message: "No updates were done."
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.errors[0].message });
        }
    });


    // DELETE single user
    // This route will put 'deleteAt' to current timestamp,
    // never will delete it from database
    app.delete('/user/:id([0-9]+)', [checkToken, checkAdmin ], async(req, res, next) => {
        const id = req.params.id;

        try {
            let result = await db.users.destroy({
                where: { id: id }
            });
            
            if( result>0 ){
                return res.status(200).json({
                    ok: true,
                    user: result
                });
            }
            else{
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

}