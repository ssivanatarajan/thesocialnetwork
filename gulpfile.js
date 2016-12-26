var gulp = require('gulp')


gulp.task('welcome', function () {
  console.log('welcome to gulp!')
})

gulp.task('hello', ['welcome'], function () {
  console.log('hello world')
})



var fs = require('fs')
fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
	console.log(task)
  require('./gulp/' + task)
})

gulp.task('dev', ['watch:css', 'watch:js','dev:server'])