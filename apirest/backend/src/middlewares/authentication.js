const jwt = require('jsonwebtoken');
const env = require('../tools/constants');
const auth = require('../middlewares/auth/auth');
const db = require('../database/sequelize');

// ==============================
// ===== Token Verification =====
// ==============================

let checkToken = async(req, res, next) => {

    let token = req.get('token');

    let decoded = await auth.auth.decode(token);

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

let checkAdmin = async(req, res, next) => {

    console.log("req: ", req.user);

    let user = await db.users.findOne({
        attributes: [
            'root'
        ],
        where: { id: req.user }
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

module.exports = {
    checkToken,
    checkAdmin
}