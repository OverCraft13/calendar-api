const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  last_name: {
    type: String
  },
  phone: String,
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email  must be unique"]
  },
  password: {
    type: String,
    required: true
  },
  verifiedEmail: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
