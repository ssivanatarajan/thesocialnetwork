var Post = require('../../models/post')
var router = require('express').Router()
var websocket=require('../../websockets')
var ObjectID = require('mongodb').ObjectID;
var User=require('../../models/user')


//getting likestats
router.get('/:postId',function(req,res,next)
{
  var postID=req.params.postId
  var userID=req.query.userId
  console.log('getting likestats')
  console.log('UserID',userID)
  console.log('postID',postID)
  var youlikedflag,likes,recentlyliked_userid,recentlyliked_username;
 Post.find({$and:[{likedBY: userID},{_id:new ObjectID(postID)}]}).count(function(err,count){
    if(count>0){
       youlikedflag=true
       console.log('youliked',youlikedflag)
     }
     Post.findOne({_id:new ObjectID(postID)},{likes:1,_id:0},function(err,likesCount){
      if(!err){
       likes=likesCount.likes
       console.log('likescount',likes)
       //console.log('likescount',likesCount.likes)
      }
       Post.aggregate([{$match:{_id:new ObjectID(postID)}},{$project:{LikedBy: { $slice: [ "$likedBY", -1 ] },_id:0}}]).exec(function(err,likedBy_userid){
     if(!err)
    {
      console.log('likedBy_userid',likedBy_userid[0])

    if(likedBy_userid[0].LikedBy!=null)
    {
     recentlyliked_userid=likedBy_userid[0].LikedBy[0]
      console.log('recentlyliked_userid',recentlyliked_userid)
      //console.log('recentlyliked_userid',recentlyliked_userid.LikedBy[0])
  }
    }
    else
      console.log(err)

    if(recentlyliked_userid !== undefined && recentlyliked_userid.length>0 && recentlyliked_userid !=userID){
     User.findOne({_id:new ObjectID(recentlyliked_userid)},{username:1},function(err,userObj){
    
    if(!err)
    {
    recentlyliked_username=userObj.username;
    console.log('recentlyliked_username',recentlyliked_username)
  }
  else
    console.log(err)
  console.log('likes -res',likes)

      if(youlikedflag)
        youLiked='liked'
      else
        youLiked='notliked'
       console.log('recentlyliked_username1',recentlyliked_username)
    if(recentlyliked_username == undefined)
    recentlyliked_username='none'
  res.json({'youLiked':youLiked,'noOfLikes':likes.toString(),recentlyLikedUserName:recentlyliked_username})

   
    })
      }
   else{
      if(youlikedflag)
        youLiked='liked'
      else
        youLiked='notliked'
      recentlyliked_username='none'
    res.json({'youLiked':youLiked,'noOfLikes':likes.toString(),recentlyLikedUserName:recentlyliked_username})
    }
    })
   }) 

  }) 

  


   
  

  //res.json({'msg':'liked-stats'})
  //'recentlyLikedUserName':recentlyliked_username})
})

//fetching posts
router.get('/', function (req, res, next) {
  var userid=req.param('userid')
  var postid=req.param('postid')
  console.log('posts','get'+userid+' '+postid)
//islike method
  if(postid)
  {
    Post.find({$and:[{likedBY: userid},{_id:new ObjectID(postid)}]}).count(function(err,count){

      console.log('likedcount',count)
      if(count>=1)
      {
        console.log('isliked',postid+ ' '+userid+'true')
         res.json({'isliked':'True'});

      }
      else if(count==0)
         res.json({'isliked':'False'});
       if(err)
          console.log('liked error',err)
    })
  }
else{
/*Post.aggregate([
{ $project:{_id:1,userid:1,body:1,likes:1,likedBy:1,date:1,numofLikes:{ "$ifNull": [  [],"$likedBy" ] }},
  },
{$sort:{date:-1}}

  ]).exec(function(err,posts){
    if(!err)
    {
     console.log('posts',posts)
      res.json(posts)
    }
    else
    {
      console.log(err)
    }
  });
  */



 Post.find()
  .sort('-date')
  .exec(function(err, posts) {
    if (err) { return next(err)
console.log(err);
     }

    res.json(posts)
  })
}
})



router.post('/', function (req, res, next) {
 var postID=req.body.postID;
 console.log('post-id',postID)
//like or unlike post
 if(postID)
 {
var likedBY=req.body.likedBY;
Post.find({$and:[{likedBY: likedBY},{_id:new ObjectID(postID)}]}).count(function(err,count){
    
    //like the post
    if(count==0)
    {

      Post.update({ _id : postID},{$inc:{'likes':1},$push:{'likedBY':likedBY}},function(err,data){
    
      if(err)
      {
       console.log(err)
      }
      else
      {
        res.json({'msg':'liked'})
        console.log('liked')
      }
    })
    }
    //unlike the post
    else if(count>0)
    {
      Post.update({ _id : postID},{$inc:{'likes':-1},$pull:{'likedBY':likedBY}},function(err,data){
    
      if(err)
      {
       console.log(err)
      }
      else
      {
        res.json({'msg':'unliked'})
        console.log('unliked')
      }
    })
    }
  })

 }
else{


 console.log('post',req.body.userid)
  var post = new Post({
    userid: req.body.userid,
    body: req.body.body
  })
  console.log("post"+req);
  post.save(function (err, post) {
    if (err) { return next(err) }
     websocket.broadcast('new_post',post) 
    res.status(201).json(post);
  })
}
})


//add comment
router.post('/:postId',function(req,res,next)
{
  var postID=req.params.postId;
  var commentedBy_Id=req.query.userId;
  var commentedBy_Name=req.query.userName;
  var comment=req.query.comment
  console.log('addcomment in',postID +' '+commentedBy_Id+''+ commentedBy_Name+' '+comment )
Post.update({ _id : postID},{$push:{comments:{ 'comment':comment,'commentedby_id':commentedBy_Id,'commentedby_name':commentedBy_Name,'date':new Date()}}},function(err,data){
  if(err){
    console.log(err)
    res.json({'msg':'unable to post comment'})
  }
  else
    { 
    // websocket.broadcast('new_comment',{'postID':postID,'comment':comment,'commentedby':commentedBy})
    res.json({'msg':'comment posted successfully'})
  }
})

  //var likes=Post.find({ "_id" : postID},{'likes':1,'_id':0,'username':0,'body':0,'date':0})
 // var likes=Post.find({ "_id" : postID},{'likes':1})
 // console.log('likes',likes);  

  })

module.exports = router