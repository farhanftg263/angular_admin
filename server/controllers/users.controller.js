var User = require('../models/User');
var Role = require('../models/Role');
var EmailTemp = require('../models/EmailTemplate');
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
//var bcrypt = require('bcryptjs');
var config = require('config.json');
var express = require('express');
var path = require("path");
var router = express.Router();
const md5 = require('md5');

// routes 
router.post('/authenticate', authenticate);
router.post('/', register);
router.post('/forgetpassword',forgotpassword);
router.post('/verifypassword',verifyPassword);
router.post('/resetpassword',resetPassword);
router.put('/status/:_id',status);
router.put('/change_password/:_id',change_password);

router.get('/:page/:sortfields/:ordering', summary);
router.get('/current/:_id', getCurrent);
router.get('/role/:_id', getUserByRoleId);

router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FileredUsersSummary);

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

    User.findOne({ email: req.body.email,emailVerified:1,userStatus:1}, (err, result) => {
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

                        Roledfdf.findOne({ _id: result.userType[0]}, (errRole, resultRole) => {
                            if (errRole) {
                                return res.send({
                                  code: constant.ERROR,
                                  message: constant.INTERNAL_SERVER_ERROR
                                })
                            } else {
                                if (!resultRole) {
                                  res.json({
                                      code: constant.ERROR ,
                                      message: message.USER.EMAIL_NOT_FOUND,
                                  });
                                } else {                                    
                                    return res.json({
                                        code: constant.SUCCESS,
                                        message: message.USER.LOGIN_SUCCESSFULLY,
                                        result: {
                                            _id: result._id,
                                            email: result.email,
                                            firstName: result.firstName,
                                            lastName: result.lastName,
                                            privilege:resultRole.privilege,
                                            roleName:resultRole.roleName,
                                            roleId:resultRole._id,                                
                                            token: jwt.sign({ sub: result._id }, config.secret, { expiresIn: '24h' })
                                        }
                                    });
                                }
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
            let unix_time = moment().unix()
            let salt = req.body.firstName + unix_time
            let accessToken = md5(salt);
            req.body.accessToken = accessToken;

            User.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    delete result.password

                    const userData = result;
                    EmailTemp.findOne({emailTitle : 'Admin User Registration'},(err,result) => {
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
                            var templateDir = path.join(__dirname, "../", 'templates', 'adminTemplate')
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
                                    let link = constant.SITE_URL+'resetpassword?email='+userData.email+'&f=0&u=0&accessToken='+accessToken;
                                    var mailhtml = temp.html.replace('{content}',result.emailContent);
                                    mailhtml = mailhtml.replace('{userName}',userData.firstName +' '+userData.lastName);
                                    mailhtml = mailhtml.replace('{userEmail}',userData.email);                                    
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
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;
    
    if(ordering==0){
        ordering='-1';
    }
    sortObject[sortfields] = ordering;
    User.find({userType:{$not:{$size: 0}}})
        .populate('userType')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, users) {
            User.count({userType:{$not:{$size: 0}}}).exec(function(err, count) {
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
    console.log("server "+req.params);
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
 Function Name : Get user by role id
 Author  : Pradeep Chaurasia
 Created : 28-09-2018
*/
function getUserByRoleId(req, res) {
    console.log("server "+req.params);
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.USER.ID_PARAMETER_REQUIRED
        });
    }
	User.findOne({userType:id}, (err, result) => {
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
                    message: message.USER.USER_UPDATE_SUCCESS,
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
    Modified By : Pradeep Chaurasia
    Modified Date : 05-10-2018
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
            EmailTemp.findOne({emailTitle : 'Admin Forget Password'},(err,result) => {
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

                    let unix_time = moment().unix()
                    let salt = req.body.firstName + unix_time
                    let accessToken = md5(salt);

                   // var motp = otpGenerator.generate(4,{ upperCase: false, specialChars: false, digits:true, alphabets:false });

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
                        var templateDir = path.join(__dirname, "../", 'templates', 'adminTemplate')
                        var testMailTemplate = new EmailTemplate(templateDir)
                        var locals = {
                            userName: userData.firstName +' '+userData.lastName,
                            content : ''
                        };
                   
                    testMailTemplate.render(locals, function (err, temp) {
                        if (err) {
                            console.log("error", err);
                        }else {
                            let link = constant.SITE_URL+'resetpassword?email='+userData.email+'&f=1&u=0&accessToken='+accessToken;
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

                                // Update User OTP accessToken
                                User.findOneAndUpdate({ email:req.body.email }, {accessToken:accessToken}, { new:true },(err,result) => {
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
                if(req.body.utype>0){
                    return  res.json({
                        code : constant.APPUSER,
                        message : message.USER.ALREADY_ACCOUNT_ACTIVE
                    });
                }else{
                    return res.json({
                        code : constant.ERROR,
                        message : message.USER.FORGOT_PASSWORD_TOKEN_NOT_VERIFY
                    });
                }
                

            }else if(result.emailVerified>0 && req.body.forget<=0){
                if(req.body.utype>0){
                    return res.json({
                        code : constant.APPUSER,
                        message : message.USER.ALREADY_ACCOUNT_ACTIVE,
                        result : result
                    });
                }else{
                    return res.json({
                        code : constant.VERIFIED,
                        message : message.USER.FORGOT_PASSWORD_TOKEN_NOT_VERIFY,
                        result : result
                    }); 
                }
            }else if(result.emailVerified>0 && req.body.utype>0){
                return res.json({
                    code : constant.APPUSER,
                    message : message.USER.ALREADY_ACCOUNT_ACTIVE,
                    result : result
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

function resetPassword(req,res)
{   
    console.log('ppppppppp: '+ JSON.stringify(req.body));
    //return false;
    token = req.body.accessToken;
    console.log('token: '+token);
    req.body.accessToken = '';
    req.body.emailVerified = '1';
    req.body.userStatus = '1'; 
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(req.body.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            
            User.findOneAndUpdate({ accessToken:token }, {password:hash,accessToken:'',emailVerified:1,userStatus:1}, { new:true },(err,result) => {
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
                            message: message.USER.RESET_PASSWORD_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        });
    });    
}

/*
    Function Name : Change Status
    Author  : Farhan
    Created : 22-09-2018
    Modified By : Farhan Hashmi
    Type: Public function for change status of users page
*/
function status(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { userStatus: req.body.status } };
  
    User.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                let status = result.userStatus == 1 ? message.USER.USER_STATUS_ACTIVE: message.USER.USER_STATUS_INACTIVE;
                return res.json({
                    code: constant.SUCCESS,
                    message: status,
                    result: result
                });
        
            }
        }
    }) 

}


/*
 Function Name : Filtered User Summary/List
 Author  : Pradeep Chaurasia
 Created : 28-09-2018
*/
function FileredUsersSummary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    console.log("page "+req.params.page);
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;
    var searchkey=req.params.searchkey;
    console.log('search key: '+searchkey);
    if(ordering==0){
        ordering='-1';
    }

    sortObject[sortfields] = ordering;

    { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }

    User.find({$or:[{"firstName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"lasttName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"email": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}],userType : {$not:{$size: 0}}})
        .skip((perPage * page) - perPage)
        .populate('userType')
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allusers) {
            User.count({$or:[{"firstName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"lasttName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"email": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}],userType : {$not:{$size: 0}}}).exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_SUMMARY_FOUND,
                    result: allusers,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

/*
    Function Name : Change Password
    Author  : Pradeep Chaurasia
    Created : 05-10-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change password of login users
*/
function change_password(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body); 

    var myquery = { _id: req.params._id };
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(req.body.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            var newvalues = { $set: { password: hash } };
            
  
    User.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.USER.CHANGE_PASSWORD_SUCCESS,
                    result: result
                });
        
            }
        }
    })
}); 
});

}
