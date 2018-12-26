const auth = require('../middlewares/auth/auth');

class TokenId {
    getTokenId(token) {
        return auth.auth.decode(token);
    }
}

// UPDATE TOKEN EN RUTA 'auth.rehydrate'
// desde el front comprobar la hora de la petición con el lastAccess para hacer un renueve de token

const tokenId = new TokenId();

module.exports = {
    tokenId
}