 const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
  output: {
    path: path.join(__dirname, "/dir"),
    filename: "index.bundle.js",
  },
/*    plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ], */
   devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  }
 };