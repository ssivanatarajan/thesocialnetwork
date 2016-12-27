var mongoose=require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://siva:siva@ds145148.mlab.com:45148/eiger', function () {
  console.log('mongodb connected')
});
/*mongoose.connect('mongodb://localhost/social', function () {
  console.log('mongodb connected')
});*/
module.exports = mongoose;