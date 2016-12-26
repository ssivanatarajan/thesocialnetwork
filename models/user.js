var db = require('../db')
var user = db.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true, select: false},
  email:{type:String,required:true},
  mobile:{type:String,required:true},
  dob:{type:Date,required:true}

})
module.exports = db.model('User', user)