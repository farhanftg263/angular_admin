var UserPhoto =  require('../models/UserPhoto');
var express = require('express');
var path = require("path");
var router = express.Router();
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");

// routes 
router.get('/:page/:sortfields/:ordering', summary); 
router.get('/search/:page/:sortfields/:ordering/:searchkey', filterPhotoSummary);
router.put('/status/:_id',status); 
router.delete('/:_id',_delete);

module.exports = router;

function summary(req, res, next)
{
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    var sortObject = {};
    var sortfields=req.params.sortfields.trim();   
    var ordering=req.params.ordering;
    
    if(ordering==0){
        ordering='-1';
    }
    sortObject[sortfields] = ordering;
    console.log(sortObject);
    UserPhoto.find({})
        .populate({path:"user",options:{sort: sortObject}})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, photo) {
            if (err) return next(err);

            if(!photo)
            {
                return res.json({
                    code: constant.ERROR,
                    message: message.PHOTO.PHOTO_LIST_NOT_FOUND,
                    data : {}
                });
            }
           
            UserPhoto.countDocuments().exec(function(err, count) {
                if (err) return next(err)

                return res.json({
                    code: constant.SUCCESS,
                    message: message.PHOTO.PHOTO_LIST_FOUND_SUCCESSFULLY,
                    result : photo,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

function filterPhotoSummary(req, res) {
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

    UserPhoto.find({$or:[
            {"city": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
            {"state": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
            {"country": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}
        ]})
        .skip((perPage * page) - perPage)
        .populate("user")
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, photo) {
            UserPhoto.count({$or:[
                {"city": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
                {"state": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
                {"country": { $regex: '.*' + searchkey + '.*','$options' : 'i' }}
            ]})
            .exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.USER.USER_SUMMARY_FOUND,
                    result: photo,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
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

    var myquery = { _id: req.params._id };
    var newvalues = { $set: { status: req.body.status } };
  
    UserPhoto.updateOne(myquery, newvalues, { new:true },(err,result) => {
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
                    message: message.PHOTO.PHOTO_NOT_FOUND
                });
            }else {
                let status = req.body.status == 1 ? message.PHOTO.PHOTO_STATUS_ACTIVE: message.PHOTO.PHOTO_STATUS_INACTIVE;
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
    Function Name : delete user
    Author  : Farhan
    Created : 11-03-2018
    Modified By : Farhan
    Type: Public function for delete user
*/
function _delete(req, res) {

    UserPhoto.findByIdAndRemove(req.params._id, (err,result) => {
        if(err)
        {
            return res.json({
                code: constant.ERROR,
                message: message.PHOTO.PHOTO_NOT_FOUND
            });
        }
        return res.json({
            code: constant.SUCCESS,
            message: message.PHOTO.PHOTO_DELETED_SUCCESS,
            result: result
        });
    })
}