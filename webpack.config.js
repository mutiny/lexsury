const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
let extractHtml = new ExtractTextPlugin('[name].html')
let extractStyles = new ExtractTextPlugin('[name].css')

// var Uglify = webpack.optimize.UglifyJsPlugin
const path = require('path')
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}
module.exports = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['stage-0', 'env'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.pug$/,
        loaders: ['file-loader?name=[name].html&outputPath=./', 'pug-html-loader?pretty&exports=false']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: extractStyles.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jQuery-slim',
      jQuery: 'jquery-slim',
      'window.jQuery': 'jquery'
    }),
    extractStyles,
    extractHtml
  ]
}
