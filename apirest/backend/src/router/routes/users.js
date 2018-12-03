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
    app.get('/user/:id([0-9]+)', checkToken, async(req, res, next) => {
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

    // POST single user
    app.post('/user', [checkToken, checkAdmin], async(req, res, next) => {
        let body = req.body;
        let password = body.password;

        if (body.name && password && body.email) {

            try {
                let user = await db.users.create({
                    name: body.name,
                    password: bcrypt.hashSync(password, 10),
                    email: body.email
                });

                res.status(201).json({
                    ok: true,
                    message: `User '${user.name}', with id ${user.id} has been created.`
                });

                if (user) {
                    if (body.type && (body.type === 'a' || body.type === 'o')) {
                        switch (body.type) {
                            case 'a':
                                createApplicant(body, user, next);
                                break;

                            case 'o':
                                createOfferer(body, user, next);
                                break;
                        }
                    } else {
                        await db.users.destroy({ where: { id: user.id } });
                        next({ type: 'error', error: 'Must be \'type\' of user, \'a\' (applicant) or \'o\' (offerer)' });
                    }
                }
            } catch (err) {
                next({ type: 'error', error: err.errors[0].message });
            };
        } else {
            next({ type: 'error', error: 'Name, email and password are required' });
        }
    });

    // PUT single user
    app.put('/user/:id', [checkToken, checkAdmin], async(req, res, next) => {
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
    app.delete('/user/:id', [checkToken, checkAdmin], async(req, res, next) => {
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

    async function createApplicant(body, user, next) {
        if (body.city) {
            let applicant = {};
            applicant.userId = user.id;
            applicant.city = body.city; // not saving :S
            if (body.date_born) applicant.date_born = body.date_born;
            if (body.premium) offerer.premium = body.premium;

            console.log(applicant);

            await db.applicants.create(applicant);
            console.log('Applicant created');
        } else {
            await db.users.destroy({ where: { id: user.id } });
            next({ type: 'error', error: 'City required' });
        }
    }

    async function createOfferer(body, user, next) {
        if (body.adress && body.cif && body.work_field) {

            await db.offerers.create({
                userId: user.id,
                adress: body.adress,
                work_field: body.work_field,
                cif: body.cif,
                about_us: body.about_us ? body.about_us : null,
                website: body.website ? body.website : null,
                company_size: body.company_size ? body.company_size : null,
                year: body.year ? body.year : null,
                premium: body.premium ? body.premium : 'basic'
            });
            console.log('Offerer created');
        } else {
            await db.users.destroy({ where: { id: user.id } });
            next({ type: 'error', error: 'Adress, cif and work_field required' });
        }
    }
}