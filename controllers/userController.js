const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");
const ApiError = require("../classes/ApiError");
const { check, validationResult } = require("express-validator");

const loginRateLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: "loginRateLimits",
  points: 30,
  duration: 60 * 30,
  blockDuration: 60 * 30,
  inmemoryBlockOnConsumed: 30,
  inmemoryBlockDuration: 60 * 30
});

const registerRateLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: "registerRateLimits",
  points: 20,
  duration: 60 * 20,
  blockDuration: 60 * 20,
  inmemoryBlockOnConsumed: 20,
  inmemoryBlockDuration: 60 * 20
});

const userCookieConfig = {
  secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 30,
  httpOnly: false,
  sameSite: true
};

const validation = [
  check("email").isEmail().normalizeEmail(),
  check("password").isLength({ min: 6, max: 20 })
];
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.unprocessableEntity("Unprocessable entity"));
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        email: req.body.email,
        password: hashedPassword
      });
      registerRateLimiter
        .consume(req.ip, 1)
        .then(() => {
          user.save((err) => {
            if (err) {
              return next(
                ApiError.badRequest("the email is already registered")
              );
            }
            // generate token
            // sendEmail
            passport.authenticate("local", function (err, user, info) {
              if (err) {
                return next(err);
              }
              if (!user) {
                return next(ApiError.unauthorized("wrong email or password"));
              } else {
                req.logIn(user, function (err) {
                  if (err) {
                    return next(err);
                  }
                  res.cookie("user", { user }, userCookieConfig); // to manage sessions int front end
                  return res.status(200).json({
                    user: user,
                    message: "login successful"
                  });
                });
              }
            })(req, res, next);
          });
        })
        .catch(() => {
          return next(
            ApiError.tooManyRequests(
              "too many register requests from this ip adress"
            )
          );
        });
    } catch {
      return next(ApiError.internal("internal server error"));
    }
  }
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.unprocessableEntity("Unprocessable entity"));
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      loginRateLimiter
        .consume(req.ip, 0)
        .then(() => {
          if (!user) {
            loginRateLimiter.consume(req.ip, 1);
            return next(ApiError.unauthorized("wrong email or password"));
          } else {
            req.logIn(user, function (err) {
              if (err) {
                return next(err);
              }
              res.cookie("user", { user }, userCookieConfig);
              return res.status(200).json({
                user: user,
                message: "login successful"
              });
            });
          }
        })
        .catch(() => {
          return next(
            ApiError.tooManyRequests(
              "too many login failed attempts for this ip adress"
            )
          );
        });
    })(req, res, next);
  }
};

const logout = (req, res, next) => {
  req.logout();
  res.status(200).json({
    message: "logged out"
  });
};

module.exports = {
  register,
  login,
  logout,
  validation
};
