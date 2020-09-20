const ApiError = require("../classes/ApiError");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(ApiError.unauthorized("unauthorized"));
  }
};

module.exports = {
  isAuthenticated
};
