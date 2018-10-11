var Leaderboard =  require('../models/Leaderboard');
var express = require('express');
var path = require("path");
var router = express.Router();
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");

// routes 
router.post('/',add);
router.get('/:page/:sortfields/:ordering', summary); 
router.get('/search/:page/:sortfields/:ordering/:searchkey', filterPhotoSummary);

module.exports = router;

// this is for test
function add(req, res, next)
{
    console.log('<<<<<<<<<<<', JSON.stringify(req.body))
    Leaderboard.create(req.body, (err, result) => {
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
    Leaderboard.find({})
        .populate({path:"user"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, leaderboard) {
            if (err) return next(err);
            if(!leaderboard)
            {
                return res.json({
                    code: constant.ERROR,
                    message: message.LEADERBOARD.LEADERBOARD_NOT_FOUND,
                    data : {}
                });
            }
           
            Leaderboard.countDocuments().exec(function(err, count) {
                if (err) return next(err)

                return res.json({
                    code: constant.SUCCESS,
                    message: message.LEADERBOARD.LEADERBOARD_LIST_FOUND,
                    result : leaderboard,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}

function filterPhotoSummary(req, res,next) {
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

    Leaderboard.find({$or:[
            {"username": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
        ]})
        .skip((perPage * page) - perPage)
        .populate("user")
        .limit(perPage)
        .sort(sortObject)
        .exec(function(err, leaderboard) {
            Leaderboard.countDocuments({$or:[
                {"username": { $regex: '.*' + searchkey + '.*','$options' : 'i' }},
            ]})
            .exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.LEADERBOARD.LEADERBOARD_LIST_FOUND,
                    result: leaderboard,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}