const { checkToken, checkAdmin } = require('../../../middlewares/authentication');
const { tokenId, logger } = require('../../../shared/functions');
const env = require('../../../tools/constants');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users
    app.get('/users', async(req, res, next) => {
        await logger.saveLog('GET', 'users', null, res);
        try {
            res.status(200).json({
                ok: true,
                message: 'All users list',
                data: await db.users.findAll({
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
        await logger.saveLog('GET', 'user', id, res);

        try {

            let user = await db.users.findOne({
                attributes: [
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
        await logger.saveLog('POST', 'user', null, res);
        try {
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
        let logId = await logger.saveLog('PUT', 'user', null, res);
        try {
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
        await logger.saveLog('PUT', 'user', req.params.id, res);

        try {
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
        await logger.saveLog('DELETE', 'user', id, res);

        try {
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

    function sendVerificationEmail(body, user) {
        // Generate test SMTP service account from gmail
        let data = fs.readFileSync(path.join(__dirname, '../../../templates/email.html'), 'utf-8');

        let token = jwt.sign({
            id: user.id
        }, env.JSONWEBTOKEN_SECRET, { expiresIn: '1h' });

        let urlValidation = `${ process.env.URL }/email-verified/` + token;

        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: env.EMAIL,
                    pass: env.EMAIL_PASSWORD
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Kwee 👻" <hello@kwee.ovh>', // sender address
                to: body.email,
                subject: 'Please validate your email to signin ✔', // Subject line
                html: data.replace('@@name@@', body.name).replace('@@url@@', urlValidation)
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
        });
    }
}