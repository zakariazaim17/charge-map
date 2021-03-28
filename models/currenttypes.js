const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CurrentTypes = new Schema({
  Title: String,
  Description: String,
});

module.exports = mongoose.model("currenttypes", CurrentTypes);
