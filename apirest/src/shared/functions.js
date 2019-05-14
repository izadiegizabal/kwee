const elastic = require('../database/elasticsearch');
const auth = require('../middlewares/auth/auth');
const {usersConnected} = require('../middlewares/sockets');
const env = require('../tools/constants.js');
const io = require('../database/sockets');
const Log = require('../models/logs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');
const path = require('path');
const fs = require('fs');


class TokenId {
    getTokenId(token, res) {
        return auth.auth.decode(token, res);
    }
}

class Logger {
    async saveLog(action, actionToRoute, actionToId, res, useragent, ip, userId, email) {
        let toLog = {
            action,
            actionToRoute,
            ip,
            useragent,
            userId,
            date: moment().format('YYYY/MM/DD'),
            hour: moment().format('HH:mm:ss')
        };

        actionToId ? toLog.actionToId = actionToId : null;
        email ? toLog.email = email : null;

        let log = new Log(toLog);

        return await new Promise(resolve => {
            log.save((err, logDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: "Log not create"
                    });
                }
                resolve(logDB._id);
            });
        });

    }

    updateLog(id, status, toId) {
        // id is the log to update
        // toId is the id to which route id is the action

        let updates = {status: status};
        toId ? updates.actionToId = toId : null;

        Log.findByIdAndUpdate(id, updates, (err, userDB) => {
            if (err) throw new Error(err);
        });
    }
}

// UPDATE TOKEN EN RUTA 'auth.rehydrate'
// desde el front comprobar la hora de la petición con el lastAccess para hacer un renueve de token

const tokenId = new TokenId();
const logger = new Logger();

function sendVerificationEmail(body, user) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/email.html'), 'utf-8');

    let token = jwt.sign({
        id: user.id
    }, env.JSONWEBTOKEN_SECRET, {expiresIn: '1h'});

    let urlValidation = `${env.URL}/email-verified/` + token;

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

function sendEmailResetPassword(user, res) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/emailResetPassword.html'), 'utf-8');
    let token = auth.auth.encode(user, '1h');

    // let urlValidation = `${ env.URL }/email-verified/` + token;

    let urlValidation = `${env.URL}/reset-password/` + token;

    //let urlValidation = `http://localhost:4200/reset-password/` + token;

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
            to: user.email,
            subject: 'Reset password ✔', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@url@@', urlValidation)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error: ", error);
                return res.status(400).json({
                    ok: false,
                    message: "Error sending email reset password"
                });
            }
            return res.status(200).json({
                ok: true,
                message: "Reset password email sended",
                //token
            });
        });
    });
}

function sendEmailSelected(user, res, offer) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/emailSelected.html'), 'utf-8');
    let token = auth.auth.encode(user, '1h');

    let urlValidation = `${env.URL}/reset-password/` + token;

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
            to: user.email,
            subject: 'You are selected! ✔', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@url@@', 'https://kwee.ovh').replace('@@offer@@', offer)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: "Error sending email applicant selected"
                });
            }
            return res.status(200).json({
                ok: true,
                message: "Applicant selected email sended"
            });
        });
    });
}

function sendEmailOfferClosed(user, res, offer) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/emailOfferClosed.html'), 'utf-8');
    let token = auth.auth.encode(user, '1h');

    let urlValidation = `${env.URL}/reset-password/` + token;

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
            to: user.email,
            subject: 'Sorry, offer is now closed!', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@urlAccepted@@', 'https://kwee.ovh').replace('@@offer@@', offer.id).replace('@@urlRefused@@', 'https://kwee.ovh')
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    message: "Error sending email offer closed"
                });
            }
            return res.status(200).json({
                ok: true,
                message: "Offer closed email sended",
                //token
            });
        });
    });
}

function sendEmailInactiveUser(user) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/emailInactiveUser.html'), 'utf-8');
    let url = `${ env.URL }`;

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
            to: user.email,
            subject: 'We miss you', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@url@@', url)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error);
            }
        });
    });
}

function sendEmailPremiumExpiresAdvise(user) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/sendEmailPremiumExpiresAdvise.html'), 'utf-8');
    let url = `${ env.URL }`;

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
            to: user.email,
            subject: 'We miss you', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@url@@', url)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error);
            }
        });
    });
}

function sendEmailPremiumExpires(user) {
    // Generate test SMTP service account from gmail
    let data = fs.readFileSync(path.join(__dirname, '../templates/sendEmailPremiumExpires.html'), 'utf-8');
    let url = `${ env.URL }`;

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
            to: user.email,
            subject: 'We miss you', // Subject line
            html: data.replace('@@name@@', user.email).replace('@@url@@', url)
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error);
            }
        });
    });
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

async function pagination(db, dbname, _limit, _page, attr, res, next) {
    var output = {};

    var data;
    var message;

    try {
        var countTotal = await db.findAndCountAll();

        if (_limit === undefined || _page === undefined) {
            data = await db.findAll({attributes: attr});
            message = `Listing all ${dbname}`;
        } else {
            let limit = Number(_limit);
            let page = Number(_page);

            if (isNaN(limit)) return res.status(400).json({ok: false, message: 'Invalid limit value'});
            else if (isNaN(page)) return res.status(400).json({
                ok: false,
                message: 'Invalid page value. Page starts in 1.'
            });

            let pages = Math.ceil(countTotal.count / limit);

            // Offset: sets the starting index to start counting 
            offset = limit * (page - 1);

            if (page > pages) {
                return res.status(200).json({
                    ok: true,
                    message: `It doesn't exist ${page} pages`
                });
            }

            data = await db.findAll({
                attributes: attr,
                limit,
                offset,
            });

            message = `Listing ${limit} ${dbname}. Page ${page} of ${pages}.`
        }
        output.data = data;
        output.message = message;
        output.count = countTotal.count;

        return output;

    } catch (error) {
        return next({type: 'error', error: error.message});
    }

}

function validateDate(date) {
    if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        return true;
    } else {
        throw new Error("Invalid date");
    }
}

async function uploadFile(req, res, next, _type, _id, _db) {

    try {
        let type = _type;
        var path = `uploads/${type}`;

        // Create dir if not exists
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true});
            console.log(`Path ${path} created`);
        }

        let id = _id;

        if (!isNaN(id)) {
            if (!req.files) {
                return res.status(400).json({
                    ok: false,
                    message: 'Not file selected'
                });
            }

            // Validate type
            let validTypes = ['users'];
            if (validTypes.indexOf(type) < 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Valid types are: ' + validTypes.join(', ')
                })
            }

            let file = req.files.img;

            let fileNameCut = file.name.split('.');
            let fileExt = fileNameCut[fileNameCut.length - 1];

            // Validate extension
            let validExt = ['png', 'jpg', 'gif', 'jpeg'];

            if (validExt.indexOf(fileExt) < 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'Valid extension are ' + validExt.join(', '),
                    ext: fileExt
                })
            }

            // Change file name
            let fileName = `user${id}-${new Date().getMilliseconds()}.${fileExt}`;
            var outputPath = `uploads/${type}/${fileName}`;
            file.mv(outputPath, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: err
                    });
                }

            });
            var out = await saveUserImg(id, outputPath, _db);
            return out;
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Invalid user'
            });
        }
    } catch (err) {
        next({type: 'error', error: err});
    }
}

async function saveUserImg(id, outputPath, db) {

    var ok;

    let user = await db.users.findOne({
        where: {id}
    });

    deleteFile(user.img);

    let updated = await db.users.update({img: outputPath}, {
        where: {id}
    });

    if (updated > 0) {
        ok = true;
    } else {
        ok = false;
    }
    //console.log("1- (saveUser) ok = " + ok);
    return ok
}

function deleteFile(outputPath) {

    //let pathImage = path.resolve(__dirname, `../../../uploads/${ type }/${ fileName }`);

    console.log('path: ', outputPath);

    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
    }
}

function uploadImg(req, res, next, type,) {

    try {
        var location = `uploads/${type}`;

        // Create dir if not exists
        if (!fs.existsSync(location)) {
            fs.mkdirSync(location, {recursive: true});
        }

        // image takes from body which you uploaded
        const imgdata = req.body.img;

        // to convert base64 format into random filename
        // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const base64Data = imgdata.split(',');
        if (type != 'skills') {
            // to create some random id or name for your image name
            var imgname = new Date().getTime().toString();
        } else {
            var imgname = req.body.name;
        }

        imgname = imgname + '.' + base64Data[0].split('/')[1].split(';')[0];

        // to declare some path to store your converted image
        const path = location + '/' + imgname;

        fs.writeFile(path, base64Data[1], 'base64', (err) => {
            if (err) {
                next({type: 'error', error: err});
            }
        });
        return path;
    } catch (err) {
        next({type: 'error', error: err});
    }

}

function checkImg(data) {
    let dataSplit = data.split(',');
    dataSplit = dataSplit[0].split('/');
    dataSplit = dataSplit[0].split(':')[1];
    if (dataSplit == 'image') {
        return true;
    }
    return false;
}

function prepareOffersToShow(offers, offersShow, user) {
    for (let i = 0; i < offers.length; i++) {
        let offer = {};

        offer.id = offers[i].id;
        offer.fk_offerer = offers[i].fk_offerer;
        offer.offererName = user.name;
        offer.offererIndex = user.index;
        offer.avg = getOffererAVG(user.offerer);
        offer.title = offers[i].title;
        offer.description = offers[i].description;
        offers[i].img ? offer.img = offers[i].img : offer.img = user.img;
        offer.dateStart = offers[i].dateStart;
        offer.dateEnd = offers[i].dateEnd;
        offer.datePublished = offers[i].datePublished;
        offer.location = offers[i].location;
        offer.status = offers[i].status;
        offer.salaryAmount = offers[i].salaryAmount;
        offer.salaryFrequency = offers[i].salaryFrequency;
        offer.salaryCurrency = offers[i].salaryCurrency;
        offer.workLocation = offers[i].workLocation;
        offer.seniority = offers[i].seniority;
        offer.maxApplicants = offers[i].maxApplicants;
        offer.currentApplications = offers[i].currentApplications;
        offer.duration = offers[i].duration;
        offer.durationUnit = offers[i].durationUnit;
        offer.isIndefinite = offers[i].isIndefinite;
        offer.contractType = offers[i].contractType;
        offer.responsabilities = offers[i].responsabilities;
        offer.requeriments = offers[i].requeriments;
        offer.skills = offers[i].skills;
        offer.lat = offers[i].lat;
        offer.lon = offers[i].lon;
        offer.createdAt = offers[i].createdAt;
        offer.updatedAt = offers[i].updatedAt;
        offer.deletedAt = offers[i].deletedAt;
        offer.applications = [];
        offersShow.push(offer);
    }
    return offersShow;
}

function buildOffersToShow(users, offersToShow, offers) {
    for (let i = 0; i < offers.length; i++) {
        let user = users.find(element => offers[i]._source.fk_offerer == element.id);
        let offer = {};

        offer.id = offers[i]._id;
        offer.fk_offerer = offers[i]._source.fk_offerer;
        offer.offererName = user.name;
        offer.offererIndex = user.index;
        offer.avg = getOffererAVG(user.offerer);
        offers[i]._source.img ? offer.img = offers[i]._source.img : offer.img = user.img;
        offer.title = offers[i]._source.title;
        offer.description = offers[i]._source.description;
        offer.dateStart = offers[i]._source.dateStart;
        offer.dateEnd = offers[i]._source.dateEnd;
        offer.datePublished = offers[i]._source.datePublished;
        offer.location = offers[i]._source.location;
        offer.status = offers[i]._source.status;
        offer.salaryAmount = offers[i]._source.salaryAmount;
        offer.salaryFrequency = offers[i]._source.salaryFrequency;
        offer.salaryCurrency = offers[i]._source.salaryCurrency;
        offer.workLocation = offers[i]._source.workLocation;
        offer.seniority = offers[i]._source.seniority;
        offer.maxApplicants = offers[i]._source.maxApplicants;
        offer.currentApplications = offers[i]._source.currentApplications;
        offer.duration = offers[i]._source.duration;
        offer.durationUnit = offers[i]._source.durationUnit;
        offer.isIndefinite = offers[i]._source.isIndefinite;
        offer.contractType = offers[i]._source.contractType;
        offer.responsabilities = offers[i]._source.responsabilities;
        offer.requeriments = offers[i]._source.requeriments;
        offer.skills = offers[i]._source.skills;
        offer.lat = offers[i]._source.lat;
        offer.lon = offers[i]._source.lon;
        offer.createdAt = offers[i]._source.createdAt;
        offer.updatedAt = offers[i]._source.updatedAt;
        offer.deletedAt = offers[i]._source.deletedAt;

        offersToShow.push(offer);
    }
}

function saveLogES(action, actionToRoute, user) {
    moment.locale('es');

    let body = {
        user,
        action,
        actionToRoute,
        date: moment().format('YYYY-MM-DD'),
        hour: moment().format('HH:mm:ss'),
    };

    elastic.index({
        index: 'logs',
        type: 'log',
        body
    }, function (err, resp, status) {
        if (err) {
            console.log(err)
        }
    });
}

function getSocketUserId(email) {
    let socketUsers = usersConnected.getList();
    socketUsers = socketUsers.find(element => element.email === email);
    return socketUsers ? socketUsers.id : null;
}

async function sendNotification(route, id, object, bool) {
    // object is the table in database
    // let payload = {
    //     selected: bool,
    //     applicationId: object.id,
    //     offerId: object.fk_offer
    // };

    let noti = await db.notifications.findOne({ where: { id: object.id }});
    let from = await db.offers.findOne({ where: { id: object.from }})
    let offer;
    switch ( object.idTable ) {
        case 'offers': offer = await db.offers.findOne({ where: { id: object.idTable }}); break;
        case 'applications': let application = await db.applications.findOne({ where: { id: object.idTable }}); break;
    }

    let notification = {
        id : noti.id,
        read: noti.read,
        status: noti.status,
        notification: noti.notification,
        from,
        offer
    };

    let payload = {
        ok: true,
        message: 'New notification',
        data: notification,
        unread: 1,
        total: 1,
        page: 1,
        limit: 1
    }

    io.in(id).emit(route, payload);
}

async function createNotification(db, to, from, type, idTable, notification, status) {
    await db.notifications.create({
        to,
        from,
        type,
        idTable,
        notification,
        status
    });
}

function getOffererAVG( offerer ) {

    var avg = {};
    if ( offerer ) {
        avg.salaryAVG = offerer.salaryAVG;
        avg.environmentAVG = offerer.environmentAVG;
        avg.partnersAVG = offerer.partnersAVG;
        avg.servicesAVG = offerer.servicesAVG;
        avg.installationsAVG = offerer.installationsAVG;
        avg.satisfactionAVG = offerer.satisfactionAVG;
    }

    return avg;
}

function getApplicantAVG( applicant ) {

    var avg = {};
    if ( applicant ) {
        avg.efficiencyAVG = applicant.efficiencyAVG;
        avg.skillsAVG = applicant.skillsAVG;
        avg.punctualityAVG = applicant.punctualityAVG;
        avg.hygieneAVG = applicant.hygieneAVG;
        avg.teamworkAVG = applicant.teamworkAVG;
        avg.satisfactionAVG = applicant.satisfactionAVG;
    }

    return avg;
}


module.exports = {
    tokenId,
    logger,
    sendVerificationEmail,
    sendEmailResetPassword,
    sendEmailSelected,
    sendEmailOfferClosed,
    sendEmailPremiumExpiresAdvise,
    sendEmailPremiumExpires,
    pagination,
    validateDate,
    uploadFile,
    uploadImg,
    checkImg,
    deleteFile,
    prepareOffersToShow,
    buildOffersToShow,
    isEmpty,
    saveLogES,
    sendNotification,
    getSocketUserId,
    createNotification,
    sendEmailInactiveUser,
    getOffererAVG,
    getApplicantAVG
}
