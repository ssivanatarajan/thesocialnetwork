angular.module('app')
.service('UserSvc', function ($http,$window) {
  var svc = this
  
  svc.CurrentUser;
  svc.getUser = function (auth) {
    $http.defaults.headers.common['X-Auth'] = auth
    return $http.get('/api/users').then(function(val){
      console.log("user svc get",val);

      return val;
    })
  }

  svc.getProfile=function(userid)
  {
    console.log('get','profile')
    return $http.get('api/profile',{params:{userid:userid}}).then(function(val){
      console.log('profile',val);
      console.log('profile',val.data);
      return val

    },function(err){
      console.log('profile',err);
    })
  }////
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
     //svc.CurrentUser=svc.getUser(svc.token)
    //console.log("svc.CurrentUser",svc.CurrentUser)
      return svc.getUser(svc.token);
    })
  }
   svc.register=function(username,empId,password,email,mobile,dob)
    {
      console.log("user Svc Reg")
    return $http.post('/api/users',{username:username,empId:empId,password:password,email:email,mobile:mobile,dob:dob}).then(function(val){
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

svc.forgotPassword=function(mobileNo)
{
  return $http.get('/api/forgotPassword',{params:{mobileNo:mobileNo}}).then(function(val){
    console.log('val',val)
  },function(err){
    console.log('err',err)
  })
}
svc.getCurrentUser=function()
{
  console.log("getCurrentUser",svc.CurrentUser);
  return svc.CurrentUser
 }
 svc.setCurrentUser=function(currentuser)
 {
  console.log("setCurrentUser",currentuser);
  svc.CurrentUser=currentuser;
 }

})