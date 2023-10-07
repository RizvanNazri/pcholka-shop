//подключение ранее установленных пакетов, которые записаны в package.json
//общие
const gulp = require('gulp');                               // подключаем gulp

//html
const fileInclude = require('gulp-file-include');           // подключаем плагин для объединения файлов друг с другом (html- файлы header footer в index.html)

//sass
const sass = require('gulp-sass')(require('sass'));         // подключаем плагины для обработки файлов scss
const sassGlob = require('gulp-sass-glob');                 // плагин для сборки всех scss файлов из указанной папки в один файл


const server = require('gulp-server-livereload');           // подключаем плагин для live-server
const resultClean = require('gulp-clean');                  // подключаем плагин для удаления папки с результатом
const sourceMaps = require('gulp-sourcemaps');              // плагин для отображения исходных путей в инспекторе
const plumber = require('gulp-plumber');                    // помогает избежать зависания сборки во время возникновения ошибок
const notify = require('gulp-notify');                      // оповещает о возникновении тех или иных ошибок
const changed = require('gulp-changed');                    // плагин для перезаписи только тех файлов, в которые внесены изменения, а также новых файлов

//images
const imagemin = require('gulp-imagemin');                  // плагин для сжатия картинок

//подключение прочих модулей и объектов
const fs = require('fs');                                   // подлючаем из node.js модуль для работы с файловой системой
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: 'title',
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
};                                                          // указываем параметры оповещений для плагина plumber
const webpack = require('webpack-stream');                  // подключение webpack

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// задачи

// задача для удаления папки с результатом
gulp.task('resultClean:dev', function(done){
    if(fs.existsSync('./build')) {
        return gulp.src('./build', {read: false})
            .pipe(resultClean({force: true}));
    }
    done();                                                 
});

// задача для файлов html
gulp.task('html:dev', function(){
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', {hasChanged: changed.compareContents}))
        .pipe(plumber(plumberNotify('html')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
});

// задача для обработки файлов scss
gulp.task('sass:dev', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css'))
        .pipe(plumber(plumberNotify('scss')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sourceMaps.write())
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
});

//  задача для обработки изображений
gulp.task('images:dev', function(){
    return gulp.src('./src/images/**/*.*')
        .pipe(changed('./build/images'))
        //.pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./build/images'))
});

//  задача для копирования шрифтов
gulp.task('copyFonts:dev', function(){
    return gulp.src('./src/fonts/**/*.*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
});

//  задача для копирования прочих файлов
gulp.task('copyFiles:dev', function(){
    return gulp.src('./src/files/**/*.*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'))
});

//  задача для обработки js
gulp.task('js:dev', function(){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberNotify('js')))
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./build/js/'))
});

// задача для live-server
gulp.task('liveServer:dev', function(){
    return gulp.src('./build')
        .pipe(server({
            livereload: true,
            open: true
        }))
});

// задача для отслеживания изменений в исходных файлах
gulp.task('watch:dev', function(){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/images/**/*.*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*.*', gulp.parallel('copyFonts:dev'));
    gulp.watch('./src/files/**/*.*', gulp.parallel('copyFiles:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});