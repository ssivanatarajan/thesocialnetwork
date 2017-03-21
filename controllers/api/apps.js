var express=require('express')
var router = express.Router()
var ObjectID = require('mongodb').ObjectID;
var User=require('../../models/user')
var Tower=require('../../models/tower')
var App=require('../../models/apps')
var Counter = require('../../models/counter')


router.get('/',function(req,res,next){
	Tower.find({},{_id:0}).exec(function(err,towers){
		if(!err)
			res.json(towers)
	})
})
router.post('/',function(req,res,next){
	console.log('AddAppreq- params',req.body.appname +' '+req.body.alias +' '+req.body.category+' '+req.body.tower)
	var app=new App({name:req.body.appname,alias:req.body.alias,category:req.body.category,tower:req.body.tower})
	Counter.findOneAndUpdate({name:'Apps'}, {$inc : {next:1}},function(err,d){
      app.appId=d.next
      app.save(function(err,appdata){
    	if(!err)
    		res.status(201).json(appdata)
    	else
    		console.log(err)
    })
    })

})
module.exports=router
