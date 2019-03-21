const passport = require('passport'),
    { app } = require('../database/express');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});

module.exports = passport;

// require('./auth/instagram');
require('./auth/linkedin');
// require('./auth/telegram');
require('./auth/twitter');
require('./auth/github');