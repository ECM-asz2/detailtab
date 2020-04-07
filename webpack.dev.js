const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const path = require('path');
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = function() {
	return Merge(
			CommonConfig,
			{
				output : {
					publicPath : "/detailTabExample/",
				},
				devtool: 'source-map',
				target : "web",
				devServer : {
					host : "0.0.0.0",
					port : 8073,
					hot : false,
					inline: false,
					disableHostCheck: true,
				},

				plugins : [ new webpack.DefinePlugin({
					'process.env' : {
						NODE_ENV: JSON.stringify('development'),
						BASE_URL_I18N: JSON.stringify('../../'),
						BASE_REST_URL: JSON.stringify('../../rest/')
					}
				}),
				new CleanWebpackPlugin()

				],
				mode: 'development'
			});
};
