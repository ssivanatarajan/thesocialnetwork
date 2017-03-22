angular.module('app').controller('PostsCtrl', function ($window,$scope,$rootScope,$filter,$q,PostsSvc,UserSvc) {

var userid;

$scope.$on('ws:new_post', function (_, post) {
  $scope.$apply(function () {
  	UserSvc.getUsername(post.userid).then(function(res){
          var username=res.username;
          post.username=username;
          console.log('username',username);  
          console.log('post.username', post.username);
    		$scope.posts.unshift(post)
    		console.log('web socket',post)
        })

    
    
  })
})


      // the function runs when the "Add Post" button is clicked
      $scope.addPost = function () {

        // Only add a post if there is a body
    //    userid=$scope.currentUser._id;
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
$scope.init=function(){
//console.log("current user loc",$window.localStorage.getItem('currentUser'))
console.log("currentUser UserSvc",UserSvc.getCurrentUser())
//console.log("currentUser rootscope",$rootScope.currentUser)
 userid=UserSvc.getCurrentUser()

console.log('UserSvc userid',userid)
}
  PostsSvc.fetch()
	.success(function (posts) {
  	//$scope.posts=posts;
  	$scope.init();
    console.log('posts',posts)
   var modifiedPosts=[];
   
      var promises=[];
      posts.forEach(function(post){
       
        console.log('userid',post.userid)
      promises.push( UserSvc.getUsername(post.userid).then(function(res){
          var username=res.username;
          post.username=username;
          console.log('post username',username);  
        }))
      console.log('userid',userid)
      if(userid !== undefined){
       promises.push( PostsSvc.getIsLiked(post._id,userid).then(function(res){
          console.log('postsvc-getIsLiked'+post._id,res.data.isliked);
          if(res.data.isliked=='True')
            {//console.log('post like','true')
            post.isliked='True'
          }
          else
          {
            post.isliked='False'
           // console.log('post like','false')
          }
          modifiedPosts.push(post)
          //console.log('modify-post',post)
        }))
       promises.push(PostsSvc.likesstats(post._id,userid).then(function(likesstatsRes){
       	//console.log('likesstats',likesstatsRes);
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
        
         console.log('modifiedposts',modifiedPosts)
        
        $scope.posts = modifiedPosts
        console.log('posts',$scope.posts)
      
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