'use strict';

var Store = require('./Store');

module.exports = function createClass(dispatcher, options) {
	return Store.bind(null, dispatcher, options);
};