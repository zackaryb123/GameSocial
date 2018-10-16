const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const envConfig = require("./env.config");

// const cssConfig3 = ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader','less-loader'], publicPath: 'public'});
const cssConfig = ["style-loader", "css-loader"];
const lessConfig = [
  { loader: "style-loader" },
  { loader: "css-loader" },
  { loader: "less-loader" }
];

//process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const env = process.env.NODE_ENV || "development";
const isProd =
  process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production";

const singleEntry = [__dirname + "/src/index.js"];
const multConfig = [__dirname + "/src/index.js", __dirname + "/src/main.less"];

module.exports = {
  stats: "verbose",
  devtool: "cheap-module-source-map",
  entry: singleEntry,
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "/public/"),
    publicPath: "/"
  },
  resolve: {
    alias: {
      "../../theme.config$": path.join(__dirname, "./src/ui/theme.config"),
      OBJLoader: path.join(
        __dirname,
        "./node_modules/three/examples/js/loaders/OBJLoader.js"
      ),
      MTLLoader: path.join(
        __dirname,
        "node_modules/three/examples/js/loaders/MTLLoader.js"
      ),
      DDSLoader: path.join(
        __dirname,
        "node_modules/three/examples/js/loaders/DDSLoader.js"
      )
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "public",
    compress: false,
    open: true,
    openPage: "",
    port: 8081,
    hot: true,
    inline: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true"
    },
    allowedHosts: ["http://localhost:8080"]
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
        exclude: [path.resolve(__dirname, "/src/ui/assets/fonts")]
      },
      {
        test: /\.(webm|mp4)$/,
        loader: "file"
      },
      {
        test: /\.mtl$/,
        use: ["mtl-loader?name=/ui/assets/mtl/[name].[ext]"],
        exclude: [path.resolve(__dirname, "/src/ui/assets/mtl")]
      },
      {
        test: /\.obj$/,
        use: [
          "file-loader?name=/ui/assets/obj/[name].[ext]",
          "webpack-obj-loader?name=/ui/assets/obj/[name].[ext]"
        ],
        exclude: [path.resolve(__dirname, "/src/ui/assets/obj")]
      }
    ]
  },
  externals: {
    FirebaseConfig: JSON.stringify(envConfig[env].firebase),
    CloudinaryConfig: JSON.stringify(envConfig[env].cloudinary),
    MicrosoftConfig: JSON.stringify(envConfig[env].microsoft)
  },
  plugins: [
    new webpack.ProvidePlugin({ THERE: "three" }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      title: "GameSocial",
      excludeChunks: ["styleguide"],
      template: "./src/index.html",
      filename: "index.html"
    }),
    // new CleanWebpackPlugin("public", {}),
    new WebpackMd5Hash(),
    new MiniCssExtractPlugin({
      filename: "./ui/assets/css/[name].css"
    }),
    // new myRewriteImportPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
