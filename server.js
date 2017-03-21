var express = require('express')
var logger = require('morgan')
var websockets = require('./websockets')
var bodyParser = require('body-parser')
var flash 			= require('express-flash-notification')
var cookieParser	= require('cookie-parser')
var session			= require('express-session')
var app = express()

app.use(logger('dev'))
app.use(require('./controllers'))
app.use(bodyParser.json())
app.use(cookieParser('secret'))
app.use(session({secret: 'a4f8071f-c873-4447-8ee2',
   cookie: { maxAge: 2628000000 },
	resave: true, 
	saveUninitialized: true}))
app.use(flash())

var port = process.env.PORT || 3000
var server = app.listen(port, function () {
  console.log('Server', process.pid, 'listening on', port)
})
websockets.connect(server)
module.exports=app