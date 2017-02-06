var path = require('path');
var webpack = require('webpack');
var S3Plugin = require('webpack-s3-plugin');

var development = process.env.NODE_ENV === 'development';
var production = process.env.NODE_ENV === 'production';

var config = {
  context: path.join(__dirname, 'src'),
  entry: [
    './app.js',
    './scss/main.scss'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  // devtool: 'eval-cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
            name: '[name]_[hash]',
            prefixize: false
        })
      },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      }
    ],
  },
  resolveLoader: {
    root: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  resolve: {
      extensions: ['', '.jsx', '.js', '.css', '.scss', '.svg'],
    root: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  sassLoader: {
    includePaths: ["./scss/"]
  },
  plugins: [
  ]
};
module.exports = config;

// For production deploy also push to S3 and use ExtractTextPlugin to create a dis
if (production) {
    module.exports.plugins.push(
        new S3Plugin({
          // s3Options are required
          s3Options: {
              accessKeyId: 'xxx',
              secretAccessKey: 'xxx',
              region: 'us-west-2'
          },
          s3UploadOptions: {
              Bucket: 'flatlandz',
              CacheControl: 'max-age=60'
          },
          directory: './build/',
          basePathTransform: function() {
              return 'campr';
          }
          // cdnizerOptions: {
          //     defaultCDNBase: 'https://s3-us-west-2.amazonaws.com/spr-display'
          // }
      })
    )
    module.exports.module.loaders.push(
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        }
    )

}
if (development) {
    module.exports.entry.push(
        'webpack-hot-middleware/client?http://localhost:3000'
    )
    module.exports.plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        // Webpack 2.0 fixed this mispelling
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    )
    module.exports.module.loaders.push(
        {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }
    );
}
