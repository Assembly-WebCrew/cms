'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var args = require('yargs').argv;

var compileStylesheet = function (source) {
  var sassOptions = {
    includePaths: [
      './frontend/src/styles/assembly',
      './frontend/src'
    ]
  };

  var injectFiles = gulp.src([
    paths.src + '/styles/**/*.scss',
    paths.src + '/components/**/*.scss',
    '!' + paths.src + '/styles/assembly/variables.scss',
    '!' + paths.src + '/styles/assembly/main.scss',
    '!' + paths.src + '/styles/assembly/vendor.scss',
    '!' + paths.src + '/styles/assembly/vendor/**/*.*'
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath
        .replace(paths.src + '/styles/assembly/', '')
        .replace(paths.src + '/', '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// startinject',
    endtag: '// endinject',
    addRootSlash: false
  };

  var mainFilter = $.filter('main.scss');

  return gulp.src(source)
    .pipe($.if(source.indexOf('main.scss') > -1, mainFilter))
    .pipe($.if(source.indexOf('main.scss') > -1, $.inject(injectFiles, injectOptions)))
    .pipe($.if(source.indexOf('main.scss') > -1, mainFilter.restore()))
    .pipe($.sass(sassOptions)).on('error', gulp.handleError)
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer())
    .pipe($.if(args.production, $.csso()))
    .pipe($.sourcemaps.write('./'))
    .pipe($.size({title: 'styles', showFiles: gulp.showOutputFiles}))
    .on('error', gulp.handleError)
    .pipe(gulp.dest(paths.statics + '/assembly/styles/'));
};

gulp.task('styles', function () {
  return compileStylesheet(paths.src + '/styles/assembly/main.scss');
});

gulp.task('vendor-styles', function () {
  return compileStylesheet(paths.src + '/styles/assembly/vendor.scss');
});