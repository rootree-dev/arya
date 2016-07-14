var gulp = require("gulp")
var babel = require("gulp-babel")
var uglify = require("gulp-uglify")

var paths = {
  scripts: "./arya.js",
  dst: "./dist"
}

gulp.task("scripts", function() {
  return gulp.src(paths.scripts)
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dst))
})

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
})

gulp.task("default", ["scripts"])
