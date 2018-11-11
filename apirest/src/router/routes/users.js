// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', (req, res) => {
        db.users.findAll({
                attributes: [
                    'name',
                    'email',
                    'root'
                ]
            })
            .then(users => {
                res.json({
                    ok: true,
                    users
                });
            });
    });

    // GET one user by id
    app.get('/user/:id', (req, res) => {
        const id = req.params.id;
        db.users.findOne({
                where: { id }
            })
            .then(user => {
                if (user) {
                    res.json({
                        ok: true,
                        user
                    });
                } else {
                    res.json({
                        ok: false,
                        error: 'User doesnt exists'
                    });
                }
            });
    });

    // POST single user
    app.post('/user', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        db.users.create({
                name,
                email
            })
            .then(newUser => {
                if (newUser) {
                    res.json({
                        ok: true,
                        message: `User '${newUser.name}', with id ${newUser.id} has been created.`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
    });

    // PUT single user
    app.put('/user/:id', (req, res) => {
        const id = req.params.id;
        const updates = req.body;
        db.users.update(updates, {
                where: { id }
            })
            .then(updatedUser => {
                if (updatedUser[0]) {
                    res.json({
                        ok: true,
                        id
                    });
                } else {
                    res.json({
                        ok: false,
                        error: `This user doesnt exists`
                    });
                }
            }).catch((err) => {
                res.status(400).json({
                    ok: false,
                    error: err.errors[0].message
                });
            });
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