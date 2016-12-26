angular.module('app')
.config(function($routeProvider, $locationProvider )
{
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
$routeProvider.when('/',{controller:'PostsCtrl',templateUrl:'posts.html'})
.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
.when('/login',{controller:'LoginCtrl',templateUrl:'login.html'});

})