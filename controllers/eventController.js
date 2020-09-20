const Event = require("../models/event");
const ApiError = require("../classes/ApiError");

const safeTextRegex = new RegExp("^[À-ÿ\\u00f1\\u00d1\\w \\s\\-\\']+$");

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function validDatesForEvent(start, end) {
  start = new Date(start);
  end = new Date(end);
  if (isValidDate(start) && isValidDate(end)) {
    if (end >= start) {
      return true;
    }
  }
  return false;
}

function isValidName(name) {
  if (safeTextRegex.test(name) && name.length > 0 && name.length <= 30) {
    return true;
  }
  return false;
}

const storeValidation = (req, res, next) => {
  if (req.body.name && req.body.start && req.body.end) {
    req.body.name.trim();
    if (isValidName(req.body.name)) {
      if (validDatesForEvent(req.body.start, req.body.end)) {
        if (!req.body.details) {
          return next();
        } else if (
          req.body.details &&
          safeTextRegex.test(req.body.details) &&
          req.body.details.length <= 200
        ) {
          return next();
        }
      }
    }
  }
  return next(ApiError.badRequest("bad request"));
};

const updateValidation = (req, res, next) => {
  req.updatedEvent = {};
  if (req.body.name) {
    if (isValidName(req.body.name)) {
      req.updatedEvent.name = req.body.name;
    }
  }
  if (req.body.start && req.body.end) {
    if (validDatesForEvent(req.body.start, req.body.end)) {
      req.updatedEvent.start = req.body.start;
      req.updatedEvent.end = req.body.end;
    }
  }
  if (req.body.details) {
    if (
      safeTextRegex.test(req.body.details) &&
      req.body.details.length <= 200
    ) {
      req.updatedEvent.details = req.body.name;
    }
  }
  next();
};

const index = (req, res, next) => {
  const userId = req.user._id;
  const fromDate = new Date(req.query.from);
  const untilDate = new Date(req.query.until);
  if (isValidDate(fromDate) && isValidDate(untilDate)) {
    Event.find(
      {
        user_id: userId,
        start: { $gte: fromDate },
        end: { $lte: untilDate }
      },
      "_id name start end details color",
      (err, events) => {
        if (err) {
          return next(ApiError.internal());
        } else if (!events) {
          return next(ApiError.notFound());
        } else {
          return res.status(200).json({
            events
          });
        }
      }
    );
  } else {
    return next(ApiError.badRequest("bad request"));
  }
};

const store = (req, res, next) => {
  const event = new Event({
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
    user_id: req.user._id,
    color: req.body.color,
    details: req.body.details
  });
  event.save((err, insertedEvent) => {
    if (err) {
      return next(ApiError.internal("internal server error"));
    }
    {
      return res.status(201).json({
        event: insertedEvent
      });
    }
  });
};

const update = (req, res, next) => {
  const id = req.params.id;
  const regex = new RegExp("^[0-9a-fA-F]+$");
  if (id && id.length === 24 && regex.test(id)) {
    Event.findById(id, (err, event) => {
      if (err) {
        return next(ApiError.internal("internal server error"));
      }
      if (event) {
        if (event.user_id.toString() === req.user._id.toString()) {
          Event.findByIdAndUpdate(id, req.updatedEvent, (err) => {
            if (err) {
              return next(ApiError.internal("internal server error"));
            }
            return res.status(200).json();
          });
        } else {
          return next(ApiError.forbidden("forbidden resource"));
        }
      } else {
        return next(ApiError.notFound("the event does not exist"));
      }
    });
  } else {
    return next(ApiError.badRequest("bad request"));
  }
};

const deleteEvent = (req, res, next) => {
  const id = req.params.id;
  const regex = new RegExp("^[0-9a-fA-F]+$");
  if (id && id.length === 24 && regex.test(id)) {
    Event.findById(id, (err, event) => {
      if (err) {
        return next(ApiError.internal("internal server error"));
      }
      if (event) {
        if (event.user_id.toString() === req.user._id.toString()) {
          Event.findByIdAndRemove(id, (err) => {
            if (err) {
              return next(ApiError.internal("internal server error"));
            }
            return res.status(200).json();
          });
        } else {
          return next(ApiError.forbidden("forbidden resource"));
        }
      } else {
        return next(ApiError.notFound("the event does not exist"));
      }
    });
  } else {
    return next(ApiError.badRequest());
  }
};

module.exports = {
  index,
  store,
  update,
  storeValidation,
  deleteEvent,
  updateValidation
};
