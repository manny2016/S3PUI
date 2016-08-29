var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
//var babel = require('babelify');

gulp.task('browserify', function () {
    // Grabs the app.js file
    return browserify('./src/js/app.js', { debug: true })
        //.transform(babel, { presets: ['es2015'] })
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.min.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['browserify'])
});

gulp.task('default', ['watch']);