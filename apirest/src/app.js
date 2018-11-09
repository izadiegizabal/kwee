/*
Para crear datos de prueba descomentar esto la primera vez, después se puede volver a comentar.
Se crean 5 usuarios y 1 oferta, todos los usuarios administradores.
*/

// const createUser = require('../frontend/create/user');
// const createOffer = require('../frontend/create/offer');

// const users = require('../frontend/create/users');
// const offers = require('../frontend/create/offers');

// createUser.newUser(users.carlos);
// createUser.newUser(users.marcos);
// createUser.newUser(users.alba);
// createUser.newUser(users.flaviu);
// createUser.newUser(users.izadi);

// createOffer.newOffer(offers.offer1);



const db = require('./database/sequelize'),
    router = require('./router/index'),
    app = require('./database/express');

const env = require('./tools/constants');

router(app, db);

//drop and resync with { force: true }
db.sequelize.sync().then(() => {
    app.listen(env.PORT, () => {
        console.log('Express listening on port:', env.PORT);
    });
});