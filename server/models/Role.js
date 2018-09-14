//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var RoleSchema = new Schema({
    roleName:{
    type:String,
    trim:true
    },
    description:{
        type:String,
        trim:true
    },
    status:{
    type:String,
    trim:true,
    sparse:true,
    default:1
    },
},
{
timestamps:true
});


RoleSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model('Role', RoleSchema);
