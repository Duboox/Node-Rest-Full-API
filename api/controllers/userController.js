'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../app.config');
const base64Img = require('base64-img');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('api/aws_config.json');
const aux = require('../controllers/globalController');
//sns sms
const sns = new AWS.SNS();
let campaign = require('../controllers/campaignController');


let mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.singUP = function (req, res) {
    // si el usuario existe devuelveme 
    console.log(req.body);
    User.findOne({ email: req.body.email }).exec()
        .then(user => {

            if (user) {
                return res.status(409).json({
                    errors: { message: "Email exist!!" },
                })
            }
            // si no existe
            else {
                let new_user = new User(req.body);
                new_user.validate(function (err) {
                    if (err) {
                        res.status(500).json({
                            err
                        });
                    }
                });
                //Encriptando el password con el email de usuario
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }
                    // Si no algun error encriptando entonces :D
                    else {
                        new_user.password = hash;
                        new_user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created',
                                    newUser: new_user
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: err
                                });
                            })
                    }
                })
            }
        })
        // Problems 
        .catch(err => {
            res.status(500).json({
                errors: err
            });
        });

};


exports.login = function (req, res) {

    User.find({$or:[{email: req.body.email},{phone: req.body.phone}]}).exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(409).json({
                    message: "Mail or Phone not found!, user does\'t exist",
                });
            }
            if (req.body.email) {
                bcrypt.compare(req.body.password, user[0].password)
                .then(function (result) {
                    if (result) {
                        let expDateToken = Math.floor(Date.now() / 1000) + (60 * 60);
                        // let dateNow = Date.now();
                        // let dateToken = new Date(dateNow + config.tokens.expiration) //express date in datetime
                        // let expDateToken = dateToken.getTime(); // express date in timestamp
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        }, config.tokens.secretKey,
                            { expiresIn: expDateToken }
                        );
                        res.status(201).json({
                            message: 'Auth Successful',
                            token: {
                               access_token: token,
                                expires_in: expDateToken,
                                token_type: 'Bearer'
                            },
                            user: user[0]
                            
                        });
                    }
                    else {
                        res.status(201).json({
                            message: 'Auth failed'
                        });
                    }

                })
                .catch(err => {
                    res.status(500).json({
                        errors: err
                    });
                });
            } else if (req.body.phone && req.body.phoneVerify) {
                bcrypt.compare(req.body.phoneVerify, user[0].phoneVerify)
                .then(function (result) {
                    if (result) {
                        let expDateToken = Math.floor(Date.now() / 1000) + (60 * 60);
                        // let dateNow = Date.now();
                        // let dateToken = new Date(dateNow + config.tokens.expiration) //express date in datetime
                        // let expDateToken = dateToken.getTime(); // express date in timestamp
                        
                        //console.log(test.toString());  show date in string for testing
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        }, config.tokens.secretKey,
                            { expiresIn: expDateToken }
                        );
                        let loggedUser = user[0];
                        loggedUser.password = undefined;
                        loggedUser.phoneVerify = undefined;
                        res.status(201).json({
                            message: 'Auth Successful',
                            token: {
                                access_token: token,
                                expires_in: expDateToken,
                                token_type: 'Bearer'
                            }
                        });
                    }
                    else {
                        res.status(201).json({
                            message: 'Auth failed, bad verification code.'
                        });
                    }

                })
                .catch(err => {
                    res.status(500).json({
                        errors: err
                    });
                });
            } else if (req.body.phone) {
                //generate verification code
                let phoneCode = Math.floor((Math.random() * 9999) + 1111).toString();
                // encrypt phone verification code
                bcrypt.hash(phoneCode, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'error on hashing code.',
                            error: err.message
                        });
                    } else {
                        //save verification code
                        User.findById(user[0]._id, function (err, user) {
                            if (err) return handleError(err);
                            user.set({ phoneVerify: hash });
                            user.save(function (err, updatedUser) {
                                if (err) return handleError(err);
                                //send verification code

                                let smsParams = {
                                    Message: 'tecnibilds security code: ' + phoneCode + ' Track all your IMPACT-CHALLENGES/LIKES/REWARDS. Txt STOP to OptOut forever; Msg and data rates may apply.',
                                    MessageStructure: 'string',
                                    PhoneNumber: user.phone
                                  };
                                  sns.publish(smsParams, function(err, data) {
                                    if (err) {
                                        res.status(400).json({
                                            message: 'Error sending sms verification code.',
                                            error: err,
                                            errStack: err.stack
                                        });
                                    } else {
                                        res.status(200).json({
                                            message: 'Sms Code for login sended successfully.',
                                            testCode: phoneCode,
                                            data: data
                                        });
                                    }
                                  });
                                // res.status(200).json({
                                //               message: 'Sms Code for login sended successfully.',
                                //                 testCode: phoneCode,
                                //             });
                              });
                        })
                    }
                });
            } else {
                res.status(400).json({
                    message: 'Bad request.'
                });
            }

        })
        // Problems 
        .catch(err => {
            res.status(500).json({
                errors: err
            });
        });

};

exports.getUser = function (req, res) {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization.split(' ')[1], config.tokens.secretKey);
        } catch (e) {
            return res.status(401).send('Unauthorized.');
        }
        
        var userId = decoded.userId;
        // Fetch the user by id 
        User.findOne({_id: userId}).then(function(user){
            user.password = undefined;
            user.phoneVerify = undefined;
            res.status(200).json({
                message: 'Auth guaranteed.',
                user: user,
            });
        })
        .catch(err => {
            res.status(400).json({
                message: 'error finding user data.',
                error: err
            });
        });
    } else {
        res.status(400).json({
            message: 'Bad request.',
        });
    }
    
};


exports.list_all = function (req, res) {
    User.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.challenges = async function (req, res) {
    try {
        let fileName = Date.now().toString();
        let filepath = await aux.decode64(fileName, req.body.image);
        let file = fs.readFileSync(filepath);
        let fileNameWithExtension = await aux.getExtension(filepath, fileName)

        let uploading = await aux.uploadBucket(file, fileNameWithExtension);

        console.log(uploading);
        res.status(200).json({
            data: uploading,
            message: 'Upload Complete'
        });

    } catch (error) {
        if (Object.keys(error).length == 0) {
            error = {};
            error.message = "Problems with decoding 64";
        }
        res.status(501).json({
            error
        });
    }
};

