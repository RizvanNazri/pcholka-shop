//подключение ранее установленных пакетов, которые записаны в package.json
//общие
const gulp = require('gulp');                               // подключаем gulp
//html
const fileInclude = require('gulp-file-include');           // подключаем плагин для объединения файлов друг с другом (html- файлы header footer в index.html)
const htmlclean = require('gulp-htmlclean');                // минификация файла html
const webpHTML = require('gulp-webp-html');                 // подключение автоматической конвертации картинок в webp в html файлах

//sass
const sass = require('gulp-sass')(require('sass'));         // подключаем плагины для обработки файлов scss
const sassGlob = require('gulp-sass-glob');                 // плагин для сборки всех scss файлов из указанной папки в один файл
const autoprefixer = require('gulp-autoprefixer');          
const csso = require('gulp-csso');                          // минификация файла css
const webpCss = require('gulp-webp-css');                   // подключение автоматической конвертации картинок в webp в css файлах

//разное
const server = require('gulp-server-livereload');           // подключаем плагин для live-server
const resultClean = require('gulp-clean');                  // подключаем плагин для удаления папки с результатом
const sourceMaps = require('gulp-sourcemaps');              // плагин для отображения исходных путей в инспекторе
const plumber = require('gulp-plumber');                    // помогает избежать зависания сборки во время возникновения ошибок
const notify = require('gulp-notify');                      // оповещает о возникновении тех или иных ошибок
const changed = require('gulp-changed');                    // плагин для перезаписи только тех файлов, в которые внесены изменения, а также новых файлов
const groupMedia = require('gulp-group-css-media-queries'); // группировка медиа запросов (использовать только в финале работы, а не в процессе)
//images
const imagemin = require('gulp-imagemin');                  // плагин для сжатия картинок
const webp = require('gulp-webp');                          // создание копий картинок в формате webp

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
gulp.task('resultClean:docs', function(done){
    if(fs.existsSync('./docs')) {
        return gulp.src('./docs', {read: false})
            .pipe(resultClean({force: true}));
    }
    done();                                                 
});

// задача для файлов html
gulp.task('html:docs', function(){
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('html')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});

// задача для обработки файлов scss
gulp.task('sass:docs', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css'))
        .pipe(plumber(plumberNotify('scss')))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css'))
});

//  задача для обработки изображений
gulp.task('images:docs', function(){
    return gulp.src('./src/images/**/*.*')
        .pipe(changed('./docs/images'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/images'))

        .pipe(gulp.src('./src/images/**/*.*'))
        .pipe(changed('./docs/images'))
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest('./docs/images'))
});

//  задача для копирования шрифтов
gulp.task('copyFonts:docs', function(){
    return gulp.src('./src/fonts/**/*.*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
});

//  задача для копирования прочих файлов
gulp.task('copyFiles:docs', function(){
    return gulp.src('./src/files/**/*.*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'))
});

//  задача для обработки js
gulp.task('js:docs', function(){
    return gulp.src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberNotify('js')))
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./docs/js/'))
});

// задача для live-server
gulp.task('liveServer:docs', function(){
    return gulp.src('./docs')
        .pipe(server({
            livereload: true,
            open: true
        }))
});

