const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const connect = require('gulp-connect');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('connect', () => {
    connect.server({
        root: 'public',
        port: 4000
    });
});

gulp.task('browserify', () => {
    return browserify('./app/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', () => {
    gulp.watch('app/**/*.js', ['browserify']);
    gulp.watch('sass/style.sass', ['sass']);
});

gulp.task('default', ['connect', 'watch']);

gulp.task('sass', () => {
    return sass('sass/style.sass')
        .pipe(gulp.dest('public/css'));
});
