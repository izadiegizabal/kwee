const errorHandler = require('../middlewares/errorHandlet');
const routes = [
    require('./routes/users'),
    require('./routes/applicants'),
    require('./routes/offerers'),
    require('./routes/offers'),
    require('./routes/applications'),
    require('./routes/social_networks'),
    require('./routes/languages'),
    require('./routes/applicant_languages'),
    require('./routes/educations'),
    require('./routes/applicant_educations'),
    require('./routes/skills'),
    require('./routes/applicant_skills'),
    require('./routes/experiences'),
    require('./routes/invoices'),
    require('./routes/ratings'),
    require('./routes/messages'),
    require('./routes/comments'),
    require('./routes/login'),
    require('./routes/login/github'),
    require('./routes/login/google'),
    require('./routes/login/linkedin'),
    require('./routes/login/twitter')
    // require('./routes/login/instagram'),
    // require('./routes/login/telegram'),
];

// Add access to the app and db objects to each route
module.exports = function router(app, db) {

    let rts = routes.forEach((route) => {
        route(app, db);
    });

    app.use(errorHandler);

    return rts;

};