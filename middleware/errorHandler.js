const ApiError = require("../classes/ApiError");

function apiErrorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  }

  res.status(500).json("something went wrong");
}

module.exports = apiErrorHandler;
