var gulp = require('gulp');
var merge = require('gulp-merge');
var webpack = require("gulp-webpack");
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var del = require("del");

var webpackConfigApp = {
    output: {
        filename: 'app.js',
    }
};
var webpackConfigOpt = {
    output: {
        filename: 'options.js',
    }
};

// Deletes the compiled js files
gulp.task('clean', () => {
    return del(
        ['src/**/*.js.map', 'src/*.js'],
        { force: true }
    );
});

// Deletes the contents of the dist folder
gulp.task('clean-dist', () => {
    return del('dist/**/*', { force: true });
});

gulp.task('package-app', ['clean-dist'], () => {
    return gulp.src('src/app.js')
        .pipe(webpack(webpackConfigApp))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('package-opts', ['clean-dist'], () => {
    return gulp.src('src/options.js')
        .pipe(webpack(webpackConfigOpt))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

// Combines and minifies the js for release
gulp.task('package', ['clean-dist', 'package-app', 'package-opts']);

// Copies all supporting files to dist
gulp.task('copy-files', ['clean-dist', 'package'], () => {
    function copyFilesToDist(path, file) {
        return gulp.src('src/' + path + file)
                //.pipe(debug({ title: "Copying " }))
                .pipe(gulp.dest('dist/' + path));
    }
    
    return merge(
        //copyFilesToDist('scripts/', '*.js'),
        copyFilesToDist('images/', '*.*'),
        copyFilesToDist('./', '*.min.css'),
        copyFilesToDist('./', 'manifest.json'),
        copyFilesToDist('./', 'background.js'),
        gulp.src('src/index.html')
            // Inject version and update app.js script tag
            .pipe(replace('<script src="scripts/require.js" data-main="./app"></script>', `<script src="app.js?v=${new Date().getTime()}"></script>`))
            .pipe(gulp.dest('dist/')),
        gulp.src('src/options.html')
            // Inject version and update options.js script tag
            .pipe(replace('<script src="scripts/require.js" data-main="./options"></script>', `<script src="options.js?v=${new Date().getTime()}"></script>`))
            .pipe(gulp.dest('dist/'))
        );
});

gulp.task('release', ['clean-dist', 'package', 'copy-files']);

gulp.task('default', ['release']);
