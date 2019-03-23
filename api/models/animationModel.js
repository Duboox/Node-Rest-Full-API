"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AnimationSchema = new Schema({
  name: {
    type: String,
    required: "required"
  },
  idCampaign: {
    type: String,
    required: "required"
  },
  format: {
    type: String,
    required: "required"
  },
  recourse: {
    type: String,
    required: "required"
  },
  duration: {
    type: String,
    required: "required"
  },
  type: {
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
    type: [
      {
        type: String,
        enum: [0, 1]
      }
    ],
    default: [0]
  }
});

module.exports = mongoose.model("Animation", AnimationSchema);
