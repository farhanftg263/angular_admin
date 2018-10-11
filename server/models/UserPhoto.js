//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var UserPhotoSchema = new Schema({
    photo:{
        type:String,
        trim:true,
        default:""
    },
    passcode : {
        type:Number,
        trim:true,
        default:0
    },
    user:{ type: Schema.Types.ObjectId, ref: 'User' },
    locationType:{
        type:Number,
        default:0
    },
    latitude:{
        type:String,
        trim:true,
        default:"0"
    },
    longitude:{
        type:String,
        trim:true,
        default:"0"
    },
    city : {
        type:String,
        trim:true,
        default:""
    },
    state : {
        type:String,
        trim:true,
        default:""
    },
    country : {
        type:String,
        trim:true,
        default:""
    },
    zipCode : {
        type:Number,
        trim:true,
        default:0
    },
    viewCount : {
        type:Number,
        trim:true,
        default:0
    },
    downloadCount : {
        type:Number,
        trim:true,
        default:0
    },
    likeCount : {
        type:Number,
        trim:true,
        default:0
    },
    unlikeCount : {
        type:Number,
        trim:true,
        default:0
    },
    shareCount : {
        type:Number,
        trim:true,
        default:0
    },
    status:{
        type:String,
        trim:true,
        sparse:true,
        default:1
    },
    createdDt:{
        type:Date,
        trim:true,
        sparse:true,
        default: Date.now
    },
},
{
timestamps:true
});


UserPhotoSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('UserPhoto', UserPhotoSchema);
