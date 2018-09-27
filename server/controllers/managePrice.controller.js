var ManagePrice = require('../models/ManagePrice')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
//var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
//var config = require('config.json');
var express = require('express');
var router = express.Router();
console.log('at controler page');
// routes
router.get('/:page/:sortfields/:ordering', ManagePriceSummary);
router.post('/', addManagePrice);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/:_id', updateManagePrice);
router.put('/status/:_id', changeStatusManagePrice);
router.delete('/:_id', _deleteManagePrice);

module.exports = router;

/*
 Function Name : ManagePriceSummary
 Author  : Pradeep Chaurasia
 Created : 25-09-2018
*/
function ManagePriceSummary(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var sortObject = {};
    var page = req.params.page || 1;
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;  
    
    if(ordering==0){
        ordering='-1';
    }
    sortObject[sortfields] = ordering;
    ManagePrice.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allPrice) {
            ManagePrice.count().exec(function(err, count) {               
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.MANAGE_PRICE.PRICE_SUMMARY_FOUND,
                    result: allPrice,
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
            message : message.MANAGE_PRICE.ID_PARAMETER_REQUIRED
        });
    }
	ManagePrice.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.MANAGE_PRICE.PRICE_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.MANAGE_PRICE.PRICE_FOUND,
                    result: result
                });

            }
        }
    })
}

/*
 Function Name : addManagePrice
 Author  : Pradeep Chaurasia
 Created : 25-09-2018
*/

function addManagePrice(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.price && !req.body.peerPoints && !req.body.status) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['price','peerPoints']);
    if (flag) {
        return res.json(flag);
    }
    ManagePrice.findOne({ price: req.body.price }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.MANAGE_PRICE.PRICE_ALREADY_EXIST
            })
        } else {
            ManagePrice.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    return res.send({
                        code: constant.SUCCESS,
                        message: message.MANAGE_PRICE.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}

/*
    Function Name : updateManagePrice
    Author  : Pradeep Chaurasia
    Created : 25-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update price
*/
function updateManagePrice(req, res) {

    ManagePrice.findOne({ price: req.body.price,"_id": {$ne: req.params._id}} , (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.MANAGE_PRICE.PRICE_ALREADY_EXIST
            })
        } else {
            ManagePrice.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                            message: message.MANAGE_PRICE.PRICE_NOT_FOUND
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.MANAGE_PRICE.UPDATE_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        }
    })
}
/*
    Function Name : _deleteManagePrice
    Author  : Pradeep Chaurasia
    Created : 25-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete price
*/
function _deleteManagePrice(req, res) {

    ManagePrice.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.MANAGE_PRICE.PRICE_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.MANAGE_PRICE.PRICE_DELETED_SUCCESS,
            result: result
        });
    })
}

/*
    Function Name : changeStatusManagePrice
    Author  : Pradeep Chaurasia
    Created : 25-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of price management
*/
function changeStatusManagePrice(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    ManagePrice.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.MANAGE_PRICE.PRICE_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.MANAGE_PRICE.UPDATE_STATUS,
                    result: result
                });
        
            }
        }
    }) 

}

