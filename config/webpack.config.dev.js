'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./development.js');
var dependencies = require('../package.json').tw_browser_packages;
var devServer = [
	'webpack-dev-server/client?http://localhost:' + config.clientPort,
	'webpack/hot/only-dev-server'
];

module.exports = {
	context: path.resolve(__dirname, '..'),
	entry: {
		// Main entry point for the app
		'app': ['./src/app'].concat(devServer),
        // Bundle Vendor packages together
		'vendor': dependencies.concat(devServer)
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
				loaders: ['react-hot', 'babel'],
				include: path.resolve(__dirname, '../src')
			}
		]
	},
	plugins: [
		// Hot Reload
		new webpack.HotModuleReplacementPlugin(),
		// Prevent Webpack from throwing and exiting process
		new webpack.NoErrorsPlugin(),
		// Bundle Vendor packages together
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
	]
};