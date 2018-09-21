//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var EmailTemplateSchema = new Schema({
    emailTitle:{
        type:String,
        trim:true
    },
    emailSubject:{
        type:String,
        trim:true
    },
    emailContent:{
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

module.exports = mongoose.model('email_templates', EmailTemplateSchema);
