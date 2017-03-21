var db = require('../db')
var Apps = db.model('Apps', {
  appId:{type:Number},		
  name: { type: String, required: true },
  alias: { type: String, required: true },
  category :{type:String,required:true},
 // supportedBy:{primary:[{type: db.Schema.Types.ObjectId, ref: 'User'}],secondary:[ {type: db.Schema.Types.ObjectId, ref: 'User'}]},
  team:{type:String},
  tower:{type:Number, ref: 'Tower',required:true}
})
module.exports = Apps