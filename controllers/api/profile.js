var express=require('express')
var router = express.Router()
var ObjectID = require('mongodb').ObjectID;
var User=require('../../models/user')
var Tower=require('../../models/tower')
router.get('/',function(req,res,next){
	var userid=req.query.userid
	console.log('userprofile',userid)
	User.findOne({_id:new ObjectID(userid)},{username:1,email:1,mobile:1,dob:1,supportedBy:1,tower:1}).lean().exec(function(err,data){
		if(err)
			console.log(err)
		else if(data.tower)
		{
			console.log('data.tower',data.tower)
			Tower.findOne({_id:new ObjectID(data.tower)},{name:1,manager:1},function(err,tower_data){
				if(!err){
				console.log('towerdata',tower_data)
				data.tower=tower_data.name
				
				User.findOne({_id:new ObjectID(tower_data.manager)},{username:1},function(err,manager_data){
					if(!err){
						data.manager=manager_data.username
						console.log('data -manager',data)
						console.log('data.manager',data.manager)
						
					}
					else{
						data.manager='None'
						}
				})
				}
				else
				{
					data.manager='None'
				data.towername='None'
				}	
				
			})
		}
		else{
				data.manager='None'
				data.towername='None'
				}
		console.log('userprofile1',data)

		res.json(data)
	})
})


module.exports=router