var gulp   = require('gulp')
var stylus = require('gulp-stylus')
var inject = require('gulp-inject');
gulp.task('css', function () {
  gulp.src('css/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('assets'))

})


 


gulp.task('watch:css', ['css'],function () {
  gulp.watch('css/**/*.styl', ['css'])
})

