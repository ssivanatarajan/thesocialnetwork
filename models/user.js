var db = require('../db');

var userSchema = db.Schema({
  userId:{type:Number},
  empId:{type:Number,required:true,unique:true},
  username: { type: String, required: true},
  password: { type: String, required: true, select: false},
  email:{type:String,required:true},
  mobile:{type:String,required:true},
  dob:{type:Date,required:true},
  supportedBy:{primary:[{type: db.Schema.Types.ObjectId, ref: 'Apps'}],secondary:[ {type: db.Schema.Types.ObjectId, ref: 'Apps'}]},
  tower:{type: db.Schema.Types.ObjectId, ref: 'Tower'},
  resetPasswordToken:{type:String},
  resetPasswordTokenExpires:{type:Date},
  verificationcodetoken:{type:String},
  verificationCodeTokenExpires:{type:Date},
  resetPasswordOTP:{type:String},
  resetPasswordOTPExpires:{type:Date}
})
var User=db.model('User', userSchema)

module.exports = User