const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

//const { checks } = require('../../middlewares/validations')
//const { check, validationResult, checkSchema } = require('express-validator/check')
// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users applicants
    app.get('/applicants', checkToken, async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let applicants = await db.applicants.findAll();
            let applicantsView = [];

            for (let i = 0; i < users.length - 1; i++) {
                for (let j = 0; j < applicants.length - 1; j++) {
                    if (users[i].id === applicants[j].userId) {
                        applicantsView[j] = {
                            id: applicants[j].userId,
                            name: users[i].name,
                            email: users[i].email,
                            date_born: applicants[j].date_born,
                            premium: applicants[j].premium,
                            createdAt: applicants[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                applicants: applicantsView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // POST single applicant
    app.post('/applicant', [checkToken, checkAdmin], async(req, res, next) => {

        const body = req.body;
        const password = bcrypt.hashSync(body.password, 10);

        try {
            let user = await db.users.create({
                name: body.name,
                password,
                email: body.email
            });
            if (user) {
                if (!body.type) {
                    // User created
                    return res.status(201).json({
                        ok: true,
                        message: `User '${user.name}' with id ${user.id} has been created.`
                    });
                } else {
                    let msg = '';
                    switch (body.type) {
                        case 'a':
                            msg = 'Applicant';
                            createApplicant(body, user);
                            break;

                        case 'o':
                            msg = 'Offerer';
                            createOfferer(body, user);
                            break;

                        default:
                            await db.users.destroy({ where: { id: user.id } });
                            next({ type: 'error', error: 'Must be \'type\' of user, \'a\' (applicant) or \'o\' (offerer)' });
                            break;
                    }
                    // Applicant / offerer created
                    return res.status(201).json({
                        ok: true,
                        message: `${ msg } '${user.name}' with id ${user.id} has been created.`
                    });
                }
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // PUT single applicant
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let updated = await db.applicants.update(updates, {
                where: { userId: id }
            });
            if (updated) {
                res.status(200).json({
                    ok: true,
                    message: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    async function createApplicant(body, user, next) {
        if (body.city) {
            let applicant = {};
            applicant.userId = user.id;
            applicant.city = body.city; // not saving :S
            if (body.date_born) applicant.date_born = body.date_born;
            if (body.premium) applicant.premium = body.premium;

            console.log(applicant);

            await db.applicants.create(applicant);
            console.log('Applicant created');
        } else {
            await db.users.destroy({ where: { id: user.id } });
            next({ type: 'error', error: 'City required' });
        }
    }
}