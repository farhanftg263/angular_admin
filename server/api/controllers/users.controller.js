var User = require('../../models/User');
var EmailTemp = require('../../models/EmailTemplate');
var validator = require('../middlewares/validation/User');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config.json');
var express = require('express');
var path = require("path");
var router = express.Router();

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

// routes 
router.post('/authenticate', authenticate);
router.get('/', summary);
router.post('/', register);
router.post('/forgetpassword',forgotpassword);

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
            });
            } else {
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
                                    var mailhtml = temp.html.replace('{content}',result.emailContent);
                                    mailhtml = mailhtml.replace('{userName}',userData.firstName +' '+userData.lastName);

                                    transporter.sendMail({
                                        from: constant.SMTP_FROM_EMAIL,
                                        to: 'nmg.farhan@gmail.com',
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
                        result: result
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
                                to: 'nmg.farhan@gmail.com',
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

            //success
            return res.send({
                code: constant.SUCCESS,
                message: message.USER.FORGOT_PASSWORD_SUCCESS,
                data: {}
            })
        }
    })
}