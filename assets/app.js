angular.module('app', 
	['ngRoute','ngMaterial','ngAria','ng','ngAnimate']
	);
angular.module('app')
.controller('ApplicationCtrl', function ($scope,$window,UserSvc) {
 
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
angular.module('app').controller('PostsCtrl', function ($scope,$rootScope,$filter,$q,PostsSvc,UserSvc) {
var userid
console.log('UserSvc in postctrl',UserSvc.currentUser)
if(UserSvc.currentUser){
   userid=UserSvc.currentUser._id;
	console.log('userid from UserSvc',userid)
}
if($scope.currentUser)
{
	userid=$scope.currentUser._id;
	console.log('userid from scope',userid)
}
$scope.$on('ws:new_post', function (_, post) {
  $scope.$apply(function () {
    post.username=$scope.currentUser.username;
    console.log('post.username', post.username);
    $scope.posts.unshift(post)
    console.log('web socket',post)
  })
})


/*$scope.auto_grow= function (msg,$event) {
  	//console.log('element',element)
  	element=event.target
  	
    element.style.height = "10px";
    element.style.height = (element.scrollHeight)+"px";
}*/
/*$scope.$on('ws:new_comment',function(_,comment){
	$scope.$apply(function(){
		comment.username=$scope.currentUser.username;
		var post=$filter('filter')($scope.posts,{_id:comment.postID},true)[0];
		var commentedPostIndex=$scope.posts.indexOf(post)
		
		var cmnt={}
		cmnt.comment=comment.comment;
		cmnt.commentedby=comment.commentedby;
		if($scope.posts[commentedPostIndex].comments==undefined)
			{	console.log('comments','undefined')
			$scope.posts[commentedPostIndex].comments=[]
		}
		var modposts=$scope.posts
		modposts[commentedPostIndex].comments.unshift(cmnt)
		console.log('commentedPost',$scope.posts[commentedPostIndex])
		//$scope.posts[commentedPostIndex]=commentedPost;
		$scope.posts=modposts

	})
})*/
      // the function runs when the "Add Post" button is clicked
      $scope.addPost = function () {

        // Only add a post if there is a body
        console.log('userid',userid)
      if($scope.postBody)
        PostsSvc.create({
      userid: userid,
      body: $scope.postBody
    }).success(function (post) {
     // $scope.posts.unshift(post)
      $scope.postBody = null
    }).error(function(err){
      console.log(err);
    })
      }


//no longer required .. refer post.directive
     /* $scope.like=function(post)
      {
        
        //console.log(postID)
     /*   PostsSvc.like({postID:post._id,likedBY:userid}).then(function(res){
          console.log('res-like',res);
          console.log('res-like',res.data.msg);
          if(res.data.msg=='liked'){
            post.isliked='True'
            console.log('post','post is liked')
          }
          else
          {
            post.isliked='False'
            console.log('post','post is unliked')
          }

        })

      likestats()
      }
      $scope.likestats= function()
      {
      PostsSvc.likesstats(post._id,userid).then(function(res,err){
        	
        	if(err)
        		console.log('likesstats-err',err)
        	else
        		console.log('likesstatshf',res);
        })
  }*/

  PostsSvc.fetch()
	.success(function (posts) {
  	
    console.log('posts',posts)
   var modifiedPosts=[];
    //for (var i=0; i < posts.length; i++) {
      var promises=[];
      posts.forEach(function(post){
        //var post=posts[i];
        console.log('userid',post.userid)
      promises.push( UserSvc.getUsername(post.userid).then(function(res){
          var username=res.username;
          post.username=username;
          console.log('username',username);  
        }))
      console.log('userid',userid)
      if(userid !== undefined){
       promises.push( PostsSvc.getIsLiked(post._id,userid).then(function(res){
          console.log('postsvc-getIsLiked'+post._id,res.data.isliked);
          if(res.data.isliked=='True')
            {console.log('post like','true')
            post.isliked='True'
          }
          else
          {
            post.isliked='False'
            console.log('post like','false')
          }
          modifiedPosts.push(post)
          console.log('modify-post',post)
        }))
       promises.push(PostsSvc.likesstats(post._id,userid).then(function(likesstatsRes){
       	console.log('likesstats',likesstatsRes);
        	post.likes=likesstatsRes.data.noOfLikes
        	var LikedBY=''
        	if(likesstatsRes.data.recentlyLikedUserName !=='none')
        		LikedBY=likesstatsRes.data.recentlyLikedUserName
        	if(likesstatsRes.data.youLiked==='liked')
        		LikedBY='You'
        	 
        	if(LikedBY.length > 0){
        		var noOfLikes=parseInt(likesstatsRes.data.noOfLikes)-1
        		if(noOfLikes>0)
        			LikedBY+=' and '+noOfLikes+' others liked '
        	}
        	post.LikedBY=LikedBY
        		console.log('post obj res',post.likes +' '+post.LikedBY)
       }))
   }
        
})
      $q.all(promises).then(function(){
        if(userid !== undefined){
         console.log('modifiedposts',modifiedPosts)
        
        $scope.posts = modifiedPosts
        console.log('posts',$scope.posts)
      }
      })
     
      //  console.log('username',data.value);  
        /*console.log('post',posts[i])
        console.log('postid',posts[i]._id)
        console.log('post',posts[i].body)*/
        
    /*for(post in $scope.posts)
    {
      var p=post[0]
      
    }*/
}).error(function(e){
	alert(e);
})

});
angular.module('app').directive('postitem',function(){
 var directive ={}
 directive.scope = {postdata:'@',like :'&',comment:'&'}
 /*directive.template= '<ul class="list-group" >\
      <li class="list-group-item borderless"> <strong>@{{ postObj.username }}</strong></li>\
        <li class="list-group-item borderless"><span>{{ postObj.body +" "+ postObj._id}}</span></li>\
       	 </ul>\
'*/

	directive.templateUrl ='postitem.html'

	
	//directive.template='<div>{{obj.username}}</div>'
	directive.replace='true'
	directive.link= function(scope, element, attrs) {
		scope.postObj = eval('(' + scope.postdata + ')');
	  console.log('directive link',scope.postObj)
	  console.log(scope)
	  console.log(attrs)
	  
	}
  directive.controller=function($scope,$element,UserSvc,PostsSvc){
  	var userid=UserSvc.currentUser._id;
  	$scope.like=function(post)
      {
       
        //console.log(postID)
        PostsSvc.like({postID:post._id,likedBY:userid}).then(function(res){
          console.log('res-like',res);
          console.log('res-like',res.data.msg);
          if(res.data.msg=='liked'){
            post.isliked='True'
            console.log('post','post is liked')
          }
          else
          {
            post.isliked='False'
            console.log('post','post is unliked')
          }
           PostsSvc.likesstats(post._id,userid).then(function(likesstatsRes){
        	
        	console.log('likesstats',likesstatsRes);
        	post.likes=likesstatsRes.data.noOfLikes
        	var LikedBY=''
        	if(likesstatsRes.data.recentlyLikedUserName !='none')
        		LikedBY=likesstatsRes.data.recentlyLikedUserName
        	
        	if(likesstatsRes.data.youLiked==='liked')
        		LikedBY='You'
        	console.log('LikedBY',LikedBY)
        	if(LikedBY.length > 0){
        		var noOfLikes=parseInt(likesstatsRes.data.noOfLikes)-1
        		if(noOfLikes>0)
        			LikedBY+=' and '+noOfLikes+' others liked '
        		

        	}

        	post.LikedBY=LikedBY
        		console.log('post obj res',post.likes +' '+post.LikedBY)

   })
        })
        
        
        
        //$scope.$apply()
      }
      $scope.showorhideComments=function(post)
      {
      	if( (!angular.isDefined(post.showComments)) || post.showComments =='False')
      		post.showComments='True'
      	else 
      		post.showComments='False'
      	console.log('showorhideComments',post.showComments)

      }
    $scope.addComment=function(post)
	{
		console.log('comment','comment clicked')
		console.log('post.newComment',post.newComment)
    if(post.newComment)
    {
		PostsSvc.addComment(post._id,post.newComment,userid).then(function(res){
 			console.log(res)
 			if(res.data.msg=='comment posted successfully')
 			{
 				if(!angular.isDefined(post.comments))
 					post.comments=[]
 				var cmnt={'comment':post.newComment,'commentedby':userid}
 				post.comments.unshift(cmnt)
 				post.newComment=''
 			}
 			
		})
}
  }
  $scope.auto_grow= function (msg,$event) {
  	//console.log('element',element)
  	element=event.target
  	console.log(element.attributes)
  	element.attributes.rows='2'
    /*element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";*/
}

}
	return directive
});
 angular.module('app').service('PostsSvc', function ($http) {
  this.fetch = function () {
    return $http.get('/api/posts');
  }
  this.create=function(post)
  {
    return $http.post('/api/posts',post);
  }
  this.like=function(likedpost)
  {
  	console.log('likedpost',likedpost)
  	return $http.post('/api/posts',likedpost)
  	/*return $http({
    url: "api/posts/",
    method: "POST",
    params: likedpost
    })*/
  }
  this.getIsLiked=function(postid,userid)
  {
    return $http.get('api/posts',{params:{userid:userid,postid:postid}})/*.then(function(val){
      
       console.log('postsvc -isliked',val.data);
      return val.data;
    })*/
  }
  this.addComment=function(postid,comment,userid){
    return $http.post('api/posts/'+postid+'?comment='+comment+'&userId='+userid).then(function(commentRes,err){
      if(err)
        console.log('err',err)
      else
      {
        console.log('commentRes',commentRes)
      
      return commentRes
}
    })
  }

  this.likesstats=function(postid,userid)
  {
    console.log('likesstats','in')
  return  $http.get('api/posts/'+postid+'?userId='+userid).then(function (val,err) {
      // body...
      if(err)
        console.log('like-stats',err)
      else{
        console.log('res',val)
        return val
      }
    })
  }
});
angular.module('app').
controller('RegisterCtrl',function($scope,UserSvc,$window,$mdToast)
{
$scope.register=function(username,password,mobile,email,dob)
{
	UserSvc.register(username,password,mobile,email,dob).then(function(res)
	{
		console.log("reg",res);
		if(res.status==201)
		{
			$mdToast.show(
                     $mdToast.simple()
                        .textContent('successfully !').position('top right')                      
                        .hideDelay(5000))
			window.location.href='./#/login'


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
angular.module('app')
.service('UserSvc', function ($http,$window) {
  var svc = this
  
  svc.CurrentUser=null
  svc.getUser = function (auth) {
    $http.defaults.headers.common['X-Auth'] = auth
    return $http.get('/api/users').then(function(val){
      console.log("user svc get",val);

      return val;
    })
  }

  svc.getUsername=function(userid)
  {
    return $http.get('/api/users',{params:{userid:userid}}).then(function(val){
      console.log('username-usersvc',val.data);
      return val.data;
    })
  }
  svc.login = function (username, password) {
    return $http.post('/api/sessions', {
      username: username, password: password
    }).then(function (val) {
      console.log("UserSvc post",val);
      svc.token = val.data
      
      //console.log("return "+ svc.getUser())
     $window.localStorage.setItem('token',svc.token)
      return svc.getUser(svc.token)
    })
  }
   svc.register=function(username,password,email,mobile,dob)
    {
      console.log("user Svc Reg")
    return $http.post('/api/users',{username:username,password:password,email:email,mobile:mobile,dob:dob}).then(function(val){
      console.log("user reg",val)
      return val

    })
  }
  svc.logout=function(){
    svc.token=""
    $window.localStorage.clear()
  }
svc.checkAvailabilty=function(type,value)
{
  console.log("checkUsername",type+' '+value)
  return $http.get('api/users/'+type+'?value='+value).then(function (val) {
    // body...
    return val
  },

  function (error) {
    // body...
    console.log(error)
  })
}

})
angular.module('app')
.run(function ($rootScope, $timeout) {
  (function connect() {
    var url = 'ws://192.168.43.44:3000'
    var connection = new WebSocket(url)
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