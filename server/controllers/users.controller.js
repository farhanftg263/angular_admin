var User = require('../models/User')
var validator = require('../middlewares/validation');
var constant = require("../constant");
var message = require("../validation_errors");
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function authenticate(req, res)
{
    console.log("login",req.body);
    if (!req.body.email && !req.body.password) {
        return res.send({
            code: constant.ERROR,
            message: constant.REQUIRED_DATA
        })
    }

    const data = req.body;
    const flag = validation.validate_all_request(data, ['email', 'password']);
    if (flag){
        return res.json(flag);
    }

    User.findOne({ email: req.body.email}, (err, result) => {
        if (err) {
          return res.send({
            code: constant.ERROR,
            message: constant.INTERNAL_SERVER_ERROR
          })
        } else {
          if (!result) {
            res.json({
                code: constant.ERROR ,
                message: message.USER.EMAIL_NOT_FOUND,
            });
          } else {
                result.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        return res.json({
                            code: constant.SUCCESS,
                            message: message.USER.LOGIN_SUCCESSFULLY,
                            result: {
                                _id: result._id,
                                email: result.username,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                token: jwt.sign({ sub: result._id }, config.secret)
                            }
                        });
                    } else {
                        return res.json({
                            code: constant.ERROR,
                            message: message.USER.INVALID_USER_PASSWORD,
                        });
                    }
                });
            } 
        }
    
    })

}
function authenticate_back(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}