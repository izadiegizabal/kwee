const Sequelize = require('sequelize');
const env = require('../tools/constants');

// console.log("Sequelize.Op: ");
// console.log(Sequelize.Op);

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
    pool: {
        max: 25,
        min: 1,
        idle: 10000
    }
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../models/users')(sequelize, Sequelize);
db.offerers = require('../models/offerers')(sequelize, Sequelize);
db.applicants = require('../models/applicants')(sequelize, Sequelize);
db.offers = require('../models/offers')(sequelize, Sequelize);
db.users_offers = require('../models/applications')(sequelize, Sequelize);
db.social_networks = require('../models/social_networks')(sequelize, Sequelize);
db.messages = require('../models/messages')(sequelize, Sequelize);
db.experiences = require('../models/experiences')(sequelize, Sequelize);
db.educations = require('../models/educations')(sequelize, Sequelize);
db.skills = require('../models/skills')(sequelize, Sequelize);
db.languages = require('../models/languages')(sequelize, Sequelize);
db.applicant_educations = require('../models/applicant_educations')(sequelize, Sequelize);
db.applicant_skills = require('../models/applicant_skills')(sequelize, Sequelize);
db.applicant_languages = require('../models/applicant_languages')(sequelize, Sequelize);
db.ratings = require('../models/ratings')(sequelize, Sequelize);
db.invoices = require('../models/invoices')(sequelize, Sequelize);
db.rating_applicants = require('../models/rating_applicants')(sequelize, Sequelize);
db.rating_offerers = require('../models/rating_offerers')(sequelize, Sequelize);
db.comments = require('../models/comments')(sequelize, Sequelize);
db.applications = require('../models/applications')(sequelize, Sequelize);

/* Relations */
// Heredity
db.offerers.removeAttribute('id');
db.applicants.removeAttribute('id');
db.rating_applicants.removeAttribute('id');
db.rating_offerers.removeAttribute('id');

db.users.hasOne(db.offerers, { as: 'user' });
db.users.hasOne(db.applicants);
db.ratings.hasOne(db.rating_applicants, { as: 'rating' });
db.ratings.hasOne(db.rating_offerers);

// 1:N
db.offerers.hasMany(db.offers, { foreignKey: 'fk_offerer' });

db.applicants.hasMany(db.experiences, { foreignKey: 'fk_applicant' });

db.rating_applicants.hasMany(db.comments, { foreignKey: 'fk_rating_applicant' });
db.rating_offerers.hasMany(db.comments, { foreignKey: 'fk_rating_offerer' });

// N:M
db.offers.belongsToMany(db.applicants, { through: 'applications', foreignKey: 'fk_offer' });
db.applicants.belongsToMany(db.offers, { through: 'applications', foreignKey: 'fk_applicant' });

db.users.belongsToMany(db.users, { through: 'messages', as: 'sender', foreignKey: 'fk_sender' });
db.users.belongsToMany(db.users, { through: 'messages', as: 'receiver', foreignKey: 'fk_receiver' });

db.applicants.belongsToMany(db.educations, { through: 'applicant_educations', as: 'applicant', foreignKey: 'fk_applicant' });
db.educations.belongsToMany(db.applicants, { through: 'applicant_educations', as: 'education', foreignKey: 'fk_education' });

db.applicants.belongsToMany(db.skills, { through: 'applicant_skills', as: 'applicant_skill', foreignKey: 'fk_applicant' });
db.skills.belongsToMany(db.applicants, { through: 'applicant_skills', as: 'skill', foreignKey: 'fk_skill' });

db.applicants.belongsToMany(db.languages, { through: 'applicant_languages', as: 'applicant_language', foreignKey: 'fk_applicant' });
db.languages.belongsToMany(db.applicants, { through: 'applicant_languages', as: 'language', foreignKey: 'fk_language' });

// 1:1
db.social_networks.belongsTo(db.users);

db.applications.hasOne(db.invoices, { foreignKey: 'fk_application' });

db.applications.hasOne(db.ratings, { foreignKey: 'fk_application' });


module.exports = db;