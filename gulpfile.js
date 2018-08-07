var gulp = require('gulp');
var merge = require('gulp-merge');
var webpack = require("gulp-webpack");
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var del = require("del");

var webpackConfig = {
    output: {
        filename: 'app.js',
    }
};

// Deletes the compiled js files
gulp.task('clean', function() {
    return del(
        ['src/**/*.js.map', 'src/*.js'],
        { force: true }
    );
});

// Deletes the contents of the dist folder
gulp.task('clean-dist', function() {
    return del('dist/**/*', { force: true });
});

// Combines and minifies the js for release
gulp.task('package', ['clean-dist'], function () {
    gulp.src('src/options.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
    return gulp.src('src/app.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

// Copies all supporting files to dist
gulp.task('copy-files', ['clean-dist', 'package'], function () {
    function copyFilesToDist(path, file) {
        return gulp.src('src/' + path + file)
                //.pipe(debug({ title: "Copying " }))
                .pipe(gulp.dest('dist/' + path));
    }
    
    return merge(
        copyFilesToDist('scripts/', '*.js'),
        copyFilesToDist('images/', '*.*'),
        copyFilesToDist('./', 'app.min.css'),
        gulp.src('src/index.html')
            // Inject version and update app.js script tag
            .pipe(replace('<script src="scripts/require.js" data-main="./app"></script>', '<script src="app.js?{version}></script>'))
            .pipe(replace('{version}', 'v=' + new Date().getTime()))
            .pipe(gulp.dest('dist/'))
        );
});

gulp.task('release', ['clean-dist', 'package', 'copy-files']);

gulp.task('default', ['release']);
