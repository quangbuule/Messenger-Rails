var path = require('path');
var webpack = require('webpack');
var publicDevServer = 'http://localhost:3010/';

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?path=' + publicDevServer + '__webpack_hmr',
    './app/assets/javascripts/application'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'application.js',
    publicPath: publicDevServer
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'app/assets/javascripts'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, './app/assets/javascripts')
    }]
  }
};
