var EmailTemplate = require('../models/EmailTemplate')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
//var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
//var config = require('config.json');
var express = require('express');
var router = express.Router();

// routes
router.get('/:page/:sortfields/:ordering', EmailTemplateSummary);
router.post('/', addEmailTemplate);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/:_id', updateEmailTemplate);
router.put('/status/:_id', changeStatusEmailTemplate);
router.delete('/:_id', _deleteEmailTemplate);

module.exports = router;

/*
 Function Name : EmailTemplateSummary
 Author  : Pradeep
 Created : 19-09-2018
*/
function EmailTemplateSummary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;  
    
    if(ordering==0){
        ordering='-1';
    }
    sortObject[sortfields] = ordering;
    EmailTemplate.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allemailTemplate) {
            EmailTemplate.count().exec(function(err, count) {
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
            message : message.EMAIL_TEMPLATE.ID_PARAMETER_REQUIRED
        });
    }
	EmailTemplate.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_FOUND,
                    result: result
                });

            }
        }
    })
}

/*
 Function Name : AddEmailTemplate
 Author  : Pradeep Chaurasia
 Created : 18-09-2018
*/

function addEmailTemplate(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.emailTitle && !req.body.emailSubject && !req.body.emailContent && !req.body.status) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['emailTitle','emailSubject', 'emailContent']);
    if (flag) {
        return res.json(flag);
    }
    EmailTemplate.findOne({ emailTitle: req.body.emailTitle }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.EMAIL_TEMPLATE.EMAIL_TITLE_ALREADY_EXIST
            })
        } else {
            EmailTemplate.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    return res.send({
                        code: constant.SUCCESS,
                        message: message.EMAIL_TEMPLATE.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}

/*
    Function Name : updateEmailTemplate
    Author  : Pradeep Chaurasia
    Created : 19-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update email template
*/
function updateEmailTemplate(req, res) {

    EmailTemplate.findOne({ emailTitle: req.body.emailTitle,"_id": {$ne: req.params._id}} , (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.EMAIL_TEMPLATE.EMAIL_TITLE_ALREADY_EXIST
            })
        } else {
            EmailTemplate.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                            message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_NOT_FOUND
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.EMAIL_TEMPLATE.UPDATE_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        }
    })
}
/*
    Function Name : delete email template
    Author  : Pradeep Chaurasia
    Created : 19-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete email template
*/
function _deleteEmailTemplate(req, res) {

    EmailTemplate.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_DELETED_SUCCESS,
            result: result
        });
    })
}

/*
    Function Name : changeStatusEmailTemplate
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of email template
*/
function changeStatusEmailTemplate(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    EmailTemplate.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.EMAIL_TEMPLATE.EMAIL_TEMPLATE_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.EMAIL_TEMPLATE.UPDATE_STATUS,
                    result: result
                });
        
            }
        }
    }) 

}

