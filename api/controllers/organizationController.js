"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../app.config");

let mongoose = require("mongoose"),
  Organization = mongoose.model("Organization");

exports.list = function(req, res) {
  Organization.find({}, function(err, organization) {
    if (err) res.send(err);
    console.log(organization);
    res.json({
      data: organization
    });
  });
};
