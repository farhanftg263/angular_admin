var RedemptionRequest = require('../models/RedemptionRequest');
var EmailTemp = require('../models/EmailTemplate');
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var EmailTemplate = require('email-templates').EmailTemplate;
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var config = require('config.json');
var path = require("path");
var router = express.Router();
const md5 = require('md5');

// routes
router.get('/:page/:sortfields/:ordering', RedemptionRequestSummary);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/status/:_id', changeStatusRedemptionRequest);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FilteredredemptionRequestSummary);

module.exports = router;

/*
 Function Name : RedemptionRequestSummary
 Author  : Pradeep Chaurasia
 Created : 10-10-2018
*/
function RedemptionRequestSummary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;  
    
    if(ordering==0){
        ordering='-1';
    }
    sortObject[sortfields] = ordering;
    RedemptionRequest.find({})
        .skip((perPage * page) - perPage)
        .populate('userId')
        .populate('productId')
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allredemptionRequest) {
            RedemptionRequest.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.REDEMPTION_REQUEST.REDEMPTION_REQUEST_SUMMARY_FOUND,
                    result: allredemptionRequest,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

/*
 Function Name : getCurrent
 Author  : Pradeep
 Created : 19-09-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.REDEMPTION_REQUEST.ID_PARAMETER_REQUIRED
        });
    }
	RedemptionRequest.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.REDEMPTION_REQUEST.REDEMPTION_REQUEST_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.REDEMPTION_REQUEST.REDEMPTION_REQUEST_FOUND,
                    result: result
                });

            }
        }
    })
}


/*
    Function Name : changeStatusRedemptionRequest
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of email template
*/
function changeStatusRedemptionRequest(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.USER.ID_PARAMETER_REQUIRED
        });
    }
    RedemptionRequest.findOne({_id:id})    
        .populate('userId')
        .populate('productId')        
        .exec(function(err, result) {
        if (err) {
            return res.send({
                code: constant.ERROR,
                message: constant.INTERNAL_SERVER_ERROR
            })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message. REDEMPTION_REQUEST.REDEMPTION_REQUEST_NOT_FOUND,
                });
            }else {    
                var myquery = { _id: id };
                var newvalues = { $set: { status: req.body.status } };
                RedemptionRequest.updateOne(myquery, newvalues, { new:true },(err,result_update) => {
                    if (err) {
                        return res.send({
                            errr : err,
                            code: constant.ERROR,
                            message: constant.INTERNAL_SERVER_ERROR
                        })
                    } else {                           
                        const userData = result;
                        EmailTemp.findOne({emailTitle : 'Redemption Request Delivered'},(err,result_temp) => {
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
                                    userName: userData.userId[0].firstName +' '+userData.userId[0].lastName,
                                    content : ''
                                };
                                testMailTemplate.render(locals, function (err, temp) {
                                    if (err) {
                                        console.log("error", err);
                                    }else {
                                        //accessToken
                                        let link = constant.ANGULAR_SITE_URL+'resetpassword?email='+userData.email+'&f=0&u=1&accessToken='+accessToken;
                                        var mailhtml = temp.html.replace('{content}',result_temp.emailContent);
                                        mailhtml = mailhtml.replace('{userName}',userData.userId[0].firstName +' '+userData.userId[0].lastName);

                                        transporter.sendMail({
                                            from: constant.SMTP_FROM_EMAIL,
                                            to: userData.userId[0].email,
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

                        return res.json({
                            code: constant.SUCCESS,
                            message: message.REDEMPTION_REQUEST.UPDATE_STATUS,
                            result: result
                        });
                    }                
        
                })
            }
        } 

    })
}


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



/*
 Function Name : Filtered email template Summary/List
 Author  : Pradeep Chaurasia
 Created : 28-09-2018
*/
function FilteredredemptionRequestSummary(req, res) {
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
    EmailTemplate.find({"emailTitle": { $regex: '.*' + searchkey + '.*','$options' : 'i' }})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allemailTemplate) {
            EmailTemplate.count({"emailTitle": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}).exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_SUMMARY_FOUND,
                    result: allemailTemplate,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

