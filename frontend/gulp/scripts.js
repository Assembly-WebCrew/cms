'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var args = require('yargs').argv;

gulp.task('scripts', function () {
  return gulp.src([
      paths.src + '/scripts/**/*.js',
      paths.src + '/components/**/*.js'
    ])
    .pipe($.if(args.production, $.uglify()))
    .pipe($.concat('main.js'))
    .pipe($.size({title: 'scripts', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/assembly/scripts/'));
});

gulp.task('vendor-scripts', function () {
  return gulp.src(require('main-bower-files')({filter: '**/*.js'}))
    .pipe($.if(args.production, $.uglify()))
    .pipe($.concat('vendor.js'))
    .pipe($.size({title: 'vendor-scripts', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/assembly/scripts/'));
});