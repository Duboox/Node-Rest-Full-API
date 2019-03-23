"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../app.config");
let userController = require('../controllers/userController');

let mongoose = require("mongoose"),
  Campaign = mongoose.model("Campaign");

exports.list = function (req, res) {
  Campaign.find({}, function (err, campaign) {
    if (err) res.send(err);
    // console.log(campaign);
    res.json({
      data: campaign
    });
  });
};

exports.add = function (req, res) {
  Campaign.find(function (err, campaign) {
    if (err) res.send(err);
    // console.log(campaign);
    res.json({
      data: campaign
    });
  });
};



function getCampaings(req, res) {
  return new Promise(function (resolve, reject) {
    // Do async job
    Campaign.findOne({}, 'name', function (err, campaign) {
      if (err) {
        reject(err);
      } else {
        resolve((campaign));
      }
    });
  })
}

/*Ejemplo de multiples funciones */

exports.initial = async function (req, res) {
  try {
    let resultado = await getCampaings(req, res);
    let nuevoResultado = await userController.test(resultado);
    // console.log(`Obtenido el resultado final1: ${resultado}`);
    // console.log(`Obtenido el resultado final2: ${nuevoResultado}`);
    res.json({
      data: resultado,
      user: nuevoResultado
    });
  } catch (error) {
    falloCallback(error);
  }

};

exports.findOne = function (req, res) {
  let id = req.params.campaignId
  Campaign.findById(req.params.campaignId)
    .exec()
    .then(campaign => {
      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found"
        });
      }
      res.status(200).json({
        campaign: campaign,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        errors: err
      });
    });
};

