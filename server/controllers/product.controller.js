var Product = require('../models/Product')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');

var express = require('express');
var router = express.Router();

// routes
router.get('/:page/:sortfields/:ordering', ProductSummary);
router.post('/', addProduct);
router.get('/:_id', getCurrent);
router.get('/edit/:_id', getCurrent);
router.put('/status/:_id', changeStatusProduct);
router.put('/:_id', updateProduct);
router.delete('/:_id', _deleteProduct);
router.get('/search/:page/:sortfields/:ordering/:searchkey', FilteredProductSummary);

module.exports = router;

/*
 Function Name : ProductSummary
 Author  : Pradeep
 Created : 26-09-2018
*/
function ProductSummary(req, res) {
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
    Product.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allproduct) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.PRODUCT.PRODUCT_SUMMARY_FOUND,
                    result: allproduct,
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
 Created : 26-09-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.PRODUCT.ID_PARAMETER_REQUIRED
        });
    }
	Product.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.PRODUCT.PRODUCT_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.PRODUCT.PRODUCT_SUMMARY_FOUND,
                    result: result
                });

            }
        }
    })
}

/*
 Function Name : AddPRODUCT
 Author  : Pradeep
 Created : 26-09-2018
*/

function addProduct(req, res) {
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    if (!req.body.productName && !req.body.description && !req.body.shippingRequired && !req.body.peerPointsRequired && !req.body.status) {
        return res.send({
        code: constant.ERROR,
        message: constant.INTERNAL_SERVER_ERROR
        })
    }
    const data = req.body;
    const flag = validator.validate_all_request(data, ['productName', 'description','shippingRequired','peerPointsRequired']);
    if (flag) {
        return res.json(flag);
    }
    Product.findOne({ productName: req.body.productName }, (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.PRODUCT.PRODUCT_NAME_ALREADY_EXIST
            })
        } else {
            Product.create(req.body, (err, result) => {
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
                    })
                } else {
                    return res.send({
                        code: constant.SUCCESS,
                        message: message.PRODUCT.INSERT_SUCCESS,
                        result: result
                    })
                }
            })
        }
    })
}

/*
    Function Name : Get updateProduct
    Author  : Pradeep Chaurasia
    Created : 26-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update product
*/
function updateProduct(req, res) {
    
    Product.findOne({ productName: req.body.productName,"_id": {$ne: req.params._id}} , (err, result) => {
        if (result) {
            return res.send({
                code: constant.ERROR,
                message: message.PRODUCT.PRODUCT_NAME_ALREADY_EXIST
            })
        } else {
            Product.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                            message: message.PRODUCT.PRODUCT_NOT_FOUND
                        });
                    }else {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.PRODUCT.UPDATE_SUCCESS,
                            result: result
                        });
                
                    }
                }
            })
        }
   
    })
}
/*
    Function Name : _deleteProduct
    Author  : Pradeep Chaurasia
    Created : 26-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for delete product
*/
function _deleteProduct(req, res) {

    Product.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.PRODUCT.PRODUCT_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.PRODUCT.PRODUCT_DELETED_SUCCESS,
            result: result
        });
    })
}

/*
    Function Name : changeStatusProduct
    Author  : Pradeep Chaurasia
    Created : 26-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for change status of product
*/
function changeStatusProduct(req,res){ 
    console.log('========='+req.params._id); 
    console.log('========= body'+req.body.status); 

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    Product.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.PRODUCT.PRODUCT_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.PRODUCT.UPDATE_STATUS,
                    result: result
                });
        
            }
        }
    }) 

}


/*
 Function Name : Filtered product Summary/List
 Author  : Pradeep Chaurasia
 Created : 28-09-2018
*/
function FilteredProductSummary(req, res) {
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
    Product.find({"productName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, allproduct) {
            Product.count({"productName": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}).exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.PRODUCT.PRODUCT_SUMMARY_FOUND,
                    result: allproduct,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}
