const errorHandler = require('../middlewares/errorHandlet');
const routes = [
    require('./routes/users'),
    require('./routes/offers'),
    require('./routes/users_offers'),
    require('./routes/social_networks'),
    require('./routes/login'),
    require('./routes/login/github'),
    require('./routes/login/google'),
    require('./routes/login/instagram'),
    require('./routes/login/linkedin'),
    require('./routes/login/telegram'),
    require('./routes/login/twitter')
];

// Add access to the app and db objects to each route
module.exports = function router(app, db) {

    let rts = routes.forEach((route) => {
        route(app, db);
    });

    app.use(errorHandler);

    return rts;

};