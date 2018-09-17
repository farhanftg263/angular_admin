var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('cms');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.cms.find().toArray(function (err, cms) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return ucms
        cms = _.map(cms, function (cms) {
            return _.omit(cms, 'hash');
        });

        deferred.resolve(cms);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.cms.findById(_id, function (err, cms) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (cms) {
            // return cms
            deferred.resolve(_.omit(cms, 'hash'));
        } else {
            // cms not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(cmsParam) {
    var deferred = Q.defer();

    // validation
    db.cms.findOne(
        { pagename: cmsParam.pageName },
        function (err, cms) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (cms) {
                // cms already exists
                deferred.reject('PageName "' + cmsParam.pagename + '" is already taken');
            } else {
                createCms();
            }
        });

    function createCms() {
        // set cms object to cmsParam without the cleartext password
        //var user = _.omit(userParam, 'password');
        var cms=cmsParam;
        // add hashed password to user object
       // user.hash = bcrypt.hashSync(userParam.password, 10);

        db.cms.insert(
            cms,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
            
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.cms.findById(_id, function (err, cms) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (cms.PageName !== cmsParam.PageName) {
            // Pagename has changed so check if the new page name is already taken
            db.cms.findOne(
                { pageName: cmsParam.pageName },
                function (err, cms) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (cms) {
                        // page name already exists
                        deferred.reject('PageName "' + req.body.pageName + '" is already taken')
                    } else {
                        updateCms();
                    }
                });
        } else {
            updateCms();
        }
    });

    function updateCms() {
        // fields to update
        var set = {
            pageName: cmsParam.pageName,
            pageContent: cmsParam.pageContent,
            metaTitle: cmsParam.metaTitle,
        };

        // update password if it was entered
        db.cms.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.cms.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}