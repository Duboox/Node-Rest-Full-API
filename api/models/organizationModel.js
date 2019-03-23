"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
  name: {
    type: String,
    required: "required"
  },
  website: {
    type: String,
    required: "required"
  },
  email: {
    type: String,
    //unique: true,
    dropDups: true,
    required: "The email exitst!",
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  description: {
    type: String,
    required: "required"
  },
  address: {
    type: String,
    required: "required"
  },
  img: {
    type: String,
    required: "required"
  },
  color: {
    type: String,
    required: "required"
  },
  createAt: {
    type: String,
    required: "required"
  },
  createAt: {
    type: Date,
    required: "required"
  },
  updateAt: {
    type: Date,
    required: "required"
  },
  // paymentmethods: [paymentmethods],
  // animations: [animations],
  status: {
    type: {
      type: String,
      default: 1
    }
  }
});

const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
