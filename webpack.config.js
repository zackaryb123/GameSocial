const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const envConfig = require('./env.config');
const webpack = require('webpack');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const cssDev = ['style-loader', css-loader', 'less-loader']
// const cssProd = ExtractTextPlugin.extract({
//   fallback: 'style-loader',
//   use: ['css-loader','less-loader'],
//   publicPath: 'public'
// });

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

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const SRC_DIR = path.resolve(__dirname, 'src');
const entryConfig = [ SRC_DIR + '/index.js', SRC_DIR + '/main.less'];

module.exports = {
    watch: true,
    entry: SRC_DIR + '/index.js',
    output: {
      filename: 'bundle.js',
      path: PUBLIC_DIR
    },
    devServer: {
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: SRC_DIR,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(css|less)$/,
          use: ['css-loader', 'less-loader', 'style-loader']
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
        filename: "index.html"
      }),
      new webpack.DefinePlugin({

      })
    ]
};