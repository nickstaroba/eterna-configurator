const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = () => ({
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    open: true,
  },
  entry: path.resolve(__dirname, "src/index.jsx"),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [autoprefixer()],
            },
          },
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: path.resolve(__dirname, "src/styles/common.scss"),
            },
          },
        ],
      },
      {
        test: /\.(eot|gif|jpg|png|ttf|woff2?)$/,
        use: "file-loader",
      },
      {
        test: /\.svg$/,
        use: "svg-react-loader",
      },
      {
        test: /\.md$/,
        use: "raw-loader",
      },
    ],
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/public"), to: "." }],
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new MiniCssExtractPlugin({
      chunkFilename: "[id].css",
      filename: "css/[name].css",
      ignoreOrder: false,
    }),
  ],
  resolve: {
    alias: {
      react: path.resolve("node_modules/react"),
    },
    extensions: [".js", ".jsx", ".json", ".css", ".scss"],
  },
  target: "web",
});
