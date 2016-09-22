var sassArr = ['style-loader', 'css-loader', 'postcss-loader'].map(require.resolve);
var postcssPlugin = require('./postcss.conf');

module.exports = function(entry, output) {
    var webpackConfig = {
        module: {
            loaders: [{
                test: /\.(es6|js|jsx)$/, loader: require.resolve('babel-loader'),
                query: {
                    presets: [
                        'babel-preset-es2015',
                        'babel-preset-react',
                        'babel-preset-stage-1'
                    ].map(require.resolve),
                    plugins: [
                        'babel-plugin-add-module-exports',
                        'babel-plugin-transform-decorators-legacy'
                    ].map(require.resolve)
                }
            }, {
                test: /\.(png|jpg|jpeg)$/,
                loader: require.resolve('url-loader')
            }, {
                test: /\.(css|scss)$/,
                loader: sassArr.join('!')
            }
        ]},
        postcss: function() {
            return postcssPlugin(false);
        },
        entry: [entry],
        output: {
            filename: 'main.js',
            path: output
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    };

    return webpackConfig;
};