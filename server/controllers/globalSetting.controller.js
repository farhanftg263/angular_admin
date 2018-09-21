var GlobalSetting = require('../models/GlobalSetting')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();

// routes
router.get('/', GlobalSetting);
router.get('/:_id', getCurrent);
router.put('/:_id', updateGlobalSetting);
module.exports = router;

/*
 Function Name : GlobalSetting
 Author  : Pradeep Chaurasia
 Created : 21-09-2018
*/
function GlobalSetting(req, res) {
    console.log('server global setting function');
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    GlobalSetting.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, allglobalSetting) {
            GlobalSetting.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.GLOBAL_SETTING.GLOBAL_SETTING_FOUND,
                    result: allglobalSetting,
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
 Author  : Pradeep Chaurasia
 Created : 21-09-2018
*/
function getCurrent(req, res) {
    var id = req.params._id;
    if (!id) {
        return res.json({
            code : constant.ERROR,
            message : message.GLOBAL_SETTING.ID_PARAMETER_REQUIRED
        });
    }
	GlobalSetting.findOne({_id:id}, (err, result) => {
        if (err) {
        return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
        })
        } else {
            if (!result) {
                res.json({
                    code: constant.ERROR,
                    message: message.GLOBAL_SETTING.GLOBAL_SETTING_NOT_FOUND,
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.GLOBAL_SETTING.GLOBAL_SETTING_FOUND,
                    result: result
                });

            }
        }
    })
}


/*
    Function Name : updateGlobalSetting
    Author  : Pradeep Chaurasia
    Created : 21-09-2018
    Modified By : Pradeep Chaurasia
    Type: Public function for update global setting
*/
function updateGlobalSetting(req, res) {

    GlobalSetting.findOneAndUpdate({ _id:req.params._id }, req.body, { new:true },(err,result) => {
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
                    message: message.GLOBAL_SETTING.GLOBAL_SETTING_NOT_FOUND
                });
            }else {
                return res.json({
                    code: constant.SUCCESS,
                    message: message.GLOBAL_SETTING.UPDATE_SUCCESS,
                    result: result
                });
        
            }
        }
    })
}

