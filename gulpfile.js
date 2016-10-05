var gulp = require('gulp');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
var path = require('path');
var less = require('gulp-less');
var minifyCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
// var ngAnnotate = require('gulp-ng-annotate');
// var concat = require('gulp-concat')
//var babel = require('babelify');

gulp.task('browserify', function () {
    // Grabs the app.js file
    return browserify('./src/js/app.js', { debug: true })
        //.transform(babel, { presets: ['es2015'] })
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.min.js'))
        .pipe(streamify(uglify({ mangle: false }))) 
        // .pipe(buffer()) 
        // .pipe(uglify())
        // saves it the public/js/ directory
        .pipe(gulp.dest('public'));
});
// gulp.task('minify-js', function() {
//   return gulp.src('./public/main.min.js')
//     .pipe(concat('main.min.js'))
//     .pipe(ngAnnotate())
//     .pipe(uglify())
//     .pipe(gulp.dest('./public/dist'))
// });
gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['browserify'])
});

gulp.task('css', function () {
    return gulp.src('./src/css/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'src/css', 'includes') ]
    }))
    // .pipe(source('custom.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['watch']);