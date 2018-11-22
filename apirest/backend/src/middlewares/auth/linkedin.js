const passport = require('../passport'),
    env = require('../../tools/constants'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(
    new LinkedInStrategy({
        clientID: env.LINKEDIN_ID,
        clientSecret: env.LINKEDIN_SECRET,
        callbackURL: env.LINKEDIN_URL,
        scope: ['r_emailaddress', 'r_basicprofile'],
        state: true
    }, function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // To keep the example simple, the user's LinkedIn profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the LinkedIn account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));