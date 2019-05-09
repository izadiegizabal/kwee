const passport = require('../passport'),
    env = require('../../tools/constants'),
    InstagramStrategy = require('passport-instagram').Strategy;

passport.use(
    new InstagramStrategy({
        clientID: env.INSTAGRAM_ID,
        clientSecret: env.INSTAGRAM_SECRET,
        callbackURL: env.INSTAGRAM_URL
    }, (accessToken, refreshToken, profile, done) => {

        let user = {};
        user.displayName = profile.displayName;
        user.username = profile._json.data.username;
        user.homePage = profile._json.data.website;
        user.image = profile._json.data.profile_picture;
        user.bio = profile._json.data.bio;
        user.media = `https://api.instagram.com/v1/users/${profile.id}/media/recent/?access_token=${accessToken}&count=8`;

        done(null, profile)
    }));

// module.exports = passport;
