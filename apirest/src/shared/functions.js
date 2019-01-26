const auth = require('../middlewares/auth/auth');
const Log = require('../models/logs');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const env = require('../tools/constants.js');
const jwt = require('jsonwebtoken');

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


async function pagination( db, dbname, _limit, _page, attr, res, next){
    var output = {};

    var data;
    var message;

    try{
        var countTotal = await db.findAndCountAll();

        if( _limit === undefined || _page === undefined ){
            data = await db.findAll();
            message = `Listing all ${dbname}`;
        }
        else{
            let limit = Number(_limit);
            let page = Number(_page);
            
            if(isNaN(limit)) return res.status(400).json({ ok: false, message: 'Invalid limit value'});
            else if(isNaN(page)) return res.status(400).json({ ok: false, message: 'Invalid page value. Page starts in 1.'});
    
            let pages = Math.ceil(countTotal.count / limit);
            
            // Offset: sets the starting index to start counting 
            offset = limit * (page - 1);
    
            if (page > pages) {
                return res.status(400).json({
                    ok: false,
                    message: `It doesn't exist ${ page } pages`
                })
            }
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


module.exports = {
    tokenId,
    logger,
    sendVerificationEmail,
    pagination,
    validateDate
}