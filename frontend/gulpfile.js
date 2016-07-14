const gulp = require('gulp');
const sass = require('gulp-sass');
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
    gulp.watch('./app/**/*.js', ['browserify']);
    gulp.watch('./sass/style.sass', ['sass']);
});

gulp.task('default', ['connect', 'watch']);

gulp.task('fonts', () => {
    return gulp
        .src('./node_modules/bootstrap-sass/assets/fonts/**/*')
        .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('sass', ['fonts'], () => {
    return gulp.src('./sass/*.sass')
        .pipe(sass({
            includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'], 
            errLogToConsole:true,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});
