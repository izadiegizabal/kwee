const auth = require('../middlewares/auth/auth');
const Log = require('../models/logs');
const moment = require('moment');

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

module.exports = {
    tokenId,
    logger
}