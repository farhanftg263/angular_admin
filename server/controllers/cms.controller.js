var Cms = require('../models/Cms')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
//var nodemailer = require('nodemailer');

//var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
//var config = require('config.json');
var express = require('express');
var router = express.Router();
//var userService = require('services/user.service');

// routes
//router.post('/authenticate', authenticate);
//router.post('/register', register);
//router.post('/forgotpassword',forgotpassword);
//router.put('/reset/:_otp',resetPassword);
router.get('/', list);

//router.get('/:_id', getCurrent);
//router.put('/:_id', update);
//router.delete('/:_id', _delete);

module.exports = router;
/*
 Function Name : Cms Summary
 Author  : Farhan
 Created : 11-03-2018
*/
function list(req, res) {
    var perPage = constant.PER_PAGE_RECORD
    var page = req.params.page || 1;
    Cms.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
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
