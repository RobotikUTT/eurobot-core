var gulp       = require('gulp');
var babel      = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require('gulp-plumber');
var changed    = require('gulp-changed');
var nodemon    = require('gulp-nodemon');


gulp.task('build', function () {
    return gulp.src(['src/**/*.js', '!src/controlPanel/public/**/*.js'])
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
    return gulp.src('src/controlPanel/public/**')
        .pipe(changed('build/controlPanel/public'))
        .pipe(gulp.dest('build/controlPanel/public'));
});

gulp.task('dev', ['build', 'copy'], function() {
    gulp.watch('src/controlPanel/public/**', ['copy']);

    nodemon({
      script: 'build/main.js',
      tasks: ['build'],
      watch: 'src',
      ignore: 'src/controlPanel/public/'
    })
});


gulp.task('default', ['build', 'copy']);