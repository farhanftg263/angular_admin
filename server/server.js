﻿require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var mongoose = require('mongoose');
var path = require("path");
const apiRoutes = require('./apiRoutes');
var Q = require('q');

//Set up default mongoose connection
var mongoDB = config.connectionString;
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDB,{ useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = require('q').Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '10mb'}));

app.use(express.static(__dirname + '/images'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

// load our API routes

app.use('/api', apiRoutes);

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
}).unless({ path: ['/users/authenticate', '/users/forgetpassword','/users/verifypassword','/users/resetpassword'] }));

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/roles', require('./controllers/roles.controller'));
app.use('/cms', require('./controllers/cms.controller'));
app.use('/email_template', require('./controllers/emailTemplate.controller'));
app.use('/global_setting', require('./controllers/globalSetting.controller'));
app.use('/manage_price', require('./controllers/managePrice.controller'));
app.use('/product', require('./controllers/product.controller'));
app.use('/app_users', require('./controllers/appUsers.controller'));
app.use('/photo',require('./controllers/photo.controller'));
app.use('/redemption_request',require('./controllers/redemptionRequest.controller'))
app.use('/contact-admin',require('./controllers/contactAdmin.controller'));
app.use('/feedback',require('./controllers/feedback.controller'));
app.use('/leaderboard',require('./controllers/leaderboard.controller'));


// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Token');
    } else {
        throw err;
    }
});

 
// start server
var port = process.env.PORT === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

process.on('uncaughtException', function (exception) {
    console.log("Error "+exception); 
}); 