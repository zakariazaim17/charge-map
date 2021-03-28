const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LevelType = new Schema({
  Title: String,
  Comments: String,
  IsFastChargeCapable: Boolean,
});

module.exports = mongoose.model("levels", LevelType);
