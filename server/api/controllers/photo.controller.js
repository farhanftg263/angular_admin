// Model
var UserPhoto =  require('../../models/UserPhoto');
var UserPrivatePhoto = require('../../models/UserPrivatePhoto');
// Packages
var validator = require('../middlewares/validation/UserPhoto');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');

var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var otpGenerator = require('otp-generator')
const md5 = require('md5');
var path = require("path");
var multer = require('multer');
var gm = require('gm');
var fs = require('fs');
var watermark = require('dynamic-watermark');
var Q = require('q');


// routes 
router.get('/private/:user/:page',dastboardPrivateList);  
router.post('/upload_photo', uploadPhoto);
module.exports = router;

/*
 Function Name : Upload Photo
 Author  : Farhan
 Created : 03-10-2018
 @param  : user ,photo,location,type[private,public] 
*/
function uploadPhoto(req, res)
{
    
    if (!req.fields.user && !req.fields.longitude) {
        return res.send({
            code: constant.ERROR,
            message: constant.REQUIRED_DATA,
            data : {}
        })
    }

    if(Object.keys(req.files).length == 0){
        return res.json({
            code: constant.ERROR,
            message: message.USER_PHOTO.USER_PHOTO_REQUIRED,
            data: {}
        });
    }
    const data = req.fields;
    const flag = validator.validate_all_request(data, [
        'user', 'locationType','latitude','longitude','city',
        'state','country','zipCode'
    ]);
    
    if (flag){
        return res.json(flag);
    }
   
    var extension = path.extname(req.files.photo.name);
    var file_name = new Date().getTime() + extension;
    var imageDir = path.join(__dirname, "../../", 'images/');
    var file = imageDir+file_name;

    var optionsTextWatermark = {
        type: "text",
        text: "PeerShot", // This is optional if you have provided text Watermark
        destination: imageDir+'watermark/'+file_name,
        source: file,
        position: 'right-bottom',
        textOption: {
            fontSize: 20, //In px default : 20
            color: '#e6e7e8' // Text color in hex default: #000000,
        }
    };
   
    fs.readFile( req.files.photo.path, function (err, data) {
            console.log(file);
            fs.writeFile(file, data, function (err) {
            if( err ){
                console.log( err );
            }else{

                let imageMagick = gm.subClass({imageMagick: true});
                imageMagick(file)
                .resize(250, 400)
                .write(imageDir+'thumb/'+file_name, (err) => {
                  if (err) {
                    console.log(err); 
                  } else {
                        //Water Mark
                        watermark.embed(optionsTextWatermark, function(status) {
                            //Do what you want to do here
                            console.log(status);
                        });
                  }
                })

                // Low Quality Image
                imageMagick(file)
                .quality(50)
                .write(imageDir+'low_quality/'+file_name, (err) => {
                  if (err) {
                    console.log(err); 
                  } else {
                        
                  }
                })

                // Save data 
                req.fields.photo = file_name;
                UserPhoto.create(req.fields, (err, userPhotoResult) => {
                    if (err) {
                        return res.send({
                            errr : err,
                            code: constant.ERROR,
                            message: constant.INTERNAL_SERVER_ERROR
                        })
                    }
                    else{

                        if(req.fields.locationType == constant.PHOTO_UPLOAD_PRIVATE)
                        {
                            //Save Private Photo for user
                            UserPrivatePhoto.create({userTo:'5bb5b61974567623b4b607ac',userPhotoId:userPhotoResult._id},(err,result) => {
                                if(err)
                                {
                                    return res.send({
                                        errr : err,
                                        code: constant.ERROR,
                                        message: constant.INTERNAL_SERVER_ERROR
                                    })
                                }
                                else{

                                }
                            })

                        }

                        return res.json({
                            code: constant.SUCCESS,
                            message: message.USER_PHOTO.USER_PHOTO_SAVED_SUCCESSFULLY,
                            data: {}
                        });
                    }
                })
            }
        });
    });
}

/*
 Function Name : Dashboard Private List
 Author  : Farhan
 Created : 03-10-2018
 @param  : user 
*/
function dastboardPrivateList(req,res,next)
{
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    UserPrivatePhoto.find({})
        .populate("userTo")
        .populate("userPhotoId")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            if(err)
            {
                next();
            }
            UserPrivatePhoto.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_SUMMARY_FOUND,
                    data: users,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}