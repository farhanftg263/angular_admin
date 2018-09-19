var User = require('../models/User')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('config.json');
var express = require('express');
var path = require("path");
var router = express.Router();

// routes
router.post('/authenticate', authenticate);
router.post('/', register);
router.post('/forgetpassword',forgotpassword);
router.post('/verifypassword',verifyPassword);
router.put('/resetpassword/:_otp',resetPassword);
router.get('/:page', summary);
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
    if (!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.userType) {
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
    console.log("page "+req.params.page);
    User.find({})
        .populate('userType')
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
            var smtpTransport = require('nodemailer-smtp-transport');
            let transporter = nodemailer.createTransport({
                host: constant.SMTP_HOST,
                port: constant.SMTP_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: constant.SMTP_USERNAME, // generated ethereal user
                    pass: constant.SMTP_PASSWORD // generated ethereal password
                }
            });

            //create the path of email template folder 
            var templateDir = path.join(__dirname, "../", 'templates', 'testMailTemplate')
            console.log(templateDir)
            var testMailTemplate = new EmailTemplate(templateDir)
            var locals = {
                userName: "XYZ" //dynamic data for bind into the template
            };

            testMailTemplate.render(locals, function (err, temp) {
                if (err) {
                    console.log("error", err);
                }else {
                    transporter.sendMail({
                        from: constant.SMTP_FROM_EMAIL,
                        to: 'nmg.farhan@gmail.com',
                        subject: "test mail",
                        text: "Hello world",
                        html: temp.html
                    },function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    })
                }
            })
            /*host=req.get('host');
            link="http://"+req.get('host')+"/user/verifyEmail/"+result._id;
            // setup email data with unicode symbols
            var dear_var = 'Dear '+result.firstName+' '+result.lastName;
            var ask_ques = 'Feel free to ask any query if you have @: contact@peershots.com';
            let mailOptions = {
                from: constant.SMTP_FROM_EMAIL, // sender address
                to: 'nmg.farhan@gmail.com', // list of receivers
                subject: 'Please confirm your Email account ✔', // Subject line
                text: 'Hello world?', // plain text body
                html : dear_var+",<br> Please click below link to reset the password.<br><a href="+link+">Click Here</a><br>"+ask_ques+"<br>Best Regards,<br>Peershots"
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
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
    Function Name : Verify Password
    Author : Farhan
    Created : 19-03-2018
    Type : Verify password for forget password email request
*/
function verifyPassword(req, res)
{
    User.findOne({email: req.body.email,accessToken: req.body.token},(err,result) => {
        if(err)
        {
            res.send({
                code : constant.ERROR,
                message : constant.INTERNAL_SERVER_ERROR
            });
        }
        else{
            if(!result)
            {
                res.json({
                    code : constant.ERROR,
                    message : message.USER.FORGOT_PASSWORD_TOKEN_NOT_VERIFY
                });
            }
            else{
                return res.json({
                    code : constant.SUCCESS,
                    message : message.USER.FORGOT_PASSWORD_TOKEN_VERIFIED,
                    result : result
                });
            }
        }
    })
}

/*
    Function Name : Reset Password
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for reset password
*/

function resetPassword(res , req)
{
    otp = res.params._otp;
    User.findOneAndUpdate({ accessToken:otp }, req.body, { new:true },(err,result) => {
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
