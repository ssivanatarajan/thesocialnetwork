var express=require('express')
var router = express.Router()
var bodyParser = require('body-parser')
/*var flash 			= require('express-flash-notification')
var cookieParser	= require('cookie-parser')
var session			= require('express-session')*/
router.use(bodyParser.json())
router.use(require('../auth'))
router.use('/api/posts', require('./api/posts'))
router.use('/api/sessions', require('./api/sessions'))
router.use('/api/users', require('./api/users'))
router.use('/api/forgotPassword',require('./api/forgotPassword'))
router.use('/api/profile',require('./api/profile'))
router.use('/api/towers',require('./api/towers'))
router.use('/api/apps',require('./api/apps'))
router.use(require('./static'))


module.exports = router