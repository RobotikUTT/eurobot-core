var gulp       = require('gulp');
var babel      = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require('gulp-plumber');
var changed    = require('gulp-changed');
var nodemon    = require('gulp-nodemon');


var FRONTEND_SRC  = 'src/controlPanel/public/**';
var BACKEND_SRC   = ['src/**/*.js', '!' + FRONTEND_SRC];
var PROTOCOLS_SRC = 'src/communication/protocols/*.json';

gulp.task('build', function () {
    return gulp.src(BACKEND_SRC)
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(changed('build'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('copy', function() {
    return gulp.src(FRONTEND_SRC)
        .pipe(changed('build/controlPanel/public'))
        .pipe(gulp.dest('build/controlPanel/public'));
});

gulp.task('protocols', function() {
    return gulp.src(PROTOCOLS_SRC)
        .pipe(changed('build/communication/protocols'))
        .pipe(gulp.dest('build/communication/protocols'));
});

gulp.task('dev', ['build', 'copy', 'protocols'], function() {
    gulp.watch(BACKEND_SRC, ['build']);
    gulp.watch(FRONTEND_SRC, ['copy']);

    nodemon({
      script: 'build/main.js',
      watch: 'build'
    });
});

gulp.task('default', ['build', 'copy', 'protocols']);
