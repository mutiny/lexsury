const webpack = require('webpack')
// var Uglify = webpack.optimize.UglifyJsPlugin
const path = require('path')

module.exports = {
  entry: [
    './lib/index.js'
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/js'),
    // ??? needed for HMR (also devServer.publicPath)
    publicPath: '/'
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

      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jQuery-slim',
      jQuery: 'jquery-slim',
      'window.jQuery': 'jquery'
    })
  ]
}
