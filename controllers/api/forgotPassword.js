var router = require('express').Router()
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var config = require('../../config')
var speakeasy = require('speakeasy');

var twilio_client = require('twilio')(config.twilio_acc_sid, config.twilio_auth_token)
var ObjectID = require('mongodb').ObjectID;
/*var api_key = '6bc114a36130ce2ce1f1c149e03ea93f'
var from_who = 'ssivanatarajan@mailgun.com'*/
router.get('/',function(req,res,next){
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
        //socket.emit('update', {message: "Invalid phone number!"});*/
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
	
})
module.exports = router