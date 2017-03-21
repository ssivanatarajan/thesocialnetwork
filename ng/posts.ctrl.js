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
        userid=$scope.currentUser._id;
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