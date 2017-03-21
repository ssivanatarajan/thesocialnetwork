var express=require('express')
var router = express.Router()
var ObjectID = require('mongodb').ObjectID;
var User=require('../../models/user')
var Tower=require('../../models/tower')
router.get('/',function(req,res,next){
	Tower.find({},{_id:0}).exec(function(err,towers){
		if(!err)
			res.json(towers)
	})
})
module.exports=router