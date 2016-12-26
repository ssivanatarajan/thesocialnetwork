var router = require('express').Router()
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var config = require('../../config')

var ObjectID = require('mongodb').ObjectID;
/*var api_key = '6bc114a36130ce2ce1f1c149e03ea93f'
var from_who = 'ssivanatarajan@mailgun.com'*/
router.get('/:checkAvailabilityType',function (req,res,next) {
  // body...
  var checkType=req.params.checkAvailabilityType
   if(checkType)
  {
    
    var value=req.query.value
    console.log(checkType)
   if(checkType=='username')
   {
    User.find({username:value}).count(function(err,count)
    {
      if(err)
      {
        
        console.log("checkUsername"+err);
      return next(err) }
      console.log('userCount',count)
    if(count>0)
    {
      console.log('checkUsername',value+" is  available")
      
      res.send({"type":"username","usernameAvilable":false})
     }
     else
     {
      console.log('checkUsername',value+" is  available")
        res.send({"type":"username","usernameAvilable":true})
     }


    })
	}
	else if(checkType=='mobile')
	{
		User.find({mobile:value}).count(function(err,count)
    {
      if(err)
      {
        
        console.log("checkmobile"+err);
      return next(err) }
      console.log(' checkmobile userCount',count)
    if(count>0)
    {
      console.log('checkmobile',value+" is not available")
      
      res.send({"type":"mobile","mobileNoAvilable":false})
     }
     else
     {
      console.log('checkmobile',value+" is  available")
        res.send({"type":"mobile","mobileNoAvilable":true})
     }
	})

	}
else if(checkType=='email')
	{
		User.find({email:value}).count(function(err,count)
    {
      if(err)
      {
        
        console.log("checkemail"+err);
      return next(err) }
      console.log(' checkemail userCount',count)
    if(count>0)
    {
      console.log('checkemail',value+" is not available")
      
      res.send({"type":"email","emailAvilable":false})
     }
     else
     {
      console.log('checkemail',value+" is  available")
        res.send({"type":"email","emailAvilable":true})
     }
	})

	}

}
  
})

/*router.get('/?userid',function(req,res,next)
{
  var userid=req.param('userid')
  return  User.find({_id:userid},{username:1})
})*/

router.get('/', function (req, res, next) {
  var userid=req.param('userid')
 // console.log('userid',userid)
 if(userid)
{
  console.log('userid',userid)
 // var o_userid = new mongo.ObjectID(userid);
  User.findOne({_id:new ObjectID(userid)},{username:1},function(err,doc){
    console.log('username',doc.username)
    res.json(doc);
  })
  
  
}
else
{
if (!req.headers['x-auth']) {
    return res.send(401)
  }
  else
  {
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  User.findOne({username: auth.username}, function (err, user) {
    if (err) { 
      console.log("user error"+err);
      return next(err) }
      console.log("user data"+user);
      //console.log("user data q"+user.username);
    res.status(200).json(user)
  })

}
}
 
})


router.post('/', function (req, res, next) {
  console.log("reg post",req.body.mobile)

  var user = new User({username: req.body.username,email:req.body.email,mobile:req.body.mobile,dob:req.body.dob})
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
    if (err) { console.log(err) }
    user.password = hash
    user.save(function (err) {
      if (err) { console.log(err) }
        else{
          console.log('registered successfully')
          res.send(201)
    }
    })
  })
})
})

module.exports = router