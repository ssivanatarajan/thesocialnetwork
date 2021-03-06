angular.module('app').
controller('RegisterCtrl',function($scope,UserSvc,$window)
{
$scope.register=function(username,empId,password,mobile,email,dob)
{
	UserSvc.register(username,empId,password,mobile,email,dob).then(function(res)
	{
		console.log("reg",res);
		if(res.status==201)
		{
			var message = '<strong> Welcome!</strong>  successfully Registered.';
    	$('#Flash_message').html(message).addClass('alert-success').show().delay(30000).fadeOut();
    	
			

			/*$mdToast.show(
                     $mdToast.simple()
                        .textContent('successfully !').position('top right')                      
                        .hideDelay(5000))*/
			UserSvc.login(username,password).then(function(responseData){
				$scope.$emit('login', responseData.data)
				window.location.href='./'
			})
			//window.location.href='./#/login'


		}
	},
	function(err)
	{
		console.log("reg err",err)
	}
	)
}

$scope.checkAvailabilty=function(type,value)
{
	if(value && type)
	{
		UserSvc.checkAvailabilty(type,value).then(function(res)
	{
		
		if(res.data.type )
		{
			if(res.data.type=='username')
			{
				console.log('res.data.usernameAvilable',res.data.usernameAvilable)
				if(res.data.usernameAvilable)
					$scope.usernameAvailable=true;
				else 
					$scope.usernameAvailable=false;
			}
			else if(res.data.type=='mobile')
			{
				console.log('res.data.mobileNoAvilable',res.data.mobileNoAvilable)
				if(res.data.mobileNoAvilable)
					$scope.mobileNoAvailable=true;
				else 
					$scope.mobileNoAvailable=false;

			}
			else if(res.data.type=='email')
			{
				console.log('res.data.emailAvilable',res.data.emailAvilable)
				if(res.data.emailAvilable)
					$scope.emailAvailable=true;
				else 
					$scope.emailAvailable=false;
			}
		}
		
	},function(err)
	{
		console.log("checkavailabilty error",err)
	}

	)
	}
}


$scope.checkUsername=function(username){
	if(username)
	{
	UserSvc.checkUsername(username).then(function(res)
	{
		console.log('res',res)
		console.log('useranameAvilable',res.data.usernameAvilable)
		if(res.data.usernameAvilable)
		{
			$scope.usernameAvailable=true;
		}
		else 
		{
			$scope.usernameAvailable=false;
		}
	},function(err)
	{
		console.log("checkUsername error",err)
	}

	)
	}
	}
})