const path = require('path');
const HtmlWebpackkPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackkPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
};