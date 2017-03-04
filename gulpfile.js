const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const process = require('process');
const gutil = require('gulp-util');
const webpack = require('webpack');
const clean = require('gulp-clean');
const packager = require('electron-packager');
const childProcess = require('child_process');
const convertNewline = require("gulp-convert-newline");

const packageInfo = require('./package.json');
const webpackConfig = require('./webpack.config.js');

const APP_NAME = packageInfo.name;

gulp.task('clean', function (callback) {
    gulp.src(['./app', './build'], {read: false})
        .pipe(clean());
    callback();
});

gulp.task('copy', function () {
    gulp.src(['./src/browser.js', './src/app.config.js', './src/*.html'])
        .pipe(gulp.dest('./app'));
    gulp.src(['./src/assets/*', './src/assets/*/**', '!./src/assets/scripts/*.sh'])
        .pipe(gulp.dest('./app/assets'));
    gulp.src(['./package.json']).pipe(gulp.dest('./app'));
    gulp.src(['./node_modules/electron-sudo/src/bin/*', './node_modules/electron-sudo/src/bin/*/**'])
        .pipe(gulp.dest('./app/bin'));
    gulp.src('./src/assets/scripts/*.sh')
        .pipe(convertNewline())
        .pipe(gulp.dest('./app/assets/scripts'));
});

gulp.task('webpack', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({ modules: false, colors: true }));
        callback();
    });
});

gulp.task('sass', function () {
    gulp.src('./src/sass/main.scss')
        .pipe(
            sass({
                includePaths: [path.join(__dirname, './src/sass')],
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(gulp.dest('./app'));
});

gulp.task('build', ['copy', 'sass', 'webpack']);

const deleteUselessFiles = function (platform, distPath) {
    let filesToBeRemoved = [];
    switch (platform) {
        case 'win32':
            filesToBeRemoved = [
                '*.html',
                'LICENSE',
                'version',
                'pdf.dll',
                'locales/*.*',
                'xinput1_3.dll',
                'd3dcompiler.dll',
                'vccorlib120.dll',
                'snapshot_blob.bin',
                'd3dcompiler_47.dll',
                './resources/default_app',
                'ui_resources_200_percent.pak',
                'content_resources_200_percent.pak',
            ];
            break;
        case 'darwin':
            filesToBeRemoved = [
                '*.html',
                'LICENSE',
                'version',
                '/' + APP_NAME + '.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/snapshot_blob.bin',
            ];
            break;
        case 'linux':
            filesToBeRemoved = [
                '*.html',
                'LICENSE',
                'version',
                'locales/*.*',
                'snapshot_blob.bin',
                './resources/default_app',
            ];
            break;
    }
    filesToBeRemoved = filesToBeRemoved.map((file) => {
        return path.join(distPath, file);
    });
    console.log('Removed unnecessary files.');
    return gulp.src(filesToBeRemoved).pipe(clean());
};

const compressFiles = function (platform, distPath, callback) {
    let upx = '';
    let filesToBeCompressed = [];
    switch (platform) {
        case 'win32':
            upx = path.join(__dirname, 'tools/upx.exe')
            filesToBeCompressed = [
                'node.dll',
                'libEGL.dll',
                'msvcr120.dll',
                'msvcp120.dll',
                'libGLESv2.dll',
                APP_NAME + '.exe',
            ];
            break;
        case 'darwin':
            upx = path.join(__dirname, 'tools/upx');
            break;
        case 'linux':
            upx = path.join(__dirname, 'tools/upx-' + process.arch);
            filesToBeCompressed = [
                APP_NAME,
                'libnode.so',
            ];
            break;
    }
    console.log('Compressing executables...');
    filesToBeCompressed.forEach((file) => {
        const fullPath = path.join(distPath, file);
        childProcess.exec(upx + ' -9 ' + fullPath, function (error, stdout, stderr) {
            if (error) {
                gutil.log(error);
            }
            gutil.log(stdout, stderr);
        });
    });
};

const buildPackage = function (platform, arch, callback) {
    let icon;
    switch (platform) {
        case 'win32':
            icon = './app/assets/images/icon.ico';
            break;
        case 'darwin':
            icon = './app/assets/images/icon.icns';
            break;
        default:
            icon = './app/assets/images/icon.png';
            break;
    }
    packager({
        arch: arch,
        icon: icon,
        dir: './app',
        out: './build',
        name: APP_NAME,
        version: '0.36.2',
        platform: platform,
    }, function (err, appPath) {
        if (appPath) {
            const distPath = appPath[0];
            callback && callback(platform, arch, distPath);
        }
    });
};

const afterPackage = function (platform, arch, distPath) {
    deleteUselessFiles(platform, distPath);
    compressFiles(platform, distPath);
};

gulp.task('package', ['build'], function (callback) {
    gulp.src('./app/*.map').pipe(clean());
    if (process.arch !== 'ia32') {
        buildPackage(process.platform, process.arch, afterPackage);
    }
    if (process.platform !== 'darwin') {
        buildPackage(process.platform, 'ia32', afterPackage);
    }
});

gulp.task('package-uncompressed', ['build'], function (callback) {
    gulp.src('./app/*.map').pipe(clean());
    if (process.arch !== 'ia32') {
        buildPackage(process.platform, process.arch);
    }
    if (process.platform !== 'darwin') {
        buildPackage(process.platform, 'ia32');
    }
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch(['./src/js/**/*.*',
                './src/app.config.js'], ['webpack']);
    gulp.watch(['./src/*.html',
                './package.json',
                './src/browser.js',
                './src/assets/**/*.*',
                './src/app.config.js',
                './node_modules/electron-sudo/**'], ['copy']);
});

gulp.task('default', ['build']);
