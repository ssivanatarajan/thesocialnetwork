var db = require('../db')
var Post = db.model('Post', {
  userid: { type: String, required: true },
  body:     { type: String, required: true },
  date:     { type: Date, required: true, default: Date.now },
  likes :{type:Number,default:0},
  comments:{comment:String,commentedby_id:String,commentedby_name:String,date:Date},
  likedBY:{type:String}

})
module.exports = Post