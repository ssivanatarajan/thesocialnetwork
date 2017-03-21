var db = require('../db')

var Tower = db.model('Tower', {
  towerId:{type:Number},	
  name: { type: String, required: true },
  manager:  {type: db.Schema.Types.ObjectId, ref: 'User',required:true}
  })
module.exports=Tower