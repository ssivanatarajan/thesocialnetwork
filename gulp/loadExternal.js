var gulp   = require('gulp')

var inject = require('gulp-inject');

gulp.task('loadExternal', function () {
  var target = gulp.src('./layouts/app.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./external files/**/*.js', './external files/**/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./layouts'));
});

gulp.task('watch:loadExternal',['loadExternal'],function () {
	// body...
	gulp.watch('/external files/**/*.js',['loadExternal'])
	gulp.watch('/external files/**/*.css',['loadExternal'])
})