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
router.post('/', add);
router.put('/status/:_id',status);

router.get('/:page/:sortfields/:ordering', summary);
router.get('/current/:_id', getCurrent);
router.get('/role/:_id', getUserByRoleId);

router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FilteredUsersSummary);
router.get('/resend/:_id', resendActivationEmail);


module.exports = router;

/*
 Function Name : User register
 Author  : Pradeep Chaurasia
 Created : 08-10-2018
*/

function add(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.password && !req.body.userType) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['email', 'password', 'username']);
    if (flag) {
        return res.json(flag);
    }
    User.findOne({ email: req.body.email,userType:{$not:{$size: 1}} }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.USER.EMAIL_AREADY_EXIST
            })
        } else {

            User.findOne({ username: req.body.username,userType:{$not:{$size: 1}} }, (err, result_username) => {
                if (result_username) {
                    return res.send({
                        code: constant.ERROR,
                        message: message.USER.USERNAME_ALREADY_EXIST
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
                            EmailTemp.findOne({emailTitle : 'App User Registration By Admin'},(err,result) => {
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
                                            let link = constant.ANGULAR_SITE_URL+'resetpassword?email='+userData.email+'&f=0&u=1&accessToken='+accessToken;
                                            var mailhtml = temp.html.replace('{content}',result.emailContent);
                                            mailhtml = mailhtml.replace('{userFirstLastName}',userData.firstName +' '+userData.lastName);
                                            mailhtml = mailhtml.replace('{userName}',userData.username);
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
                                message: message.USER.APP_INSERT_SUCCESS,
                                result: result
                            })
                        }
                    })
                }
            })
        }

    })
}
/*
 Function Name : User Summary
 Author  : Pradeep Chaurasia
 Created : 08-10-2018
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
    User.find({userType:{$not:{$size: 1}}})       
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, users) {
            User.count({userType:{$not:{$size: 1}}}).exec(function(err, count) {
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
 Author  : Pradeep Chaurasia
 Created : 08-10-2018
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
    Author  : Pradeep Chaurasia
    Created : 08-10-2018
    Modified By : Pradeep Chaurasia
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
    Author  : Pradeep Chaurasia
    Created : 08-10-2018
    Modified By : Pradeep Chaurasia
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
    Function Name : Change Status
    Author  : Pradeep Chaurasia
    Created : 22-09-2018
    Modified By : Pradeep Chaurasia Hashmi
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
function FilteredUsersSummary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    console.log("page "+req.params.page);
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;
    var searchkey=req.params.searchkey;
    console.log('search keywwwwwww: '+searchkey);
    if(ordering==0){
        ordering='-1';
    }

    sortObject[sortfields] = ordering;   

    User.find({$or:[{"firstName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"lasttName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"username": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"email": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}],userType : {$not:{$size: 1}}})
        .skip((perPage * page) - perPage)       
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allusers) {
            User.countDocuments({$or:[{"firstName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"lasttName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},{"email": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}],userType : {$not:{$size: 1}}}).exec(function(err, count) {
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
 Function Name : resend activation email for User 
 Author  : Pradeep Chaurasia
 Created : 09-10-2018
*/
function resendActivationEmail(req, res){
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
                    let unix_time = moment().unix()
                    let salt = req.body.firstName + unix_time
                    let accessToken = md5(salt);

                    var myquery = { _id: id };
                    var newvalues = { $set: { accessToken: accessToken } };
                
                    User.updateOne(myquery, newvalues, { new:true },(err,result_update) => {
                        if (err) {
                            return res.send({
                                errr : err,
                                code: constant.ERROR,
                                message: constant.INTERNAL_SERVER_ERROR
                            })
                        } else {                           
                            const userData = result;
                            EmailTemp.findOne({emailTitle : 'App User Registration By Admin'},(err,result_temp) => {
                                if(err)
                                {
                                    res.send({
                                        code : constant.ERROR,
                                        message : constant.INTERNAL_SERVER_ERROR,
                                        data : {}
                                    });
                                }
                                else if(!result_temp)
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
                                            let link = constant.ANGULAR_SITE_URL+'resetpassword?email='+userData.email+'&f=0&u=1&accessToken='+accessToken;
                                            var mailhtml = temp.html.replace('{content}',result_temp.emailContent);
                                            mailhtml = mailhtml.replace('{userFirstLastName}',userData.firstName +' '+userData.lastName);
                                            mailhtml = mailhtml.replace('{userName}',userData.username);
                                            mailhtml = mailhtml.replace('{userEmail}',userData.email);                                    
                                            mailhtml = mailhtml.replace('{LINK}',link);

                                            transporter.sendMail({
                                                from: constant.SMTP_FROM_EMAIL,
                                                to: userData.email,
                                                subject: result_temp.emailSubject,
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
                                message: message.USER.APP_RESEND_EMAIL,
                                result: result
                            })
                        }
                    })
                

            }
        }
    })

}

