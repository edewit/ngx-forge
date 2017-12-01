
var gulp = require('gulp'),
  less = require('gulp-less'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
  lesshint = require('gulp-lesshint'),
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
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length); // save directly to dist
    }));
}

// copies files from the libraryDist to the watchDist.
function updateWatchDist() {
  return gulp
    .src(libraryDist + '/**')
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}
// transpiles a given LESS source set to CSS, storing results to libraryDist.
function transpileLESS(src, debug) {
  var opts = {
   // paths: [ path.join(__dirname, 'less', 'includes') ], //THIS NEEDED FOR REFERENCE
  }
  return gulp.src(src)
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(lesshint({
      configPath: './.lesshintrc' // Options
    }))
    .pipe(lesshint.reporter()) // Leave empty to use the default, "stylish"
   .pipe(lesshint.failOnError()) // Use this to fail the task on lint errors
    .pipe(sourcemaps.init())
    .pipe(less(opts))
    //.pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length);
  }));
 }

// FIXME: why do we need that?
// replaces templateURL/styleURL with require statements in js.
gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/app/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the less-file was
    }));
});

// Transpile and minify less, storing results in libraryDist.
gulp.task('transpile-less', function () {
  return transpileLESS(appSrc + '/**/*.less');
});

// transpiles the ts sources to js using the tsconfig.
gulp.task('transpile', function () {
  return ngc('tsconfig.json')
});

// copies the template html files to libraryDist.
gulp.task('copy-html', function () {
  return copyToDist([
    'src/**/*.html'
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
  'transpile',
  'post-transpile',
  'transpile-less',
  'copy-html',
  'bundle',
  'copy-static-assets'
]);

gulp.task('copy-watch', ['post-transpile'], function () {
  return updateWatchDist();
});

gulp.task('copy-watch-all', ['build:library'], function () {
  return updateWatchDist();
});

gulp.task('watch', ['build:library', 'copy-watch-all'], function (c) {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Compiling.');
    runSequence('transpile',
                 'post-transpile',
                 'copy-watch',
                 c);

  });
  gulp.watch([appSrc + '/app/**/*.less']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    runSequence('transpile-less',
    'bundle',
    'copy-watch',
    c);
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    runSequence('copy-html',
    'bundle',
    'copy-watch',
    c);
  });
  util.log('Now run');
  util.log('');
  util.log(util.colors.red('    npm link', path.resolve(watchDist)));
  util.log('');
  util.log('in the npm module you want to link this one to');
});
