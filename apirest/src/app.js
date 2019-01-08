require('./config/config');
const db = require('./database/sequelize'),
    router = require('./router/index'),
    mongo = require('./database/mongo'),
    app = require('./database/express');

const env = require('./tools/constants');

router(app, db);

//drop and resync with { force: true }
db.sequelize.sync( /*{ force: true }*/ ).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Express listening on port:', process.env.PORT);
    });
});