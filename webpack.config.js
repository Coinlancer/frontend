const webpack = require('webpack');
const path = require('path');

const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'app.js'
    },
    watch: true,
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }, {
            test: /\.vue$/,
            use: {
                loader: 'vue-loader',
                options: {}
            }
        }]
    },
    resolve: {
        modules: ['node_modules'],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 9000,
        historyApiFallback: true
    },
    node: {
        fs: "empty"
    },
    plugins: [
        new Dotenv({
            path: './.env', // Path to .env file (this is the default)
        })
    ]
}
