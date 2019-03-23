"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  fName: {
    type: String,
    required: "requeride"
  },
  lName: {
    type: String,
    required: "requeride"
  },
  username: {
    type: String,
    required: "Kindly enter the name of the Username"
  },
  email: {
    type: String,
    // unique: true,
    // dropDups: true,
    required: "The email exitst!",
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String
    //required: "Kindly enter the password of the user"
  },
  phone: {
    type: String,
    required: "Kindly enter the password of the user"
  },
  rol: {
    type: String,
    enum: ["User", "Sponsor", "Organization"],
    required: "Kindly enter a rol of User",
    default: ["User"]
  },
  phoneVerify: {
    type: String
  },
  authKey: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordHash: {
    type: String
  },
  codeSmsActive: {
    type: String
  },
  birthday: {
    type: Date
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: "Kindly enter gender of the user"
  },
  img: {
    type: String
  },
  status: {
    type: String,
    default: "0"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
    //default: Date.now
  },
  usernotificationconfigs: {
    type: Array
  },
  activityCampaign: {
    type: Array
  },
  sponsor: {
    type: Array
  },
  points: {
    type: Array
  }
});

module.exports = mongoose.model("User", UserSchema);
