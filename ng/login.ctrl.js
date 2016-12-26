angular.module('app')
.controller('LoginCtrl', function ($scope, UserSvc,$mdToast) {
  $scope.login = function (username, password) {
    UserSvc.login(username, password)
    .then(function (response) {
    	//var res=angular.fromJson(response);
    	console.log("login ctrl res",response)
    	//var res=JSON.stringify(response)
    	 console.log("LoginCtrl  ", response.data );

    	 	
    	 	//var json=JSON.parse(response);
    	//console.log("LoginCtrl data"+json.data);
      $scope.$emit('login', response.data)  
      
    },function(response){
    	console.log("LoginCtrl err"+response);
    	console.log("LoginCtrl err"+response.data);
      console.log("LoginCtrl err"+response.status);
      if(response.status==401)
      {
        $scope.username=""
        $scope.password=""
        $mdToast.show(
                     $mdToast.simple()
                        .textContent('Invalid username or password').position('top right')                      
                        .hideDelay(5000))
      }
    })
   
  }

 
})