// Importando um módulo
const path = require('path'); // CommonJS

// Exportando o módulo
module.exports = {
    mode: 'production',
    entry: './frontend/main.js',
    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/, // excluindo a pasta do node para o webpack não analisar ela e ficar muito lento
                test: /\.js$/, // essa expressão regular indica que o arquivo tem a extesão js e a \ é para ele ignorar o carater de ponto
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },
            // {
            //     test: /\.css/,
            //     use: ['style-loader', 'css-loader']
            // }
        ]
    },
    devtool: 'source-map'
};
