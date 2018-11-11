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