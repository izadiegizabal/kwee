const passport = require('../passport'),
    env = require('../../tools/constants'),
    TwitterStrategy = require('passport-twitter').Strategy;

passport.use(
    new TwitterStrategy({
            consumerKey: env.TWITTER_ID,
            consumerSecret: env.TWITTER_SECRET,
            callbackURL: env.TWITTER_URL
        },
        function (token, tokenSecret, profile, cb) {
            // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
            //   return cb(err, user);
            // });
            done(null, profile);
        }
    ));
