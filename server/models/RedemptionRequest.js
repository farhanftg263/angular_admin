//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var RedemptionRequestSchema = new Schema(
{
    //Product Id
    productId:[{ type: Schema.Types.ObjectId, ref: 'Product' }],
    userId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    peerPointsRedeemed:{
    type:String,
    trim:true,
    sparse:true,
    default:0   
    },
    status:{
        type:String,
        trim:true,
        sparse:true,
        default:0
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

RedemptionRequestSchema.set('toObject', { virtuals: true });
RedemptionRequestSchema.set('toJSON', { virtuals: true });
/*
UserSchema.virtual('userphotos', {
    ref: 'UserPhoto',
    localField: '_id',
    foreignField: 'user',
    justOne: false // set true for one-to-one relationship
}) */

module.exports = mongoose.model('redemption_request', RedemptionRequestSchema);
