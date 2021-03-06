'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const nightwatch = require('gulp-nightwatch');
const ignore = require('gulp-ignore');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const del = require('del');

gulp.task('nightwatch', () => {
  gulp.src('')
    .pipe(plumber())
    .pipe(nightwatch({
      configFile: 'nightwatch.conf.js'
    }));
});

gulp.task('nightwatch:w', ['nightwatch'], () => {
  gulp.watch(['{./,}.bundles/**/*.js', '{./,}test-{e2e,nightwatch}/**/*.js'], ['nightwatch']);
});



// gulp.task('tsc:rxjs', () => {
//   const tsProject = ts.createProject('tsconfig.json', { noExternalResolve: true });
//   return tsProject.src()
//     .pipe(plumber())
//     .pipe(ignore.include(['{./,}test-rxjs/**/*.ts']))
//     // .pipe(ignore.exclude(['{./,}test-rxjs/spec/**/*.ts']))
//     .pipe(ts(tsProject))
//     .pipe(babel())
//     .pipe(gulp.dest('.'));
// });


const rxjsSpecJS = '{./,}.bundles/webpack.bundle.spec.rxjs.js';

gulp.task('mocha:rxjs', [], () => {
  gulp.src(rxjsSpecJS)
    .pipe(plumber())
    // gulp-mocha needs filepaths so you can't have any plugins before it 
    .pipe(mocha({
      useColors: true,
      reporter: 'spec'
    }));
});

gulp.task('mocha:rxjs:w', ['mocha:rxjs'], () => {
  gulp.watch([rxjsSpecJS], ['mocha:rxjs']);
});



////////////////////////////////////////////////////////////////////////////////
// Build for deploy

gulp.task('clean', () => {
  return del(['.awcache', '.dest', '*.log', 'npm-debug.log.*']);
});

const copyFiles = [
  './public/*.{html,css,js}',
  './node_modules/core-js/client/shim.min.js',
  './node_modules/babel-polyfill/dist/polyfill.min.js',
  './node_modules/firebase/firebase-app.js',
  './node_modules/firebase/firebase-auth.js'
];

gulp.task('copy', ['clean'], () => {
  return gulp.src(copyFiles)
    .pipe(gulp.dest('./.dest'));
});

gulp.task('copy:w', [], () => {
  return gulp.src(copyFiles)
    .pipe(gulp.dest('./.dest'));
});

gulp.task('build', ['copy']);

gulp.task('build:w', [], () => {
  gulp.watch([copyFiles], ['copy:w']);
});
