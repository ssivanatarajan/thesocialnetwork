var db = require('../db');

var counterSchema = db.Schema({
	name:{type:String},
	next:{type:Number,default:1}
})
var Counter =db.model('Counter',counterSchema)
module.exports=Counter
