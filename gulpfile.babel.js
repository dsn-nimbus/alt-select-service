import gulp from 'gulp';
import uglify from 'gulp-uglify';
import coveralls from 'gulp-coveralls';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import {Server as Karma} from 'karma';
import babel from 'gulp-babel';
import cssmin from 'gulp-cssmin';

const _coverage = 'coverage/**/lcov.info';
const _scripts = 'src/**/*.js';
const _styles = 'src/**/*.css';
const _script = 'alt-select-service.js';
const _style = 'alt-select-service.css';
const _dist = 'dist';

gulp.task('build', ['build_js', 'build_css'])

gulp.task('build_js', ['unit_test'], function () {
  return gulp.src(_scripts)
    .pipe(concat(_script.toLowerCase()))
    .pipe(gulp.dest(_dist))
    .pipe(babel({
             presets: [
               "es2015",
               "babili"
             ]
           }))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(_dist));
})

gulp.task('build_css', function () {
  return gulp.src(_styles)
    .pipe(concat(_style.toLowerCase()))
    .pipe(gulp.dest(_dist))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(_dist));
})

gulp.task('unit_test', function (done) {
  return new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['Chrome']
  }, (exitCode) => done(exitCode)).start();
})

gulp.task('coverage', ['unit_test'], function () {
  return gulp.src(_coverage)
             .pipe(coveralls());
})
