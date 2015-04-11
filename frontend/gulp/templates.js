'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var args = require('yargs').argv;

gulp.task('templates', function () {
  return gulp.src(paths.src + '/templates/**/*.html')
    .pipe($.size({title: 'templates', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.templates + '/'))
});