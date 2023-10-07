const config = {

    mode: "production",                                         //  режим работы для получения готового продакшна

    entry: {
        index: './src/js/index.js'
        // contacts: './src/js/contacts.js',
        // about: './src/js/about.js'
    },                                                          // исходные файлы для сборки, при добавлении новых файлов js их необходимо прописать здесь

    output: {
        filename: '[name].bundle.js',
    },                                                          // конечный результат сборки

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },                                                          // модули для стилей, установленные из npm
};

module.exports = config;                                        // экспорт объекта config в gulpfile по названию