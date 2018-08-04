const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const RewriteImportPlugin = require("less-plugin-rewrite-import");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

class myRewriteImportPlugin {
  // Define the `apply` method
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.plugin("done", () => {
      new RewriteImportPlugin({
        paths: {
          "../../theme.config": "src/ui/theme.config"
        }
      });
    });
  }
}

const envConfig = require("./env.config");

// const cssConfig3 = ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader','less-loader'], publicPath: 'public'});
const cssConfig = ["style-loader", "css-loader"];
const lessConfig = [
  { loader: "style-loader" },
  { loader: "css-loader" },
  { loader: "less-loader" }
];

const cssConfig4 = [
  "style-loader",
  "css-loader",
  new RewriteImportPlugin({
    paths: {
      "../../theme.config": __dirname + "/app/semantic-ui/theme.config"
    }
  })
];

//process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const env = process.env.NODE_ENV || "development";
const isProd =
  process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production";

const singleEntry = [__dirname + "/src/index.js"];
const multConfig = [__dirname + "/src/index.js", __dirname + "/src/main.less"];

module.exports = {
  stats: "verbose",
  devtool: "eval-source-map",
  watch: true,
  entry: { main: singleEntry },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "/public")
  },
  resolve: {
    alias: {
      "../../theme.config$": path.join(__dirname, "./src/ui/theme.config")
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "./public",
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(css)$/,
        use: cssConfig
      },
      {
        test: /\.(less)$/,
        use: lessConfig
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000&name=/ui/assets/fonts/[name].[ext]",
        exclude: [path.resolve(__dirname, "/src/ui/assets/images")]
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg|PNG)$/,
        use: [
          "file-loader?name=/ui/assets/img/[name].[ext]"
          // 'image-webpack-loader', // Optimize the image file size
        ],
        exclude: [path.resolve(__dirname, "src/ui/assets/fonts")]
      },
      {
        test: /\.(webm|mp4)$/,
        loader: "file"
      }
    ]
  },
  externals: {
    FirebaseConfig: JSON.stringify(envConfig[env].firebase),
    CloudinaryConfig: JSON.stringify(envConfig[env].cloudinary),
    mLabConfig: JSON.stringify(envConfig[env].mLab)
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      title: "GameSocial",
      template: "./src/index.html",
      filename: "index.html"
    }),
    new CleanWebpackPlugin("public", {}),
    new WebpackMd5Hash(),
    new MiniCssExtractPlugin({
      filename: "./ui/assets/css/[name].css"
    }),
    new myRewriteImportPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
    // new CopyWebpackPlugin([
    //   { from: "src/icon.png", to: "icon.png" },
    //   { from: "src/site.webmanifest", to: "site.webmanifest" },
    //   { from: "src/tile.png", to: "tile.png" },
    //   { from: "src/tile-wide.png", to: "tile-wide.png" },
    //   { from: "src/browserconfig.xml", to: "browserconfig.xml" }
    // ])
  ]
};
