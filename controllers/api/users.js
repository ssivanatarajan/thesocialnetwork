var express=require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var Counter = require('../../models/counter')
var config = require('../../config')

var speakeasy = require('speakeasy');

var twilio_client = require('twilio')(config.twilio_acc_sid, config.twilio_auth_token)
var ObjectID = require('mongodb').ObjectID;

/*var flash 			= require('express-flash-notification')
var cookieParser	= require('cookie-parser')
var session			= require('express-session')
var app=express()
app.use(cookieParser('secret'))
app.use(session({secret: 'a4f8071f-c873-4447-8ee2',
   cookie: { maxAge: 2628000000 }}))
app.use(flash(app))*/
//var app=express()

/*var api_key = '6bc114a36130ce2ce1f1c149e03ea93f'
var from_who = 'ssivanatarajan@mailgun.com'*/
/*router.get('/forgotPassword/:mobileNo',function(req,res,next){
	console.log('forgot_pwd','in')
	var mobileNo=req.params.mobileNo

	var code = speakeasy.totp({key: 'abc123'});
	User.find({mobile:mobileNo}).count(function(err,count){
		if(count==1)
		twilio_client.sendSms({
        to: mobileNo,
        from: config.twilio_no,
        body: 'OTP for reset the password: ' + code
    }, function(twilioerr, responseData) {
      if (twilioerr) { 
      	console.log('twilioerr',twilioerr)
       //user.remove({'mobile':mobile_no}, function(remerr) {if (remerr) { throw remerr; }});
        //socket.emit('update', {message: "Invalid phone number!"});
      } else {
      	console.log('code','code_generated')
      	 console.log('registered successfully')
         //res.send(201)
        //socket.emit('code_generated');
        User.findOne({mobile:mobileNo},function(err,user){
        	if(!err)
        	{
        		user.resetPasswordOTP=code
        		user.resetPasswordOTPExpires=new Date() +3600000
        		user.save()
			}
        })
      }
    });
		else if(count==0)
			;
})
	
})*/

router.get('/:checkAvailabilityType',function (req,res,next) {
  // body...
 


  var checkType=req.params.checkAvailabilityType
   if(checkType)
  {
    
    var value=req.query.value
    console.log('checkType',checkType)
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
function counter(counterName) {
var ret = Counter.findOneAndUpdate({name:counterName}, {$inc : {next:1}},function(err,d){
// ret == { “_id” : “users”, “next” : 1 }
console.log(d.next)
return d.next;
})
}

router.post('/', function (req, res, next) {

  console.log("reg post",req.body.mobile)
  var code = speakeasy.totp({key: 'abc123'});
  var mobile_no=req.body.mobile
  var user = new User({username: req.body.username,empId:req.body.empId,email:req.body.email,mobile:mobile_no,dob:req.body.dob})
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
    if (err) { console.log(err) }
    user.password = hash

   // user.userId=counter('Users')
    console.log('userid',user.userId)
    Counter.findOneAndUpdate({name:'Users'}, {$inc : {next:1}},function(err,d){
      
        user.userId=d.next
      user.save(function (err) {
       if (err) { console.log(err) }
       /* else{
        twilio_client.sendSms({
        to: mobile_no,
        from: config.twilio_no,
        body: 'Your verification code  is: ' + code
    }, function(twilioerr, responseData) {
      if (twilioerr) { 
      	console.log('twilioerr',twilioerr)
       user.remove({'mobile':mobile_no}, function(remerr) {if (remerr) { throw remerr; }});
        //socket.emit('update', {message: "Invalid phone number!"});
      }*/ else {
      	console.log('code','code_generated')
      	 console.log('registered successfully')
      	console.log('saved userid',user.userId)
        res.send(201)
        //socket.emit('code_generated');
      }
    })
    });
         
    
    })
  })

})

module.exports = router