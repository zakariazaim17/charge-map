const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConnectionTypes = new Schema({
  FormalName: String,
  Title: String,
});

module.exports = mongoose.model("connectiontypes", ConnectionTypes);
