// Model
var User = require('../../models/User');
var EmailTemp = require('../../models/EmailTemplate');

// Packages
var validator = require('../middlewares/validation/User');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config.json');
var express = require('express');
var path = require("path");
var router = express.Router();
var otpGenerator = require('otp-generator')
const md5 = require('md5')


// routes 
router.post('/authenticate', authenticate);
router.get('/', summary);
router.get('/verifyAccount',verifyAccount)
router.post('/', register);
router.post('/forgetpassword',forgotpassword);
router.post('/verifyOTP',verifyOTP);
router.post('/expireOTP',expireOTP);
router.post('/resetPassword',resetPassword);


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
            message: constant.REQUIRED_DATA,
            data : {}
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
            message: constant.INTERNAL_SERVER_ERROR,
            data : {}
          })
        } else {
          if (!result) {
                res.json({
                    code: constant.ERROR ,
                    message: message.USER.EMAIL_NOT_FOUND,
                    data : {}
                });
            }
            else if(!result.userStatus)
            {
                res.json({
                    code: constant.ERROR ,
                    message: message.USER.USER_INACTIVE_ACCOUNT,
                    data : {}
                });
            }else {
                result.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.USER.LOGIN_SUCCESSFULLY,
                            data: {
                                _id: result._id,
                                email: result.email,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                token: "Bearer "+jwt.sign({ sub: result._id }, config.secret, { expiresIn: '24h' })
                            }
                        });
                    } else {
                        return res.json({
                            code: constant.ERROR,
                            message: message.USER.INVALID_USER_PASSWORD,
                            data : {}
                        });
                    }
                });
            } 
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
                    data: users,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

/*
 Function Name : User register
 Author  : Farhan
 Created : 11-03-2018
*/

function register(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.password) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, [
        'email', 'password', 'username',
        'dob','country','zipCode'
    ]);
    if (flag) {
        return res.json(flag);
    }
    User.findOne({ email: req.body.email }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.USER.EMAIL_AREADY_EXIST,
                data : {}
            })
        } else {
            let unix_time = moment().unix()
            let salt = req.body.firstName + unix_time
            let accessToken = md5(salt);
            req.body.accessToken = accessToken;
            req.body.userType = 0;
            User.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    delete result.password
                     // Email Template
                    const userData = result;
                    EmailTemp.findOne({emailTitle : 'App Registration'},(err,result) => {
                        if(err)
                        {
                            res.send({
                                code : constant.ERROR,
                                message : constant.INTERNAL_SERVER_ERROR,
                                data : {}
                            });
                        }
                        else if(!result)
                        {
                            res.json({
                                code : constant.ERROR,
                                message : message.USER.EMAIL_TEMPLATE_NOT_FOUND,
                                data : {}
                            });
                        }
                        else{
                        
                            let transporter = nodemailer.createTransport({
                                host: constant.SMTP_HOST,
                                port: constant.SMTP_PORT,
                                secure: true, // true for 465, false for other ports
                                auth: {
                                    user: constant.SMTP_USERNAME, // generated ethereal user
                                    pass: constant.SMTP_PASSWORD // generated ethereal password
                                }
                            });
                            
                            //create the path of email template folder 
                            var templateDir = path.join(__dirname, "../../", 'templates', 'appTemplate')
                            var testMailTemplate = new EmailTemplate(templateDir)
                            var locals = {
                                userName: userData.firstName +' '+userData.lastName,
                                content : ''
                            };
                            testMailTemplate.render(locals, function (err, temp) {
                                if (err) {
                                    console.log("error", err);
                                }else {
                                    //accessToken
                                    let link = 'http://localhost:4000/api/users/verifyAccount?email='+userData.email+'&accessToken='+accessToken;
                                    var mailhtml = temp.html.replace('{content}',result.emailContent);
                                    mailhtml = mailhtml.replace('{userName}',userData.firstName +' '+userData.lastName);
                                    mailhtml = mailhtml.replace('{LINK}',link);

                                    transporter.sendMail({
                                        from: constant.SMTP_FROM_EMAIL,
                                        to: userData.email,
                                        subject: result.emailSubject,
                                        text: "Hello world",
                                        html: mailhtml
                                    },function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        }
                                        console.log('Message sent: ' + info.response);
                                    })
                                }
                            })
                        }          
                    })

                    return res.send({
                        code: constant.SUCCESS,
                        message: message.USER.USER_REGISTER_SUCCESS,
                        data: result
                    })
                }
            })
        }
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
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email']);
    if (flag) {
        return res.json(flag);
    }

    User.findOne({email: req.body.email},(err,result) => {
        if(err)
        {
            res.send({
                code : constant.ERROR,
                message : constant.INTERNAL_SERVER_ERROR,
                data : {}
            });
        }
        else if(!result)
        {
            res.json({
                code : constant.ERROR,
                message : message.USER.EMAIL_NOT_FOUND,
                data : {}

            });
        }
        else if (!result.userStatus)
        {
            res.json({
                code : constant.ERROR,
                message : message.USER.USER_INACTIVE_ACCOUNT,
                data : {}
            });
        }
        else{
            // Email Template
            const userData = result;
            EmailTemp.findOne({emailTitle : 'App Forget Password'},(err,result) => {
                if(err)
                {
                    res.send({
                        code : constant.ERROR,
                        message : constant.INTERNAL_SERVER_ERROR,
                        data : {}
                    });
                }
                else if(!result)
                {
                    res.json({
                        code : constant.ERROR,
                        message : message.USER.EMAIL_TEMPLATE_NOT_FOUND,
                        data : {}
                    });
                }
                else{
                    var motp = otpGenerator.generate(4,{ upperCase: false, specialChars: false, digits:true, alphabets:false });

                    let transporter = nodemailer.createTransport({
                        host: constant.SMTP_HOST,
                        port: constant.SMTP_PORT,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: constant.SMTP_USERNAME, // generated ethereal user
                            pass: constant.SMTP_PASSWORD // generated ethereal password
                        }
                    });
                    
                    //create the path of email template folder 
                    var templateDir = path.join(__dirname, "../../", 'templates', 'appTemplate')
                    var testMailTemplate = new EmailTemplate(templateDir)
                    var locals = {
                        userName: userData.firstName +' '+userData.lastName,
                        content : ''
                    };
                    testMailTemplate.render(locals, function (err, temp) {
                        if (err) {
                            console.log("error", err);
                        }else {
                            var mailhtml = temp.html.replace('{content}',result.emailContent);
                            mailhtml = mailhtml.replace('{userName}',userData.firstName +' '+userData.lastName);
                            mailhtml = mailhtml.replace('{OTP}',motp);

                            transporter.sendMail({
                                from: constant.SMTP_FROM_EMAIL,
                                to: req.body.email,
                                subject: result.emailSubject,
                                text: "Hello world",
                                html: mailhtml
                            },function (error, info) {
                                if (error) {
                                    console.log(error);
                                }

                                // Update User OTP accessToken
                                User.findOneAndUpdate({ email:req.body.email }, {accessToken:motp}, { new:true },(err,result) => {
                                    if(err){
                                        return res.send({
                                            code: constant.ERROR,
                                            message: constant.INTERNAL_SERVER_ERROR,
                                            data :{}
                                        });
                                    }else {
                                        if (!result) 
                                        {
                                            res.json({
                                                code: constant.ERROR,
                                                message: message.USER.USER_NOT_FOUND
                                            });
                                        }
                                    }
                                })

                                console.log('Message sent: ' + info.response);
                            })
                        }
                    })
                }          
            })

            //success
            return res.send({
                code: constant.SUCCESS,
                message: message.USER.FORGOT_PASSWORD_SUCCESS,
                data: {}
            })
        }
    })
}
/*
    Function Name : Verify OTP
    Author : Farhan
    Created : 01-10-2018
    Type : Verify otp for forget password email request
*/
function verifyOTP(req, res)
{
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email','OTP']);
    if (flag) {
        return res.json(flag);
    }

    User.findOne({email:req.body.email , accessToken: req.body.OTP},(err,result) => {
        if(err)
        {
            res.send({
                code : constant.ERROR,
                message : constant.INTERNAL_SERVER_ERROR,
                data : {}
            });
        }
        else{
            if(!result)
            {
                res.json({
                    code : constant.ERROR,
                    message : message.USER.OTP_NOT_VERIFIED,
                    data : {}
                });
            }
            else{
                return res.json({
                    code : constant.SUCCESS,
                    message : message.USER.OTP_VERIFIED_SUCCESS,
                    data : {}
                });
            }
        }
    })
}
/*
    Function Name : Expire OTP
    Author : Farhan
    Created : 01-10-2018
    Type : expire otp for forget password email request
*/
function expireOTP(req, res)
{
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email']);
    if (flag) {
        return res.json(flag);
    }

    User.findOneAndUpdate({ email:req.body.email }, {accessToken:''}, { new:true },(err,result) => {
        if(err){
            return res.send({
                code: constant.ERROR,
                message: constant.INTERNAL_SERVER_ERROR,
                data : {}
            });
        }else {
            if (!result) 
            {
                res.json({
                    code: constant.ERROR,
                    message: message.USER.EMAIL_NOT_FOUND,
                    data : {}
                });
            }
            else{
                return res.json({
                    code : constant.SUCCESS,
                    message:message.USER.OTP_EXPIRED_SUCCESS,
                    data : {}
                });
            }
        }
    })
}
/*
    Function Name : Reset Password
    Author  : Farhan
    Created : 01-10-2018
    Modified By : Farhan
    Type: Public function for reset password
*/

function resetPassword(req , res)
{
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email','OTP','password']);
    if (flag) {
        return res.json(flag);
    }

    otp = req.body.OTP;
    email = req.body.email;

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(req.body.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            
            User.findOneAndUpdate({email:email, accessToken:otp }, {password:hash}, { new:true },(err,result) => {
                if(err){
                    return res.send({
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR,
                        data: {}
                    });
                }else {
                    if (!result) 
                    {
                        res.json({
                            code: constant.ERROR,
                            message: message.USER.OTP_EXPIRED_SUCCESS,
                            data: {}
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.USER.RESET_PASSWORD_SUCCESS,
                            data: result
                        });
                    }
                }
            })
        });
    });

}
/*
    Function Name : Verify account for registered user
    Author  : Farhan
    Created : 01-10-2018
    Modified By : Farhan
    Type: Public function for registered user
*/
function verifyAccount(req,res)
{

    if(Object.keys(req.query).length == 0)
    {
        res.status(400).send('Parameter is required');
    }
    else if(Object.keys(req.query.email).length == 0 && Object.keys(req.query.accessToken).length == 0)
    {
        res.status(400).send('Parameter emai,accessToken is required');
    }
    else{
        let email = req.query.email;
        let accessToken = req.query.accessToken;

        User.findOneAndUpdate({ email:email,accessToken:accessToken }, {userStatus:1,accessToken:''}, { new:true },(err,result) => {
            if(err){
                res.status(400).send(constant.INTERNAL_SERVER_ERROR);
            }else {
                if (!result) 
                {
                    res.status(200).send(message.USER.OTP_EXPIRED_SUCCESS);
                }
                else{
                    userData = result;
                    // Email Template
                    EmailTemp.findOne({emailTitle : 'App Activation Account'},(err,result) => {
                        if(err)
                        {
                            res.status(400).send(constant.INTERNAL_SERVER_ERROR);
                        }
                        else if(!result)
                        {
                            res.status(200).json(message.USER.EMAIL_TEMPLATE_NOT_FOUND);
                        }
                        else{
                            let transporter = nodemailer.createTransport({
                                host: constant.SMTP_HOST,
                                port: constant.SMTP_PORT,
                                secure: true, // true for 465, false for other ports
                                auth: {
                                    user: constant.SMTP_USERNAME, // generated ethereal user
                                    pass: constant.SMTP_PASSWORD // generated ethereal password
                                }
                            });
                            
                            //create the path of email template folder 
                            var templateDir = path.join(__dirname, "../../", 'templates', 'appTemplate')
                            var testMailTemplate = new EmailTemplate(templateDir)
                            var locals = {
                                userName: userData.firstName +' '+userData.lastName,
                                content : ''
                            };
                            testMailTemplate.render(locals, function (err, temp) {
                                if (err) {
                                    console.log("error", err);
                                }else {
                                    var mailhtml = temp.html.replace('{content}',result.emailContent);
                                    mailhtml = mailhtml.replace('{userName}',userData.firstName +' '+userData.lastName);

                                    transporter.sendMail({
                                        from: constant.SMTP_FROM_EMAIL,
                                        to: email,
                                        subject: result.emailSubject,
                                        text: "Hello world",
                                        html: mailhtml
                                    },function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        }

                                        res.status(200).send(message.USER.ACCOUNT_ACTIVATION_SUCCESS);
                                        console.log('Message sent: ' + info.response);
                                    })
                                }
                            })
                        }          
                    })
                    
                }
            }
        })
    }
    
}