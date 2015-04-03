'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var args = require('yargs').argv;

gulp.task('scripts', function () {
  return gulp.src(paths.src + '/scripts/**/*.js')
    .pipe($.if(args.production, $.uglify()))
    .pipe($.concat('main.js'))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.dest + '/static/assembly/scripts/'))
});

gulp.task('vendor-scripts', function () {
  return gulp.src(require('main-bower-files')())
    .pipe($.if(args.production, $.uglify()))
    .pipe($.concat('vendor.js'))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.dest + '/static/assembly/scripts/'));
});