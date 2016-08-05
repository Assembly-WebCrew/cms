'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('watch', ['build'], function () {
  for (var i = 0; i < gulp.watchlist.length; i++) {
    var target = gulp.watchlist[i];
    $.util.log('Watching', $.util.colors.cyan(target.path), 'with tasks', $.util.colors.cyan(target.tasks));
    gulp.watch(target.path, target.tasks)
  }
});