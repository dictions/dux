'use strict';

var Store = require('./Store');

module.exports = function createClass(options) {
	return Store.bind(null, options);
};