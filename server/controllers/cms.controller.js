var Cms = require('../models/Cms')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();

// routes
router.get('/:page/:sortfields/:ordering', CmsSummary);
router.post('/', addCms);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/status/:_id', changeStatusCms);
router.put('/:_id', updateCms);
router.delete('/:_id', _deleteCms);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FilteredCmsSummary);

module.exports = router;

/*
 Function Name : CmsSummary
 Author  : Pradeep
 Created : 17-09-2018
*/
function CmsSummary(req, res) {
    
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
    Cms.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allcms) {
            Cms.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.CMS.CMS_SUMMARY_FOUND,
                    result: allcms,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

/*
 Function Name : Get getCurrent
 Author  : Pradeep Chaurasia
 Created : 11-09-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.CMS.ID_PARAMETER_REQUIRED
        });
    }
	Cms.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.CMS.CMS_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.CMS.CMS_SUMMARY_FOUND,
                    result: result
                });

            }
        }
    })
}

/*
 Function Name : AddCMS
 Author  : Pradeep
 Created : 18-09-2018
*/

function addCms(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.pageName && !req.body.pageContent && !req.body.status) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['pageName', 'pageContent']);
    if (flag) {
        return res.json(flag);
    }
    Cms.findOne({ pageName: req.body.pageName }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.CMS.PAGE_NAME_ALREADY_EXIST
            })
        } else {
            Cms.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    return res.send({
                        code: constant.SUCCESS,
                        message: message.CMS.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}

/*
    Function Name : Get updateCms
    Author  : Pradeep Chaurasia
    Created : 17-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update cms page
*/
function updateCms(req, res) {
    
    Cms.findOne({ pageName: req.body.pageName,"_id": {$ne: req.params._id}} , (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.CMS.PAGE_NAME_ALREADY_EXIST
            })
        } else {
            Cms.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                            message: message.CMS.CMS_NOT_FOUND
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.CMS.UPDATE_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        }
   
    })
}
/*
    Function Name : _deleteCms
    Author  : Pradeep Chaurasia
    Created : 17-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete cms page
*/
function _deleteCms(req, res) {

    Cms.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.CMS.CMS_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.CMS.CMS_DELETED_SUCCESS,
            result: result
        });
    })
}

/*
    Function Name : changeStatusCms
    Author  : Pradeep Chaurasia
    Created : 20-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of cms page
*/
function changeStatusCms(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    Cms.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.CMS.CMS_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.CMS.UPDATE_STATUS,
                    result: result
                });
        
            }
        }
    }) 

}


/*
 Function Name : Filtered cms Summary/List
 Author  : Pradeep Chaurasia
 Created : 03-10-2018
*/
function FilteredCmsSummary(req, res) {
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
    Cms.find({"pageName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allcms) {
            Cms.count({"pageName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}).exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.CMS.CMS_SUMMARY_FOUND,
                    result: allcms,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

