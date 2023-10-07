// подключаем gulp
const gulp = require('gulp');

// Задачи
require('./gulp/dev.js');               // сборка для процесса разработки проекта
require('./gulp/docs.js');              // финальная сборка для сдачи и размещения проета на хостинге

//задача для запуска всех задач для разработки по умолчанию
gulp.task('default', gulp.series(
    'resultClean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'copyFonts:dev', 'copyFiles:dev', 'js:dev'),
    gulp.parallel('liveServer:dev', 'watch:dev')
));

//задача для запуска всех задач для финальное версии по умолчанию
gulp.task('docs', gulp.series(
    'resultClean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'copyFonts:docs', 'copyFiles:docs', 'js:docs'),
    gulp.parallel('liveServer:docs')
));