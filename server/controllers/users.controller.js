var User = require('../models/User')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/forgotpassword',forgotpassword);
router.put('/reset/:_otp',resetPassword);
router.get('/', summary);
router.get('/:_id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

/*
 Function Name : Login Check
 Author  : Farhan
 Created : 11-03-2018
 @param  : email , password 
*/
function authenticate(req, res)
{
    if (!req.body.email && !req.body.password) {
        return res.send({
            code: constant.ERROR,
            message: constant.REQUIRED_DATA
        })
    }

    const data = req.body;
    const flag = validator.validate_all_request(data, ['email', 'password']);
    
    if (flag){
        return res.json(flag);
    }

    User.findOne({ email: req.body.email}, (err, result) => {
        if (err) {
          return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
          })
        } else {
          if (!result) {
            res.json({
                code: constant.ERROR ,
                message: message.USER.EMAIL_NOT_FOUND,
            });
            } else {
                result.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.USER.LOGIN_SUCCESSFULLY,
                            result: {
                                _id: result._id,
                                email: result.email,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                token: jwt.sign({ sub: result._id }, config.secret)
                            }
                        });
                    } else {
                        return res.json({
                            code: constant.ERROR,
                            message: message.USER.INVALID_USER_PASSWORD,
                        });
                    }
                });
            } 
        }
    
    })

}
/*
 Function Name : User register
 Author  : Farhan
 Created : 11-03-2018
*/

function register(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.firstName && !req.body.middleName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.userType) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email', 'password', 'userType']);
    if (flag) {
        return res.json(flag);
    }
    User.findOne({ email: req.body.email }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.USER.EMAIL_AREADY_EXIST
            })
        } else {
            User.create(req.body, (err, result) => {
                if (err) {
                return res.send({
                    errr : err,
                    code: constant.ERROR,
                    message: constant.INTERNAL_SERVER_ERROR
                })
                } else {
                    delete result.password
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: constant.SMTP_HOST,
                        port: constant.SMTP_PORT,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: constant.SMTP_USERNAME, // generated ethereal user
                            pass: constant.SMTP_PASSWORD // generated ethereal password
                        }
                    });
                    host=req.get('host');
                    link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: constant.SMTP_FROM_EMAIL, // sender address
                        to: 'farhan.hashmi@@newmediaguru.net', // list of receivers
                        subject: 'Please confirm your Email account ✔', // Subject line
                        text: 'Hello world?', // plain text body
                        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                    };

                    // send mail with defined transport object
                    /*transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });*/

                    return res.send({
                        code: constant.SUCCESS,
                        message: message.USER.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}
/*
 Function Name : User Summary
 Author  : Farhan
 Created : 11-03-2018
*/
function summary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    User.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_SUMMARY_FOUND,
                    result: users,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}
/*
 Function Name : Get user by _id
 Author  : Farhan
 Created : 11-03-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.USER.ID_PARAMETER_REQUIRED
        });
    }
	User.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.USER.USER_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_FOUND,
                    result: result
                });

            }
        }
    })
}
/*
    Function Name : Get user by _id
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for update user
*/
function update(req, res) {

    User.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
        if(err){
            return res.send({
                code: constant.ERROR,
                message: constant.INTERNAL_SERVER_ERROR
            });
        }else {
            if (!result) 
            {
                res.json({
                    code: constant.ERROR,
                    message: message.USER.USER_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_FOUND,
                    result: result
                });
        
            }
        }
    })
}
/*
    Function Name : delete user
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for delete user
*/
function _delete(req, res) {

    User.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.USER.USER_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.USER.USER_DELETED_SUCCESS,
            result: result
        });
    })
}
/*
    Function Name : forgot password
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for forgot password
*/
function forgotpassword(req, res)
{
    User.findOne({email: req.body.email},(err,result) => {
        if(err)
        {
            res.send({
                code : constant.ERROR,
                message : constant.INTERNAL_SERVER_ERROR
            });
        }
        else if(!result)
        {
            res.json({
                code : constant.ERROR,
                message : message.USER.EMAIL_NOT_FOUND
            });
        }
        else{
            // send mail to user
            let transporter = nodemailer.createTransport({
                host: constant.SMTP_HOST,
                port: constant.SMTP_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: constant.SMTP_USERNAME, // generated ethereal user
                    pass: constant.SMTP_PASSWORD // generated ethereal password
                }
            });
            host=req.get('host');
            link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
            // setup email data with unicode symbols
            let mailOptions = {
                from: constant.SMTP_FROM_EMAIL, // sender address
                to: 'farhan.hashmi@@newmediaguru.net', // list of receivers
                subject: 'Please confirm your Email account ✔', // Subject line
                text: 'Hello world?', // plain text body
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
            };

            // send mail with defined transport object
            /*transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });*/

            return res.send({
                code: constant.SUCCESS,
                message: message.USER.FORGOT_PASSWORD_SUCCESS,
                result: result
            })
        }
    })
}
/*
    Function Name : reset password
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for forgot password
*/
function resetPassword()
{

}