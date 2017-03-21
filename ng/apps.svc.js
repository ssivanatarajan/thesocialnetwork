angular.module('app')
.service('AppsSvc',function($http,$window){
	
	console.log('AppsSvc')
	this.getTowers=function()
	{
		return $http.get('api/towers').then(function(data)
		{
			console.log('getTowers',data)
			return data;
		},function(err){
			console.log('getTowers',err)
		})
	}

	this.addApplication=function(appname,alias,category,tower)
	{
		return $http.post('api/apps',{appname:appname,alias:alias,category:category,tower:tower}).then(function(res){
			return res
			
		},function(err){
			console.log('addapp-err',err)
		}
		)
	}
})