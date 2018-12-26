const passport = require('../passport'),
    env = require('../../tools/constants'),
    TelegramStrategy = require('passport-telegram').Strategy;

passport.use(
    new TelegramStrategy({
            clientID: env.TELEGRAM_ID,
            clientSecret: env.TELEGRAM_SECRET,
            callbackURL: env.TELEGRAM_URL
        },
        function(accessToken, refreshToken, profile, done) {
            // User.findOrCreate(..., function(err, user) {
            //     done(err, user);
            // });
            return done(null, profile);
        }
    ));