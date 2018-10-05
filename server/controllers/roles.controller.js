var Roles = require('../models/Role')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

// routes

router.get('/:page/:sortfields/:ordering', RolesSummary);
router.post('/', addRoles);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/status/:_id', changeStatusRoles);
router.put('/:_id', updateRoles);
router.delete('/:_id', _deleteRoles);
router.get('/status/:status', OnlyActiveRolesSummary);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FileredRolesSummary);

module.exports = router;
/*
 Function Name : Role Summary/List
 Author  : Pradeep Chaurasia
 Created : 27-09-2018
*/
function RolesSummary(req, res) {
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
    Roles.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allroles) {
            Roles.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLES.ROLES_SUMMARY_FOUND,
                    result: allroles,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

/*
 Function Name : Filtered Role Summary/List
 Author  : Pradeep Chaurasia
 Created : 28-09-2018
*/
function FileredRolesSummary(req, res) {
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
    Roles.find({"roleName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allroles) {
            Roles.count({"roleName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}).exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLES.ROLES_SUMMARY_FOUND,
                    result: allroles,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}


/*
 Function Name : OnlyActiveRolesSummary Summary/List
 Author  : Pradeep Chaurasia
 Created : 27-09-2018
*/
function OnlyActiveRolesSummary(req, res) {   
    
    Roles.find({status:1})        
        .exec(function(err, allroles) {
            Roles.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLES.ROLES_SUMMARY_FOUND,
                    result: allroles,
                    total : count                    
                });
            })
        });
}

/*
 Function Name : Get getCurrent
 Author  : Pradeep Chaurasia
 Created : 27-09-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.ROLES.ID_PARAMETER_REQUIRED
        });
    }
	Roles.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.ROLES.ROLES_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLES.ROLES_SUMMARY_FOUND,
                    result: result
                });

            }
        }
    })
}

/*
 Function Name : AddRoles
 Author  : Pradeep
 Created : 27-09-2018
*/

function addRoles(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.roleName && !req.body.status) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['roleName']);
    if (flag) {
        return res.json(flag);
    }
    Roles.findOne({ roleName: req.body.roleName }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.ROLES.ROLE_NAME_ALREADY_EXIST
            })
        } else {
            Roles.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    return res.send({
                        code: constant.SUCCESS,
                        message: message.ROLES.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}

/*
    Function Name : Get updateRoles
    Author  : Pradeep Chaurasia
    Created : 27-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update role
*/
function updateRoles(req, res) {
    
    Roles.findOne({ roleName: req.body.roleName,"_id": {$ne: req.params._id}} , (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.ROLES.ROLE_NAME_ALREADY_EXIST
            })
        } else {
            Roles.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                            message: message.ROLES.ROLE_NOT_FOUND
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.ROLES.UPDATE_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        }
   
    })
}
/*
    Function Name : _deleteRoles
    Author  : Pradeep Chaurasia
    Created : 27-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete role
*/
function _deleteRoles(req, res) {

    Roles.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.ROLES.ROLE_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.ROLES.ROLE_DELETED_SUCCESS,
            result: result
        });
    })
}

/*
    Function Name : changeStatusRoles
    Author  : Pradeep Chaurasia
    Created : 27-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of role
*/
function changeStatusRoles(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    Roles.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.ROLES.ROLES_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLES.UPDATE_STATUS,
                    result: result
                });
        
            }
        }
    }) 

}