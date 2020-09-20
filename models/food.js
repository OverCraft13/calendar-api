const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const foodSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    default: ""
  },
  foodGroup: {
    type: String,
    enum: ["fruits and fruit products", "vegetables and vegetable products"],
    required: true
  },
  energy_kj: Number,
  energy_kcal: Number,
  water_g: Number,
  protein_g: Number,
  fat_g: Number,
  carbohydrate_g: Number,
  fiber_g: Number,
  ash_g: Number,
  saturated_fat_g: Number,
  monounsaturated_fat_g: Number,
  polyunsaturated_fat_g: Number,
  cholesterol_mg: Number,
  sodium_mg: Number,
  potassium_mg: Number,
  calcium_mg: Number,
  phosphorus_mg: Number,
  iron_mg: Number,
  zinc_mg: Number,
  thiamine_mg: Number,
  riboflavin_mg: Number,
  niacin_mg: Number,
  vitamin_c_mg: Number
});

module.exports = mongoose.model("Food", foodSchema);
