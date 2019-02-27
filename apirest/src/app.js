require('./config/config');
const db = require('./database/sequelize'),
    router = require('./router/index'),
    mongo = require('./database/mongo'),
    app = require('./database/express');

const env = require('./tools/constants');

router(app, db);

//drop and resync with { force: true }
db.sequelize.sync( /*{ force: true }*/ ).then(() => {
    app.listen(env.API_PORT, () => {
        console.log('Express listening on port:', env.API_PORT);
    });
});