const webpack = require('webpack');
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output:{
        filename: 'app.js',
        path: path.resolve(__dirname, 'build/')
    },
    devServer:{
        contentBase: path.resolve(__dirname, 'build/'),
        port: 9000
    },
    module:{
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use:[
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)$/,
                use:[
                    'file-loader'
                ]
            }
        ]  
    },
    plugins:[
        new copyWebpackPlugin([
            {context: path.resolve(__dirname, 'src/static/pages/'), from: 'index.html'}  
        ]),
        new miniCssExtractPlugin({
            filename: 'estilo.css'
        })
    ]

}