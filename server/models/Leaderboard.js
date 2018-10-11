//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var LeaderboardSchema = new Schema({
    user:{ type: Schema.Types.ObjectId, ref: 'User' },
    username:{
        type:String,
        trim:true,
        default:''
    },
    point:{ 
        type:Number,
        trim:true,
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

LeaderboardSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);