angular.module('app')
.config(function($routeProvider, $locationProvider )
{
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
$routeProvider.when('/',{controller:'PostsCtrl',templateUrl:'posts.html'})
.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
.when('/login',{controller:'LoginCtrl',templateUrl:'login.html'})
.when('/forgotPassword',{controller:'LoginCtrl',templateUrl:'forgotPassword.html'})
.when('/profile',{controller:'ProfileCtrl',templateUrl:'profile.html'})
.when('/addApps',{controller:'AddAppsCtrl',templateUrl:'addApps.html'});


})