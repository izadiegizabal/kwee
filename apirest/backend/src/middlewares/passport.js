const passport = require('passport'),
    env = require('../tools/constants'),
    app = require('../database/express'),
    InstagramStrategy = require('passport-instagram').Strategy,
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    TelegramStrategy = require('passport-telegram').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user)
});

passport.use(
    new InstagramStrategy({
        clientID: env.INSTAGRAM_ID,
        clientSecret: env.INSTAGRAM_SECRET,
        callbackURL: "http://localhost:3000/auth/instagram/callback"
    }, (accessToken, refreshToken, profile, done) => {

        let user = {};
        user.displayName = profile.displayName;
        user.username = profile._json.data.username;
        user.homePage = profile._json.data.website;
        user.image = profile._json.data.profile_picture;
        user.bio = profile._json.data.bio;
        user.media = `https://api.instagram.com/v1/users/${profile.id}/media/recent/?access_token=${accessToken}&count=8`

        done(null, profile)
    }))

passport.use(
    new LinkedInStrategy({
        clientID: env.LINKEDIN_ID,
        clientSecret: env.LINKEDIN_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
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

passport.use(
    new TelegramStrategy({
            clientID: env.TELEGRAM_ID,
            clientSecret: env.TELEGRAM_SECRET,
            callbackURL: 'https://www.example.net/auth/telegram/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            // User.findOrCreate(..., function(err, user) {
            //     done(err, user);
            // });
            return done(null, profile);
        }
    ));

module.exports = passport;