'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/images/**/*')
    .pipe($.size({title: 'images', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/images/'));
});

gulp.task('fonts', function () {
  return gulp.src('./bower_components/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.flatten())
    .pipe($.size({title: 'fonts', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe($.size({title: 'misc', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/'));
});

gulp.task('clean', function (callback) {
  $.del([
    '.sass-cache',
    paths.statics + '/assembly/**/*.*',
    paths.templates + '/assembly/**/*.*'
  ], {force: true}, callback)
});

gulp.task('assets', ['images', 'fonts', 'misc']);

gulp.task('build', ['assets', 'vendor-scripts', 'scripts', 'vendor-styles', 'styles', 'templates']);