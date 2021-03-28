const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connections = require("./connections");

mongoose.set("useFindAndModify", false);
const stationsSchema = new Schema({
  Title: String,
  Town: String,
  AddressLine1: String,
  StateOrProvince: String,
  Postcode: String,
  Location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: true },
  },
  Connections: [{ type: mongoose.Types.ObjectId, ref: connections }],
});

stationsSchema.indexes({ Location: "2dsphere" });

module.exports = mongoose.model("stations", stationsSchema);
