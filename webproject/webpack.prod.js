const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function() {
  return Merge(CommonConfig, {
    target: "web",
    devtool: "cheap-module-source-map",
    output: {
      filename: "app/[name]/[name].[hash].js",
      publicPath: "../../",
      path: path.join(__dirname, "/src/dist/"),
      chunkFilename: "app/[name].[contenthash:8].chunk.js"
    },
    mode: "production",
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production"),
						BASE_URL_I18N: JSON.stringify('../../'),
						BASE_REST_URL: JSON.stringify('../../rest/')
        }
      }),
      new CleanWebpackPlugin()
    ]
  });
};
