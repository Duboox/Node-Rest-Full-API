const config = require('../app.config');
const base64Img = require('base64-img');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('api/aws_config.json');

exports.getExtension = function (file, name) {
    let extension = file.split('.').pop();
    let fileName = name + "." + extension;
    return fileName;
};


exports.decode64 = function (fileName, imagesCode64) {
    return new Promise(function (resolve, reject) {
        base64Img.img(imagesCode64, 'public/images', fileName, function (err, filePath) {
            if (filePath) {
                resolve((filePath));
            }
            else {
                reject(err);
            }
        });
    })
};

exports.uploadBucket = function (file, fileNameWithExtension) {
    return new Promise(function (resolve, reject) {
        let s3 = new AWS.S3();
        let params = {
            Bucket: 'chgs.tecnibilds.me/sns',
            Key: fileNameWithExtension,
            Body: file,
            ACL: 'public-read'
        };
        s3.putObject(params, function (error, file) {
            if (error) {
                reject(error);

            } else {
                resolve(file);

            }
        });
    })
};




