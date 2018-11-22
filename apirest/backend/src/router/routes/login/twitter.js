const passport = require('../../../middlewares/passport');

module.exports = (app, db) => {

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { failureRedirect: '/' }),
        function(req, res) {
            console.log('logged with twitter!!!!!!!');
            // Successful authentication, redirect home.
            res.redirect('/');
        });

}