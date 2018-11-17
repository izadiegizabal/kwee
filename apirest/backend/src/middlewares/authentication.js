const jwt = require('jsonwebtoken');
const env = require('../tools/constants');

// ==============================
// ===== Token Verification =====
// ==============================

let checkToken = ( req, res, next ) =>{

    let token = req.get('token');

    jwt.verify( token, env.JSONWEBTOKEN_SECRET, (err, decoded) => {

        if ( err ){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }

        req.user = decoded.user;
        next();

    })
};

// ==============================
// ===== Admin Verification =====
// ==============================

let checkAdmin = ( req, res, next ) =>{

    let user = req.user;

    if(user.root){
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