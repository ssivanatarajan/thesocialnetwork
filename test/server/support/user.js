var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var config = require('../../../config')
var User = require('../../../models/user')

exports.create = function (username, password, cb) {
  var user = new User({username: username})
  
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(username, salt, function(err, hash) {
    if (err) { return next(err) }
    user.password = hash
    user.save(function (err) {
      if (err) { return next(err) }
        user.token = jwt.sign({username: user.username}, config.secret)
      cb(null, user)
    })
  })
})
  
}