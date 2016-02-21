'use strict';

var Store = require('./Store');

module.exports = function createStore(dispatcher, options) {
	return new Store(options, dispatcher);
};