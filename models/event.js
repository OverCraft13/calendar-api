const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const eventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  details: String,
  color: {
    type: String,
    default: "#00949C"
  }
});

module.exports = mongoose.model("Event", eventSchema);
