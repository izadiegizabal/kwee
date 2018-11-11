const routes = [
    require('./routes/users'),
    require('./routes/offers'),
    require('./routes/users_offers')
];


// Add access to the app and db objects to each route
module.exports = function router(app, db) {
    return routes.forEach((route) => {
        route(app, db);
    });
};