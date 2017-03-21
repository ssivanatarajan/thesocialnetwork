angular.module('app')
.controller('LoginCtrl', function ($scope, UserSvc,$mdToast) {
  $scope.login = function (username, password) {
  	/* var message = '<strong>Well done!</strong> You successfully read this important alert message.';
    Flash.create('success', message);*/
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
      	//alert("invalid")
      	var message = '<strong> Oops!</strong>  Invalid Username or password.';

    	$('#Flash_message').css({'box-shadow':'0 0 30px black','text-align':'center','padding-top':'2px','padding-bottom':'2px'}).html(message).addClass('alert-danger').show().delay(30000).fadeOut();

    	//var id = Flash.create('danger', message, 0, { id: 'flash-msg-id'}, true);
        $scope.username=""
        $scope.password=""
        /*$mdToast.show(
                     $mdToast.simple()
                        .textContent('Invalid username or password').position('top right')                      
                        .hideDelay(5000))*/
       }
       else
       {
       	var message = '<strong> welcome!</strong>  successfully logged in.';
    	$('#Flash_message').html(message).addClass('alert-success').show().delay(30000).fadeOut();
    	
       }

    })
   
  }
 
$scope.forgotPassword=function(mobileNo)
{
	UserSvc.forgotPassword(mobileNo).then(function(response){
		console.log('forgot_pwd',response)
	},function(err)
	{
		console.log('forgot_pwd_err',err)
	})
}
 
})