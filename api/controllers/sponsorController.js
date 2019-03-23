"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../app.config");

let mongoose = require("mongoose"),
  User = mongoose.model("User");

exports.list = function(req, res) {
  var projection = {};
  User.find({ sponsor: { $exists: true, $ne: [] } }, projection, function(
    err,
    sponsor
  ) {
    if (err) res.send(err);
    res.json({ sponsors: sponsor });
  });
};
