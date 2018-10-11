//'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;

var ContactAdminSchema = new Schema({
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

ContactAdminSchema.methods.toJSON = function() {
    var obj = this.toObject();
    return obj;
}

module.exports = mongoose.model('ContactAdmin', ContactAdminSchema);