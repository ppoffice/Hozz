var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    target: 'electron',
    devtool: 'source-map',
    entry: {
        main: './src/js/main',
        settings: './src/js/settings',
    },
    output: {
        path: path.join(__dirname, 'app'),
        filename: '[name].js',
        chunkFilename: '[chunkhash].js',
        sourceMapFilename: '[name].map'
    },
    node: {
        __dirname: false
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src/js'),
                ],

                // Only run `.js` and `.jsx` files through Babel
                test: /\.js|\.jsx?$/,

                // Options to configure babel with
                query: {
                    presets: ['es2015', 'react'],
                }
            },
            {
                loader: 'json-loader',
                test: /\.json?$/,
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [
                    path.resolve(__dirname, 'src/assets/images'),
                ],
            },
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({comments: false}),
    ]
};