const errorHandler = require('../middlewares/errorHandlet');
const routes = [
    require('./routes/users/users'),
    require('./routes/users/applicants/applicants'),
    require('./routes/users/offerers/offerers'),
    require('./routes/offers'),
    require('./routes/applications'),
    require('./routes/social_networks'),
    require('./routes/languages'),
    // require('./routes/users/applicants/applicant_languages'),
    require('./routes/educations'),
    // require('./routes/users/applicants/applicant_educations'),
    require('./routes/skills'),
    require('./routes/users/applicants/applicant_skills'),
    require('./routes/experiences'),
    require('./routes/invoices'),
    require('./routes/ratings/ratings'),
    require('./routes/ratings/rating_applicants'),
    require('./routes/ratings/rating_offerers'),
    require('./routes/messages'),
    require('./routes/comments'),
    require('./routes/login/login'),
    require('./routes/email-verified'),
    require('./routes/login/github'),
    require('./routes/login/google'),
    require('./routes/login/linkedin'),
    require('./routes/login/twitter'),
    require('./routes/logs'),
    require('./routes/images'),
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