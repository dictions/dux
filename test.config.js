'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
	// https://github.com/webpack/jade-loader/issues/8#issuecomment-55568520
	node: {
		fs: 'empty'
	},
	resolve: {
		// Allows requiring modules without the use of extension
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel'],
				include: [
					path.resolve(__dirname, './src'),
					path.resolve(__dirname, './test')
				]
			}
		]
	},
	plugins: [
		// Remove duplicate modules
		new webpack.optimize.DedupePlugin()
	]
};