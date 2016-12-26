angular.module('app')
.run(function ($rootScope, $timeout) {
  (function connect() {
    var HOST = location.origin.replace(/^http/, 'ws')
    
    var connection = new WebSocket(HOST)
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