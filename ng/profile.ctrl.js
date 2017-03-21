angular.module('app')
.controller('ProfileCtrl',function($scope,UserSvc,$window){

	
		 $scope.getProfile= function(){
		 	UserSvc.getProfile($scope.currentUser._id).then(function(res)
		{
			console.log('profile-res',res)
			$scope.profile_username=res.data.username
			$scope.profile_email=res.data.email
			$scope.profile_mobile=res.data.mobile
			$scope.profile_dob=res.data.dob
			$scope.profile_tower=res.data.tower
			$scope.profile_manager=res.data.manager
		})
		 }
	
})