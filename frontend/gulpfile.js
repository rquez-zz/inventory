const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('browserify', () => {
    return browserify('./app/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('../backend/public/js/'));
});

gulp.task('watch', () => {
    gulp.watch('./app/**/*.js', ['browserify']);
    gulp.watch('./sass/style.sass', ['sass']);
    gulp.watch('./public/index.html', ['index']);
});

gulp.task('default', ['index', 'sass', 'browserify', 'watch']);

gulp.task('fonts', () => {
    return gulp
        .src('./node_modules/bootstrap-sass/assets/fonts/**/*')
        .pipe(gulp.dest('../backend/public/fonts/'));
});

gulp.task('index', () => {
    return gulp
        .src('./public/index.html')
        .pipe(gulp.dest('../backend/public/'));
});

gulp.task('sass', ['fonts'], () => {
    return gulp.src('./sass/*.sass')
        .pipe(sass({
            includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'], 
            errLogToConsole:true,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('../backend/public/css/'));
});
