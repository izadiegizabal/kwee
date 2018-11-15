const Sequelize = require('sequelize');
const env = require('../tools/constants');

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    // logging: false
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.users = require('../models/users')(sequelize, Sequelize);
db.offerers = require('../models/offerers')(sequelize, Sequelize);
db.offers = require('../models/offers')(sequelize, Sequelize);
db.users_offers = require('../models/users_offers')(sequelize, Sequelize);
db.social_networks = require('../models/social_networks')(sequelize, Sequelize);

//Relations
// 1:N users and offers
db.users.hasMany(db.offers);
db.offers.belongsTo(db.users);

// N:M users and offers
db.offers.belongsToMany(db.users, { through: 'users_offers' });
db.users.belongsToMany(db.offers, { through: 'users_offers' });

// 1:1 user and social networks
db.social_networks.belongsTo(db.users);

db.offerers.belongsTo(db.users);

module.exports = db;