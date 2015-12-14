'use strict';

var path = require('path');
var webpack = require('webpack');
var dependencies = require('../package.json').tw_browser_packages;

module.exports = {
	context: path.resolve(__dirname, '..'),
	entry: {
		// Main entry point for the app
		'app': './src/app',
    // Bundle Vendor packages together
		'vendor': dependencies
	},
	output: {
		// Out put production build to build directory
		path: path.resolve(__dirname, '../build/assets'),
		// Path used in HTML
		publicPath: '/assets/',
		// Output Filename
		filename: '[name].js'
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
				include: path.resolve(__dirname, '../src')
			}
		]
	},
	plugins: [
		// Bundle Vendor packages together
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
		// Minify
		new webpack.optimize.UglifyJsPlugin({minimize: true}),
		// Remove duplicate modules
		new webpack.optimize.DedupePlugin()
	]
};