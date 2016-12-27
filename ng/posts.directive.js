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
      var username=UserSvc.currentUser.username;
		PostsSvc.addComment(post._id,post.newComment,userid,username).then(function(res){
 			console.log(res)
 			if(res.data.msg=='comment posted successfully')
 			{
 				if(!angular.isDefined(post.comments))
 					post.comments=[]
 				var cmnt={'comment':post.newComment,'commentedby_id':userid,'commentedby_name':username}
 				post.comments.unshift(cmnt)
 				post.newComment=''
 			}
 			
		})
}
  }
  /*$scope.auto_grow= function (msg,$event) {
  	//console.log('element',element)
  	element=event.target
  	console.log(element.attributes)
  	element.attributes.rows='2'
    /*element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}*/

}
	return directive
});