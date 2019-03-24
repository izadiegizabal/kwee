const { Sequelize  } = require('./op');
const env = require('../tools/constants');

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: env.PROD ? true : false,
    operatorsAliases: false,
    timezone: '+01:00',
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
db.users = require('../models/users/users')(sequelize, Sequelize);
db.offerers = require('../models/users/offerers/offerers')(sequelize, Sequelize);
db.applicants = require('../models/users/applicants/applicants')(sequelize, Sequelize);
db.offers = require('../models/offers')(sequelize, Sequelize);
db.users_offers = require('../models/applications')(sequelize, Sequelize);
db.social_networks = require('../models/social_networks')(sequelize, Sequelize);
db.messages = require('../models/messages')(sequelize, Sequelize);
db.experiences = require('../models/experiences')(sequelize, Sequelize);
db.educations = require('../models/educations')(sequelize, Sequelize);
db.skills = require('../models/skills')(sequelize, Sequelize);
db.languages = require('../models/languages')(sequelize, Sequelize);
db.applicant_skills = require('../models/users/applicants/applicant_skills')(sequelize, Sequelize);
db.applicant_educations = require('../models/users/applicants/applicant_educations')(sequelize, Sequelize);
db.applicant_languages = require('../models/users/applicants/applicant_languages')(sequelize, Sequelize);
db.ratings = require('../models/ratings/ratings')(sequelize, Sequelize);
db.invoices = require('../models/invoices')(sequelize, Sequelize);
db.rating_applicants = require('../models/ratings/rating_applicants')(sequelize, Sequelize);
db.rating_offerers = require('../models/ratings/rating_offerers')(sequelize, Sequelize);
db.comments = require('../models/comments')(sequelize, Sequelize);
db.applications = require('../models/applications')(sequelize, Sequelize);
db.notifications = require('../models/notifications')(sequelize, Sequelize);

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

db.users.hasMany(db.comments, { foreignKey: 'fk_user' });

// N:M
db.offers.belongsToMany(db.applicants, { through: 'applications', foreignKey: 'fk_offer' });
db.applicants.belongsToMany(db.offers, { through: 'applications', foreignKey: 'fk_applicant' });

db.users.belongsToMany(db.users, { through: 'messages', as: 'sender', foreignKey: 'fk_sender' });
db.users.belongsToMany(db.users, { through: 'messages', as: 'receiver', foreignKey: 'fk_receiver' });

db.applicants.belongsToMany(db.educations, { through: 'applicant_educations', foreignKey: 'fk_applicant' });
db.educations.belongsToMany(db.applicants, { through: 'applicant_educations', foreignKey: 'fk_education' });
db.applicants.belongsToMany(db.skills, { through: 'applicant_skills', foreignKey: 'fk_applicant' });
db.skills.belongsToMany(db.applicants, { through: 'applicant_skills', foreignKey: 'fk_skill' });
db.applicants.belongsToMany(db.languages, { through: 'applicant_languages', foreignKey: 'fk_applicant' });
db.languages.belongsToMany(db.applicants, { through: 'applicant_languages', foreignKey: 'fk_language' });


// 1:1
db.social_networks.belongsTo(db.users);

db.users.hasOne(db.invoices, { foreignKey: 'fk_user' });

db.applications.hasOne(db.ratings, { foreignKey: 'fk_application' });


module.exports = db;