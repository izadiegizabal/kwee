const passport = require('../passport'),
    env = require('../../tools/constants'),
    GitHubStrategy = require('passport-github2').Strategy;

passport.use(
    new GitHubStrategy({
            clientID: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
            callbackURL: env.GITHUB_URL
        },
        function(accessToken, refreshToken, profile, done) {
            // User.findOrCreate({ githubId: profile.id }, function(err, user) {
            //     return done(err, user);
            // });
            done(null, profile);
        }
    ));