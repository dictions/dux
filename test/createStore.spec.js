'use strict';

var test = require('tape');
var Store = require('../src/Store');
var createStore = require('../src/createStore');
var Dispatcher = require('flux').Dispatcher;

test('Creates instance of Store', function(t) {
	var store = createStore(new Dispatcher, {
		getInitialState: () => {}
	});
	t.true(store instanceof Store);
	t.end();
});