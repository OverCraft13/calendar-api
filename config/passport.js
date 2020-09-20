const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const customFields = {
  usernameField: "email",
  passwordField: "password"
};

const verifyCallback = function (username, password, done) {
  User.findOne({ email: username }, async function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    } // null means no error, false means no user
    try {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return done(null, false);
      }
      return done(null, user); // if this is valid
      // call serialize user
    } catch {
      return done(null, false);
    }
  });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy); // passport strategy to validate the requests

passport.serializeUser(function (user, done) {
  done(null, user.id);
  // its going to make req.session.passport.user available
  //that means that the user is authenticated
});

passport.deserializeUser(function (id, done) {
  //this makes req.user available to the server when the user is authenthicated
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
