const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const levels = require("./levels");
const connectiontypes = require("./connectiontypes");
const currenttypes = require("./currenttypes");

const ConnectionsSchema = new Schema({
  Quantity: Number,
  ConnectionTypeID: [{ type: mongoose.Types.ObjectId, ref: connectiontypes }],
  CurrentTypeID: [{ type: mongoose.Types.ObjectId, ref: currenttypes }],
  LevelID: [{ type: mongoose.Types.ObjectId, ref: levels }],
});

module.exports = mongoose.model("connections", ConnectionsSchema);
