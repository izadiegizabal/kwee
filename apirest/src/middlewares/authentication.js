const jwt = require('jsonwebtoken');
const env = require('../tools/constants');
const auth = require('../middlewares/auth/auth');
const db = require('../database/sequelize');

// ==============================
// ===== Token Verification =====
// ==============================

let checkToken = async (req, res, next) => {

    let token = req.get('token');

    let decoded = await auth.auth.decode(token, res);

    if (typeof decoded === "number") {
        req.user = decoded;
        next();
    } else {
        return res.status(401).json(decoded);
    }

};

// ==============================
// ===== Admin Verification =====
// ==============================

let checkAdmin = async (req, res, next) => {

    let token = req.get('token');

    let id = await auth.auth.decode(token);

    let user = await db.users.findOne({
        attributes: [
            'root'
        ],
        where: {id}
    });

    if (user.root) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not root'
            }
        });
    }
};

let checkApplicant = async (req, res, next) => {

    let user = await db.applicants.findOne({
        where: {userId: req.user}
    });

    if (user) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not applicant'
            }
        });
    }
};

let checkOfferer = async (req, res, next) => {

    let user = await db.offerers.findOne({
        where: {userId: req.user}
    });

    if (user) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User not offerer'
            }
        });
    }
};

module.exports = {
    checkToken,
    checkAdmin,
    checkApplicant,
    checkOfferer
};
