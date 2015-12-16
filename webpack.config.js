'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
	externals: {
		'flux': {
			root: 'Flux',
			commonjs2: 'flux',
			commonjs: 'flux',
			amd: 'flux'
		}
	},
	output: {
		library: 'dux',
		libraryTarget: 'umd'
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
					path.resolve(__dirname, './src')
				]
			}
		]
	},
	plugins: [
		// Remove duplicate modules
		new webpack.optimize.DedupePlugin()
	]
};