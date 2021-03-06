﻿var Product = require('../models/Product')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require("path");
var mime = require('mime');
var gm = require('gm');
<<<<<<< HEAD

=======
>>>>>>> 7f6916c20dc0a2ef3dc589a6ddf4cbd1919771f9

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
    //console.log('<<<<<<<<<<<',req.body.productImage.length)
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
<<<<<<< HEAD
=======
                if (err) {
                    return res.send({
                        errr : err,
                        code: constant.ERROR,
                        message: constant.INTERNAL_SERVER_ERROR
            // Upload Image
            var productDir = path.join(__dirname, "../", 'images/product/');
            var decodedImg = decodeBase64Image(req.body.productImage);
            var imageBuffer = decodedImg.data;
            var type = decodedImg.type;
            var extension = mime.getExtension(type);
            var fileName =  new Date().getTime()+'.' + extension;
            var uploadedImage = productDir + fileName;
            console.log("path "+uploadedImage);
            try{
                fs.writeFileSync(productDir + fileName, imageBuffer, 'utf8');
                let imageMagick = gm.subClass({imageMagick: true});
                imageMagick(uploadedImage)
                .resize(250, 400)
                .write(productDir+'thumb/'+fileName, (err) => {
                  if (err) {
                    console.log(err); 
                  } else {
                    //Created Product
                    req.body.productImage = fileName;
                    Product.create(req.body, (err, result) => {
>>>>>>> 7f6916c20dc0a2ef3dc589a6ddf4cbd1919771f9
                        if (err) {
                            return res.send({
                                errr : err,
                                code: constant.ERROR,
                                message: constant.INTERNAL_SERVER_ERROR
                        })

                    // Upload Image
                    var productDir = path.join(__dirname, "../", 'images/product/');
                    var decodedImg = decodeBase64Image(req.body.productImage);
                    var imageBuffer = decodedImg.data;
                    var type = decodedImg.type;
                    var extension = mime.getExtension(type);
                    var fileName =  new Date().getTime()+'.' + extension;
                    var uploadedImage = productDir + fileName;
                    console.log("path "+uploadedImage);
                    try{
                        fs.writeFileSync(productDir + fileName, imageBuffer, 'utf8');
                        let imageMagick = gm.subClass({imageMagick: true});
                        imageMagick(uploadedImage)
                        .resize(250, 400)
                        .write(productDir+'thumb/'+fileName, (err) => {
                        if (err) {
                            console.log(err); 
                        } else {
<<<<<<< HEAD
                            //Created Product
                            req.body.productImage = fileName;
                            Product.create(req.body, (err, result) => {
                                if (err) {
                                    return res.send({
                                        errr : err,
                                        code: constant.ERROR,
                                        message: constant.INTERNAL_SERVER_ERROR
                                    });
                                } else {
                                    return res.send({
                                        code: constant.SUCCESS,
                                        message: message.PRODUCT.INSERT_SUCCESS,
                                        result: result
                                    });
                                }
                            })
=======
                            return res.send({
                                code: constant.SUCCESS,
                                message: message.PRODUCT.INSERT_SUCCESS,
                                result: result
                            });
                        }

                    })
>>>>>>> 7f6916c20dc0a2ef3dc589a6ddf4cbd1919771f9

                        }
                        })
                    }
                    catch(err){
                        console.error(err)
                    }
                }
            })
        }
    })

            
}
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
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

             // Upload Image
           
             try{
                if(req.body.productImage)
                {
                    var productDir = path.join(__dirname, "../", 'images/product/');
                    var decodedImg = decodeBase64Image(req.body.productImage);
                    var imageBuffer = decodedImg.data;
                    var type = decodedImg.type;
                    var extension = mime.getExtension(type);
                    var fileName =  new Date().getTime()+'.' + extension;
                    var uploadedImage = productDir + fileName;

                    fs.writeFileSync(productDir + fileName, imageBuffer, 'utf8');
                        let imageMagick = gm.subClass({imageMagick: true});
                        imageMagick(uploadedImage)
                        .resize(250, 400)
                        .write(productDir+'thumb/'+fileName, (err) => {
                        if (err) {
                            console.log(err); 
                        } else {
                            //Created Product
                            req.body.productImage = fileName;
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
                else{
                    delete req.body.productImage;
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
             }
             catch(err){
                 console.error(err)
             }
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
