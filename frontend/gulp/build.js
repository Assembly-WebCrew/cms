'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/images/**/*')
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.dest + '/static/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.dest + '/static/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.dest + '/static/'));
});

gulp.task('clean', function (callback) {
  $.del([
    '.sass-cache',
    paths.dest + '/static/assembly/**/*.*',
    paths.dest + '/templates/assembly/**/*.*'
  ], {force: true}, callback)
});

gulp.task('assets', ['images', 'fonts', 'misc']);

gulp.task('build', ['assets', 'vendor-scripts', 'scripts', 'vendor-styles', 'styles', 'templates']);