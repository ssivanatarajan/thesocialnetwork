angular.module('app')
.run(function ($rootScope, $timeout) {
  (function connect() {
    var url = 'ws://192.168.43.44:3000'
    var connection = new WebSocket(url)
    connection.onclose = function (e) {
      console.log('WebSocket closed. Reconnecting...')
      $timeout(connect, 10*1000)
    }
    connection.onmessage = function (e) {
      var payload = JSON.parse(e.data)
      console.log('ws:onmessage',e.data)
      $rootScope.$broadcast('ws:' + payload.topic, payload.data)
    }
  })()
})