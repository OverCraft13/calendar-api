const mongoose = require("mongoose");

mongoose.connect(process.env.DB_STRING, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  keepAlive: true,
  useFindAndModify: false
});
const db = mongoose.connection;

module.exports = db;
