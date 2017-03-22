angular.module('app')
.controller('ApplicationCtrl', function ($scope,$rootScope,$window,UserSvc) {
 
 if($window.localStorage && $window.localStorage.getItem('token'))
    {
      UserSvc.getUser($window.localStorage.token).then(function(response)
      {
      	UserSvc.setCurrentUser(response.data)
        $scope.currentUser=response.data
        //$rootScope.currentUser=response.data
      	console.log($window.localStorage.token)
      console.log("remember",UserSvc.CurrentUser)
      })
      
    }
    else
    	console.log("no loggedin user")

  $scope.$on('login', function ( event,user) {
  	console.log("ApplicationCtrl" ,user)
    $scope.currentUser =user
    UserSvc.setCurrentUser(user)
     $rootScope.currentUser=user
     $window.location.href='./'
     $window.localStorage.setItem('currentUser',user);
    //var res=JSON.stringify(user)
    //console.log("ApplicationCtrl res"+res.data);
    console.log("currentUser",UserSvc.CurrentUser)
    console.log("ApplicationCtrl",user);
  })
  
  $scope.logout=function(){
  	UserSvc.logout()
  $scope.currentUser="";
    UserSvc.setCurrentUser(null)
  	console.log("currentUser",UserSvc.CurrentUser)
  	window.location.href='/#/login'
  }
})