const jwt = require('jsonwebtoken');
const env = require('../../tools/constants');

// const { HttpException, HttpStatus } = require('@nestjs/common');

class Auth {
    encode(user, expires) {
        return jwt.sign({id: user.id}, env.JSONWEBTOKEN_SECRET,
            {expiresIn: expires ? expires : env.JSONWEBTOKEN_EXPIRES, issuer: env.JSONWEBTOKEN_ISSUER});
    }

    decode(token, res) {
        try {
            // token = token.replace('Bearer ', '');
            return (jwt.verify(token, env.JSONWEBTOKEN_SECRET, {issuer: env.JSONWEBTOKEN_ISSUER})).id;
        } catch (e) {
            // throw new HttpException('Su token ha expirado', HttpStatus.UNAUTHORIZED);
            res.status(400).json({
                ok: false,
                message: 'Invalid token'
            })
        }
    }
}

// UPDATE TOKEN EN RUTA 'auth.rehydrate'
// desde el front comprobar la hora de la petición con el lastAccess para hacer un renueve de token

const auth = new Auth();

module.exports = {
    auth
};
