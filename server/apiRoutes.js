const express = require('express');
const app = express();
const expressJwt = require('express-jwt');
var config = require('./config.json');
var cors = require('cors');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var path = require('path');

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: [
    '/api/users/authenticate', '/api/users/forgetpassword','/api/users',
    '/api/users/verifyOTP','/api/users/expireOTP','/api/users/resetPassword',
    '/api/users/verifyAccount'
] }));

// routes
app.use('/users', require('./api/controllers/users.controller'));
app.use(function (req, res, next) {
    var form = new formidable.IncomingForm({
        encoding: 'utf-8',
        multiples: true,
        keepExtensions: true
    })
    form.once('error', console.log)
    form.parse(req, function (err, fields, files) {
        Object.assign(req, {fields, files});
        next();
    })
})
app.use('/photo', require('./api/controllers/photo.controller'));

// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid api Token');
    } else {
        throw err;
    }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

module.exports = app;