const Food = require("../models/food");
const ApiError = require("../classes/ApiError");

const index = (req, res, next) => {
  let filter = {};
  let from = req.query.from || 0;
  from = Number(from) || 0;

  let limit = req.query.limit || 10;

  let name = req.query.name;
  const foodGroup = req.query.foodGroup;
  if (name) {
    name = name.trim();
    filter.name = new RegExp(name, "i");
  }
  if (foodGroup) {
    filter.foodGroup = foodGroup;
  }

  limit = Number(limit) || 10;
  if (limit > 20) {
    limit = 20;
  }
  Food.countDocuments(filter)
    .then((count) => {
      Food.find(
        filter,
        "_id name energy_kcal protein_g fat_g  carbohydrate_g  iron_mg"
      )
        .skip(from)
        .limit(limit)
        .exec((err, foods) => {
          if (err) {
            return next(ApiError.badRequest("bad request"));
          }
          return res.status(200).json({
            ok: true,
            foods,
            totalCount: count
          });
        });
    })
    .catch((error) => {
      return next(ApiError.internal("server error " + error));
    });
};

const show = (req, res, next) => {
  const id = req.params.id;
  const regex = new RegExp("^[0-9a-fA-F]+$");
  if (id && id.length === 24 && regex.test(id)) {
    Food.findById(id, (err, food) => {
      if (err) {
        return next(ApiError.notFound("the resource  doesnt exist"));
      }
      return res.status(200).json({
        ok: true,
        food
      });
    });
  } else {
    return next(ApiError.badRequest("bad request"));
  }
};

module.exports = {
  index,
  show
};
