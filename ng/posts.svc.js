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
  this.addComment=function(postid,comment,userid,username){
    return $http.post('api/posts/'+postid+'?comment='+comment+'&userId='+userid+'&userName='+username).then(function(commentRes,err){
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