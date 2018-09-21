//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var GlobalSettingSchema = new Schema({
    photoPurchasePoints:{
        type:Number,
        trim:true
    },
    pointsRecievedPhoto:{
        type:Number,
        trim:true
    },
    pointsRecievedShare:{
        type:Number,
        trim:true    
    },    
    pointsRecievedView:{
        type:Number,
        trim:true,       
    },
    pointsRecievedSignup:{
        type:Number,
        trim:true    
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

module.exports = mongoose.model('global_setting', GlobalSettingSchema);
