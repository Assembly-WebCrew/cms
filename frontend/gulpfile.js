'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var paths = gulp.paths = {
  src: 'src',
  statics: '../statics',
  templates: '../templates',
};

gulp.watchlist = [
  { path: [
      paths.src + '/scripts/**/*.js',
      paths.src + '/components/**/*.js'
    ], tasks: ['scripts']
  },
  { path: 'bower_components/**/*.js', tasks: ['vendor-scripts'] },
  { path: [
      paths.src + '/styles/**/*.scss',
      paths.src + '/components/**/*.scss',
      '!' + paths.src + '/styles/**/vendor.scss'
    ], tasks: ['styles']
  },
  { path: paths.src + '/styles/**/vendor.scss', tasks: ['vendor-styles', 'styles'] },
  { path: paths.src + '/templates/**/*.html', tasks: ['templates'] },
  { path: paths.src + '/components/**/*.html', tasks: ['angular-templates'] }
];

gulp.showOutputFiles = true;

gulp.handleError = function (error) {
  $.util.log($.util.colors.red('Error'), error.message);
};

require('require-dir')('./gulp');

gulp.task('default', ['watch']);