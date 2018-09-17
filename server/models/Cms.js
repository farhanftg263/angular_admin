//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var CmsSchema = new Schema({
    pageName:{
        type:String,
        trim:true
    },
    pageContent:{
        type:String,
        trim:true    
    },
    metaTitle:{
        type:String,
        trim:true
    },
    metaDescription:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        trim:true,
        sparse:true,
        default:1
    },
    createdBy:{
        type:String,
        trim:true,
        sparse:true,
        
    },
    createdDt:{
        type:Date,
        trim:true,
        sparse:true,
        default: Date.now
        
    },
    modifiedBy:{
        type:String,
        trim:true,
        sparse:true,
        
    },
    modifiedDt:{
        type:Date,
        trim:true,
        sparse:true,
       
    },  
    
},
{
timestamps:true
});
/*
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
   */

module.exports = mongoose.model('Cms', CmsSchema);
