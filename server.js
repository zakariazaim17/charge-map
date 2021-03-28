"use strict";
require("dotenv").config();

const express = require("express");
const app = express();

const port = 3001;
const db = require("./db");

app.use(express.urlencoded({ extended: false })); // for parsing html form x-www-form-urlencoded
app.use(express.json());

app.use("/chargemap", require("./routes"));

db.on("connected", () => {
  app.listen(3001, () => {
    console.log(`example works fine!`);
  });
});
