const gulp = require('gulp');
const sass = require('gulp-sass');
const exec = require('gulp-exec');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const merge = require('merge-stream');

gulp.task('start', () => {
  const options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
  };

  const reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true, // default = true, false means don't write stdout
  };

  return gulp.src('./*')
    .pipe(exec('npm start', options))
    .pipe(exec.reporter(reportOptions))
  ;
});

gulp.task('scss', () => {
  const scssStream = gulp.src(['./scss/mixins.scss', './scss/colours.scss', './scss/**/**/*.scss'])
    .pipe(concat('main.scss'))
    .pipe(sass())
    .pipe(concat('main.scss'))
    ;

  return merge(scssStream)
    .pipe(concat('main.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./public/css'))
  ;
});

gulp.task('watch', ['scss'], () => {
  gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('default', ['start', 'watch']);
