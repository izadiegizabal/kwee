// const env = require('../../../tools/constants');
// const passport = require('../../../middlewares/passport');
// const jwt = require('jsonwebtoken');
// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client(env.CLIENT_ID);

// module.exports = (app, db) => {

//     // Google config
//     async function verify(token) {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: env.CLIENT_ID, // Specify the CLIENT_ID
//             // Or, multiple clients access the backend:
//             //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//         });
//         const payload = ticket.getPayload();

//         return {
//             name: payload.name,
//             email: payload.email,
//             // google: true
//         }

//     }

//     app.post('/google', async (req, res, next) => {

//         let token = req.body.idtoken;

//         let googleUser = await verify(token)
//             .catch(e => {
//                 return res.status(403).json({
//                     ok: false,
//                     err: e
//                 });
//             });

//         let user = await db.users.findOne({where: {email: googleUser.email}});

//         if (!user) {

//             try {
//                 let user = await db.users.create({
//                     name: googleUser.name,
//                     email: googleUser.email,
//                     password: ':)',
//                     snSignIn: true,
//                     status: 4
//                 });

//                 await db.social_networks.create({
//                     userId: user.id,
//                     google: user.email
//                 });

//                 return res.status(201).json({
//                     ok: true,
//                     user: {
//                         id: user.id,
//                         name: user.name
//                     }
//                 });

//             } catch (err) {
//                 next({type: 'error', error: err.errors[0].message});
//             }
//         } else {
//             if (user.google === false) {
//                 return res.status(400).json({
//                     ok: false,
//                     err: {
//                         message: 'Not google registration'
//                     }
//                 });
//             } else {
//                 let token = jwt.sign({
//                     user
//                 }, env.JSONWEBTOKEN_SECRET, {expiresIn: env.JSONWEBTOKEN_EXPIRES});

//                 return res.json({
//                     ok: true,
//                     user: {
//                         name: user.name,
//                         email: user.email
//                     },
//                     token
//                 })
//             }
//         }
//     });

// };

const passport = require('../../../middlewares/passport');
const auth = require('../../../middlewares/auth/auth');
const env = require('../../../tools/constants');
const moment = require('moment');
const {logger} = require('../../../shared/functions');

var typeToFront;

module.exports = (app, db) => {

    app.get('/auth/google',
        passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }
    ), async (req, res) => {
        console.log('golasdfasd');
        
        typeToFront = req.query.type;
    });

    app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/login'}),

        async (req, res, next) => {
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // Authentication with google successful
            try {

                let user = await db.users.findOne({ where: { email: req.user._json.email }});

                if (!user) {
                    // New user
                    user = await db.users.create({
                        name: req.user.displayName,
                        email: req.user._json.email,
                        password: ':)',
                        snSignIn: true,
                        status: 4
                    });

                    await db.social_networks.create({
                        userId: user.id,
                        google: user.email
                    });

                    let token = auth.auth.encode(user);
                    const query = `token=${token}&id=${user.id}&name=${user.name}&email=${user.email}&type=${typeToFront}`;

                    res.redirect(env.SIGNUP + query);

                } else {
                    // Existent user
                    let logId = await logger.saveLog('POST', 'login', null, res, req.useragent, ip, user.email);

                    let type;
                    let id = user.id;
                    let dateNow = moment().format();

                    await db.users.update({ lastAccess: dateNow }, {
                        where: { id }
                    });

                    let userUpdated = await db.users.findOne({ where: { id }});

                    delete userUpdated.dataValues.password;

                    let notifications = await db.notifications.findAll({ where: { to: id, read: false }});

                    notifications ? notifications = notifications.length : notifications = 0;

                    let token = auth.auth.encode(userUpdated);
                    logger.updateLog(logId, true, id);


                    if ( user.root ) {
                        type = 'admin';
                    } else {
                        var avg = {};
                        let offerer = await db.offerers.findOne({
                            where: { userId: id }
                        });
                        if (offerer) {
                            avg = getOffererAVG(offerer);
                            type = 'offerer';
                        } else {
                            let applicant = await db.applicants.findOne({
                                where: { userId: id }
                            });
                            if ( applicant ) {
                                avg = getApplicantAVG(applicant);
                                type = 'applicant';
                            } else {
                                avg = null;
                                type = null;
                            }
                        }
                    }

                    return res.json({
                        ok: true,
                        message: 'Login successful',
                        data: {
                            id: userUpdated.id,
                            name: userUpdated.name,
                            email: userUpdated.email,
                            img: userUpdated.img,
                            bio: userUpdated.bio,
                            lastAccess: userUpdated.lastAccess,
                            index: userUpdated.index,
                            avg,
                            status: userUpdated.status,
                            notifications,
                            type
                        },
                        token
                    });
                }
            } catch (err) {
                return next({type: 'error', error: err.message});
            }
        });

};
