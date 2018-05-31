
var gulp = require('gulp'),
  less = require('gulp-less'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }),
  autoprefixer = require('gulp-autoprefixer'),
  lesshint = require('gulp-lesshint'),
  cssmin = require('gulp-cssmin'),
  stylelint = require('gulp-stylelint'),
  postcss = require('postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  runSequence = require('run-sequence'),
  del = require('del'),
  replace = require('gulp-string-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  exec = require('child_process').exec,
  ngc = require('gulp-ngc'),
  changed = require('gulp-changed'),
  path = require('path'),
  util = require('gulp-util'),
  shell = require('gulp-shell'),
  runSequence = require('run-sequence')

var appSrc = 'src';
var libraryDist = 'dist';
var watchDist = 'dist-watch';

// copies files to the libraryDist directory.
function copyToDist(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length); // save directly to dist
    }));
}

// copies files from the libraryDist to the watchDist.
function updateWatchDist() {
  return gulp
    .src(libraryDist + '/**')
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}
function transpileLESS(src, debug) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [
                path.join('src/assets/stylesheets/shared/'),
                path.join('node_modules/'),
                path.join('node_modules/patternfly/dist/less/'),
                path.join('node_modules/patternfly/node_modules/')],
    }).on('error', function (err) {
      console.log(err);
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin().on('error', function(err) {
      console.log(err);
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length);
    }));
    combined.on('error', console.error.bind(console));
    return combined;
}
function minifyCSS(file) {
  try {
    var minifiedFile = stylus.render(file);
    minifiedFile = postcss([autoprefixer]).process(minifiedFile).css;
    minifiedFile = csso.minify(minifiedFile).css;
    return minifiedFile;
  } catch (err) {
    console.log(err);
  }
}

/*
 * Tasks
 */

// Stylelint task for build process
gulp.task('lint-less', function lintLessTask() {
  return gulp
  .src('src/**/*.less')
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{
      formatter: 'string', console: true
    }]
  }));
});

// Stylelint task for npm script - uses verbose format for error messages
gulp.task('stylelint', function lintLessTask() {
  return gulp
  .src('src/**/*.less')
  .pipe(stylelint({
    failAfterError: true,
    reporters: [{
      formatter: 'verbose', console: true
    }]
  }));
});

// FIXME: why do we need that?
// replaces templateURL/styleURL with require statements in js.
gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/src/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the less-file was
    }));
});

// Transpile and minify less, storing results in libraryDist.
gulp.task('transpile-less', ['lint-less'], function () {
  return transpileLESS([
    appSrc + '/**/*.less',
    '!src/demo/**/*.less'
  ]);
});

// transpiles the ts sources to js using the tsconfig.
gulp.task('transpile', ['transpile-less'], function () {
  return ngc('tsconfig.json')
});

// copies the template html files to libraryDist.
gulp.task('copy-html', function () {
  return copyToDist([
    'src/**/*.html',
    '!src/demo/**/*.html',
    '!src/demo.html'
  ]);
});

// copies images to libraryDist.
gulp.task('copy-images', function () {
  return copyToDist([
    'src/assets/images/**/*.*'
  ]);
});

// require transpile to finish before copying the css
gulp.task('copy-css', ['transpile'], function () {
  return copyToDist([
    'src/**/*.css',
    '!src/demo/**/*.css'
  ]);
});

// copies the static asset files to libraryDist.
gulp.task('copy-static-assets', function () {
  return gulp.src([
    'LICENSE',
    'README.adoc',
    'package.json',
  ]).pipe(gulp.dest(libraryDist));
});

gulp.task('bundle', shell.task('npm run bundle-webpack'));

gulp.task('build:library',
[
  'post-transpile',
  'copy-html',
  'copy-images',
  'bundle',
  'copy-static-assets'
]);

gulp.task('copy-watch', ['post-transpile'], function () {
  return updateWatchDist();
});

gulp.task('copy-watch-all', ['build:library'], function () {
  return updateWatchDist();
});

gulp.task('watch', ['copy-watch-all'], function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Compiling.');
    runSequence(
       'post-transpile'
    );

  });
  gulp.watch([appSrc + '/app/**/*.less']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    runSequence(
      'post-transpile',
      'bundle'
    );
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    runSequence(
      'copy-html',
      'bundle'
    );
  });
  util.log('Now run');
  util.log('');
  util.log(util.colors.red('    npm link', path.resolve(watchDist), ' --production'));
  util.log('');
  util.log('in the npm module you want to link this one to');
});
