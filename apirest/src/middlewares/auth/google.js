const passport = require('../passport'),
    env = require('../../tools/constants'),
    GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
    new GoogleStrategy({
            clientID: env.GOOGLE_ID,
            clientSecret: env.GOOGLE_SECRET,
            callbackURL: env.GOOGLE_URL
        },
        function(accessToken, refreshToken, profile, done) {
            //    User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //      return done(err, user);
            //    });
            console.log("strategy");
            
            done(null, profile);
        }
    ));