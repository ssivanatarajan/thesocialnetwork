var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var config = require('../../config')

router.post('/', function (req, res, next) {
  console.log('sessions post',req.body.username)
  User.findOne({username: req.body.username})
  .select('password').select('username')
  .exec(function (err, user) {
    if (err) { return next(err) }
    if (!user) { 
      //req.flash('warning','invalid username')
      console.log('login','no user')
      return res.send(401) }
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) { return next(err) }
      if (!valid) {
        //req.flash('warning','invalid username or password')
          console.log('uservalid','false');
       return res.send(401) }
      var token = jwt.encode({username: user.username}, config.secret)
      res.send(token)
    })
  })
})

module.exports = router