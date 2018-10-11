//'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
global.Promise = mongoose.Promise;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema(
{
    firstName:{
    type:String,
    trim:true
    },
    middleName:{
        type:String,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        trim:true,
        default: "",
    },
    email:{
    type:String,
    sparse: true,
    lowercase:true,
    required:true
    },
    password:{
    type:String,
    trim:true,
    required:true
    },
    phoneNumber:{
    type:String,
    trim:true,
    sparse:true
    },
    dob:{
        type:Date,
        default: '',
        trim:true
    },
    profilePic:{
        type:String,
        default: "",
        trim:true
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
    address:{
        type:String,
        trim:true
    },
    city:{
        type:String,
        trim:true,
        default:""
    },
    state:{
        type:String,
        trim:true,
        default:""
    },
    country:{
        type:String,
        default: "",
        trim:true,
    },
    zipCode:{
        type:String,
        default: "",
        trim:true
    },
    subscriptionPlan:{
        type:String,
        trim:true
    },
    accessToken:{
    type:String,
    default: "0",
    trim:true
    },
    gender:{
        type:String,
        default: "M",
        trim:true
    },
    totalPointsEarned:{
        type:String,
        default: "0",
        trim:true
    },
    totalPointsRedeemed:{
        type:String,
        default: "0",
        trim:true
    },
    totalCurrentPoints:{
        type:String,
        default: "0",
        trim:true
    },
    lastLoginTime:{
        type:Date,
        default: Date.now,
        trim:true
    },
    totalPhotosSnaped:{
        type:String,
        default: "0",
        trim:true
    },
    totalPhotosPurchased:{
        type:String,
        default: "0",
        trim:true
    },
    totalRewardsRedeemed:{
        type:String,
        default: "0",
        trim:true
    },
    shippingAddress:{
        type:String,
        default: "",
        trim:true
    },
    

    //User type has 2 option 1=>admin,0=>users
    userType:[{ type: Schema.Types.ObjectId, ref: 'Roles' }],
    userStatus:{
    type:Number,
    trim:true,
    sparse:true,
    default:0
    }, 
    emailVerified:{
    type:String,
    trim:true,
    sparse:true,
    default:0   
    }
},
{
timestamps:true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }

UserSchema.virtual('userphotos', {
    ref: 'UserPhoto',
    localField: '_id',
    foreignField: 'user',
    justOne: false // set true for one-to-one relationship
})

module.exports = mongoose.model('User', UserSchema);
