var Role = require('../models/Role')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

// routes
/*router.post('/authenticate', authenticate);
router.post('/rolelist', roleList);
router.post('/register', register);
router.post('/forgotpassword',forgotpassword);
router.put('/reset/:_otp',resetPassword);*/
router.get('/', summary);
/*router.get('/:_id', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);*/
module.exports = router;
/*
 Function Name : Role Summary/Liest
 Author  : Farhan
 Created : 14-03-2018
*/
function summary(req, res) {
    var perPage = 20
    var page = req.params.page || 1;
    Role.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, roles) {
            Role.count().exec(function(err, count) {
                if (err) return next(err)
                return res.json({
                    code: constant.SUCCESS,
                    message: message.ROLE.ROLE_SUMMARY_FOUND,
                    result: roles,
                    total : count,
                    current: page,
                    perPage: perPage,
                    pages: Math.ceil(count / perPage)
                });
            })
        });
}