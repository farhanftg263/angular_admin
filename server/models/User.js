//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
firstName:{
 type:String,
 trim:true
},
middleName:{
    type:String,
    trim:true
},
lastName:{
    type:String,
    trim:true
},
userName:{
 type:String,
 sparse: true,
 required:true,
 lowercase:true,
},
email:{
type:String,
sparse: true,
lowercase:true,
required:true
},
password:{
type:String,
trim:true,
required:true
},
phoneNumber:{
type:String,
trim:true,
sparse:true
},
profilePic:{
type:String,
trim:true
},
address:{
type:String,
trim:true
},
city:{
type:String,
trim:true
},
state:{
type:String,
trim:true
},
country:{
type:String,
trim:true
},
zipCode:{
type:String,
trim:true
},
subscriptionPlan:{
type:String,
trim:true
},
accessToken:{
 type:String,
 trim:true
},

//User type has 2 option 1=>admin,0=>users
userType:{
type:String,
trim:true
},
userStatus:{
 type:String,
 trim:true,
 sparse:true,
 default:0
},
latitude: {
 type: String,
 trim: true 
},
longitude: {
 type: String,
 trim: true 
}, 
emailVerified:{
 type:String,
 trim:true,
 sparse:true,
 default:0   
}
},
{
timestamps:true
});

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

module.exports = mongoose.model('User', UserSchema);
