const auth          = require('../middlewares/auth/auth');
const env           = require('../tools/constants.js');
const Log           = require('../models/logs');
const jwt           = require('jsonwebtoken');
const nodemailer    = require('nodemailer');
const moment        = require('moment');
const path          = require('path');
const fs            = require('fs');



class TokenId {
    getTokenId(token) {
        return auth.auth.decode(token);
    }
}

class Logger {
    async saveLog(action, actionToRoute, actionToId, res, email) {
        let toLog = {
            action,
            actionToRoute,
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

        let updates = { status: status };
        toId ? updates.actionToId = toId : null;

        Log.findByIdAndUpdate(id, updates, (err, userDB) => {
            if (err) throw new Error(err);
        })
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
    }, env.JSONWEBTOKEN_SECRET, { expiresIn: '1h' });

    let urlValidation = `${ env.URL }/email-verified/` + token;

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

    let urlValidation = `${ env.URL }/reset-password/` + token;

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


async function pagination( db, dbname, _limit, _page, attr, res, next){
    var output = {};

    var data;
    var message;

    try{
        var countTotal = await db.findAndCountAll();

        if( _limit === undefined || _page === undefined ){
            data = await db.findAll();
            message = `Listing all ${dbname}`;
        } else {
            let limit = Number(_limit);
            let page = Number(_page);
            
            if(isNaN(limit)) return res.status(400).json({ ok: false, message: 'Invalid limit value'});
            else if(isNaN(page)) return res.status(400).json({ ok: false, message: 'Invalid page value. Page starts in 1.'});
    
            let pages = Math.ceil(countTotal.count / limit);
            
            // Offset: sets the starting index to start counting 
            offset = limit * (page - 1);
    
            if (page > pages) {
                return res.status(204).json({
                    ok: true,
                    message: `It doesn't exist ${ page } pages`
                })
            }
            // if (attr.length == 0) attr = '';
            
            data = await db.findAll({
                attributes: attr,
                limit,
                offset,
            });
    
            message = `Listing ${ limit } ${ dbname }. Page ${ page } of ${ pages }.`
        }
        output.data = data;
        output.message = message;
        output.count = countTotal.count;
        
        return output;

    }
    catch(error){
        next({ type: 'error', error: error });
    }
    
}

function validateDate ( date ) {
    if(moment(date, 'YYYY-MM-DD', true).isValid()){
        return true;
    } else {
        throw new Error("Invalid date");
    }
}

async function uploadFile ( req, res, next, _type, _id, _db ) {
    
    try {
        let type = _type;
        var path = `uploads/${ type }`;
        
        // Create dir if not exists
        if (!fs.existsSync(path)){
            fs.mkdirSync(path, { recursive: true });
            console.log(`Path ${ path } created`);
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
                let fileName = `user${ id }-${ new Date().getMilliseconds() }.${ fileExt }`;
                var outputPath = `uploads/${ type }/${ fileName }`;
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
            next({ type: 'error', error: err });
        }
}

async function saveUserImg(id, outputPath, db) {
    
    var ok;
    
    let user = await db.users.findOne({
        where: { id }
    });
    
    deleteFile(user.img);

    let updated = await db.users.update({ img: outputPath }, {
        where: { id }
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
        var location = `uploads/${ type }`;
        
        // Create dir if not exists
        if (!fs.existsSync(location)){
            fs.mkdirSync(location, { recursive: true });
        }
        
        // image takes from body which you uploaded
        const imgdata = req.body.img;    
        
        // to convert base64 format into random filename
        // const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const base64Data = imgdata.split(',');
        if ( type != 'skills' ) {
            // to create some random id or name for your image name
            var imgname = new Date().getTime().toString();
        } else {
            var imgname = req.body.name;
        } 

        imgname = imgname + '.' + base64Data[0].split('/')[1].split(';')[0];
        
        // to declare some path to store your converted image
        const path = location + '/' + imgname;

        fs.writeFile(path, base64Data[1], 'base64', (err) => {
            if ( err ) {
                next({ type: 'error', error: err });
            }
        });
        return imgname;
    } catch (err) {
        next({ type: 'error', error: err });
    }

}

function checkImg(data) {
    let dataSplit = data.split(',');
    dataSplit = dataSplit[0].split('/');
    dataSplit = dataSplit[0].split(':')[1];
    if( dataSplit == 'image' ){
        return true;
    }
    return false;
}

function prepareOffersToShow(offers, offersShow, user){
    for (let i = 0; i < offers.length; i++) {
        let offer = {};

        offer.id = offers[i].id;
        offer.fk_offerer = offers[i].fk_offerer;
        offer.offererName = user.name;
        offer.offererIndex = user.index;
        offer.title = offers[i].title;
        offer.description = offers[i].description;
        offers[i].img ? offer.img = offers[i].img : offer.img = user.img;
        offer.dateStart = offers[i].dateStart;
        offer.dateEnd = offers[i].dateEnd;
        offer.datePublished = offers[i].datePublished;
        offer.location = offers[i].location;
        offer.status = offers[i].status;
        offer.salaryAmount = offers[i].salaryAmount;
        offer.salaryFrecuency = offers[i].salaryFrecuency;
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
        offersShow.push(offer);
    }
    return offersShow;
}


module.exports = {
    tokenId,
    logger,
    sendVerificationEmail,
    sendEmailResetPassword,
    pagination,
    validateDate,
    uploadFile,
    uploadImg,
    checkImg,
    deleteFile,
    prepareOffersToShow
}