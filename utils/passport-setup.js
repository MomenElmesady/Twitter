const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    // options for google strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:3939/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        // already have this user
        console.log('user is: ', currentUser);
        done(null, currentUser); // to indicate successful authentication.
      } else {
        // if not, create user in our db
        new User({
          googleId: profile.id,
          name: profile.displayName,
          isverified: true
        }).save().then((newUser) => {
          console.log('created new user: ', newUser);
          done(null, newUser); // to indicate successful authentication with the newly created user.
        });
      }
    });
  })
);
