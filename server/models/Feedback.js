//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var FeedbackSchema = new Schema({
    user:{ type: Schema.Types.ObjectId, ref: 'User' },
    comment:{ 
        type:String,
        trim:true,
        default:""
    }
},
{
timestamps:true
});

FeedbackSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('Feedback', FeedbackSchema);