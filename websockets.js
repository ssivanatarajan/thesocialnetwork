var ws=require('ws');
var _=require('lodash')
var clients=[]
exports.connect = function (server) {
  var wss = new ws.Server({server: server})
 //console.log("ws",server)
  wss.on('connection', function (ws) {
  	clients.push(ws)
    exports.broadcast('welcome to social network')
  })
  wss.on('close',function(ws){
  	_.remove(clients,ws)
  })
}

exports.broadcast=function(topic,data)
{
	var json=JSON.stringify({topic:topic,data:data})

	clients.forEach(function(client)
	{
		//console.log("client",client)
		console.log("data",json)
if(client.readyState === client.OPEN)
		client.send(json);
	})
}