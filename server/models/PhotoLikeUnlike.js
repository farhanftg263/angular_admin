//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var PhotoLikeUnlikeSchema = new Schema({
    userBy:{ type: Schema.Types.ObjectId, ref: 'User' },
    status : {
        type:number,
        trim:true,
        default:0
    },
    photoId:{ type: Schema.Types.ObjectId, ref: 'UserPhoto' },
},
{
timestamps:true
});

//UserPhotoSchema.set('toObject', { virtuals: true });
//UserPhotoSchema.set('toJSON', { virtuals: true });

PhotoLikeUnlikeSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('PhotoLikeUnlike', PhotoLikeUnlikeSchema);