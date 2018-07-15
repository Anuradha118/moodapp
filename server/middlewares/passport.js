require('./../configs/config');
var FacebookStrategy=require('passport-facebook').Strategy;
var {User} = require('./../models/User');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    console.log(process.env.FB_CLIENT_ID+' '+process.env.FB_CLIENT_SECRET+' '+process.env.FB_CALLBACK_URL);
    passport.use(new FacebookStrategy({
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: process.env.FB_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name'],
            enableProof: true
        },
        function (token, refreshToken, profile, done) {
            console.log(profile);
            User.findOne(
                    {'social.uid': profile.id}, function (err, user) {
                if (err){
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.social.uid = profile.id;
                    newUser.social.token = token;
                    newUser.social.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.social.email = profile._json.email;
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
            // return done(null, profile);
        }));        
};