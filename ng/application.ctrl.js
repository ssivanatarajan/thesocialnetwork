angular.module('app')
.controller('ApplicationCtrl', function ($scope,$window,UserSvc,AppsSvc) {
 
 if($window.localStorage && $window.localStorage.getItem('token'))
    {
      UserSvc.getUser($window.localStorage.token).then(function(response)
      {
      	UserSvc.currentUser=response.data
        $scope.currentUser=response.data
      	console.log($window.localStorage.token)
      console.log("remember",UserSvc.currentUser)
      })
      
    }
    else
    	console.log("no loggedin user")

  $scope.$on('login', function ( event,user) {
  	console.log("ApplicationCtrl" ,user)
    $scope.currentUser = user
    UserSvc.currentUser=user
     
     $window.location.href='./'
    //var res=JSON.stringify(user)
    //console.log("ApplicationCtrl res"+res.data);
    console.log("currentUser"+$scope.currentUser)
    console.log("ApplicationCtrl",user);
  })
  
  $scope.logout=function(){
  	UserSvc.logout()
  	$scope.currentUser="";
    UserSvc.currentUser="";
  	console.log("currentUser"+$scope.currentUser)
  	window.location.href='/#/login'
  }
})