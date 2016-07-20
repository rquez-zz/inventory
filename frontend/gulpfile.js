const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const merge = require('merge-stream');

gulp.task('browserify', () => {
    return browserify('./app/main.js')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('../backend/public/js/'));
});

gulp.task('watch', () => {
    gulp.watch('./app/**/*.js', ['browserify']);
    gulp.watch('./sass/style.sass', ['sass']);
    gulp.watch('./index.html', ['index']);
    gulp.watch('./views/*.html', ['views']);
    gulp.watch('./views/partials/*.html', ['partials']);
});

gulp.task('default', ['index', 'views', 'partials', 'css', 'browserify', 'watch']);

gulp.task('index', () => {
    return gulp
        .src('./index.html')
        .pipe(gulp.dest('../backend/public/'));
});

gulp.task('views', () => {
    return gulp
        .src('./views/*.html')
        .pipe(gulp.dest('../backend/public/views/'));
});

gulp.task('partials', () => {
    return gulp
        .src('./views/partials/*.html')
        .pipe(gulp.dest('../backend/public/views/partials/'));
});

gulp.task('css', () => {
    const cssStream = gulp.src(
            ['./node_modules/angular-material/angular-material.css',
            './node_modules/angular-material-data-table/dist/md-data-table.css']
        ).pipe(concat('./css-files.css'));

    return merge(cssStream)
        .pipe(concat('style.css'))
        .pipe(gulp.dest('../backend/public/css/'));
});
