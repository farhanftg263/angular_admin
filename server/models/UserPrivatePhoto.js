//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var UserPrivatePhotoSchema = new Schema({
    userTo:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    userPhotoId:[{ type: Schema.Types.ObjectId, ref: 'UserPhoto' }],
},
{
timestamps:true
});

//UserPhotoSchema.set('toObject', { virtuals: true });
//UserPhotoSchema.set('toJSON', { virtuals: true });

UserPrivatePhotoSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('UserPrivatePhoto', UserPrivatePhotoSchema);