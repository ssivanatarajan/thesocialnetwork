var mongoose=require("mongoose");
mongoose.Promise = global.Promise;
/*mongoose.connect('mongodb://siva:siva@ds145148.mlab.com:45148/eiger', function () {
  console.log('mongodb connected')
});*/
mongoose.connect('mongodb://siva:siva@ds060009.mlab.com:60009/postit', function () {
  console.log('mongodb postit connected')
});


/*mongoose.connect('mongodb://localhost/social', function () {
  console.log('mongodb connected')
});*/
module.exports = mongoose;