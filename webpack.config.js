const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const envConfig = require('./env.config');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const cssDev = ['style-loader', css-loader', 'less-loader']
const cssConfig = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader','less-loader'],
  publicPath: 'public'
});

// compress: false,
//   contentBase: 'public',
//   port: 8080,
//   inline: true,
//   stats: "verbose",
//   openPage: "",
//   hot: true,
//   open: true

//process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const env = process.env.NODE_ENV  || 'development';
const isProd = (process.env.NODE_ENV === 'staging') || (process.env.NODE_ENV === 'production');

const PUBLIC_DIR = path.join(__dirname, '/public/');
const SRC_DIR = [__dirname + '/src/index.js'];
const entryConfig = [ __dirname + '/src/index.js', __dirname + '/src/main.less'];

module.exports = {
    devtool: 'eval-source-map',
    watch: true,
    entry: SRC_DIR,
    output: {
      filename: 'bundle.js',
      path: PUBLIC_DIR,
      publicPath: "/"
    },
    resolve: {
      alias: {
        '../../theme.config$': path.join(__dirname, 'src/ui/theme.config')
      }
    },
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(css|less)$/,
          use: cssConfig
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000&name=/ui/assets/fonts/[name].[ext]',
          exclude: [path.resolve(__dirname, "/src/ui/assets/images")]
        },
        {
          test: /\.(jpe?g|png|gif|ico|svg|PNG)$/,
          use: [
            'file-loader?name=/ui/assets/img/[name].[ext]',
            // 'image-webpack-loader', // Optimize the image file size
          ],
          exclude: [path.resolve(__dirname, "/src/ui/assets/fonts")]
        },
        {
          test: /\.(webm|mp4)$/,
          loader: 'file'
        }
      ]
    },
    externals: {
      'FirebaseConfig': JSON.stringify(envConfig[env].firebase),
      'CloudinaryConfig': JSON.stringify(envConfig[env].cloudinary),
      'mLabConfig': JSON.stringify(envConfig[env].mLab)
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        hash: true,
        minify: {
          collapseWhitespace: true
        },
        excludeChunks: ['styleguide'],
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ]
};