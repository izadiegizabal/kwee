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
    }, async function(accessToken, refreshToken, profile, done) {
        await process.nextTick(function() {
            return done(null, profile);
        });
    }));