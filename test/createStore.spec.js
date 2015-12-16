'use strict';

var test = require('tape');
var createStore = require('../src/createStore');
var Dispatcher = require('flux').Dispatcher;
var dispatcher = new Dispatcher();

test('throws warning errors', function(t) {
	t.throws(createStore);
	t.throws(createStore.bind(null, dispatcher, 'object'));
	t.throws(createStore.bind(null, null, {getInitialState() {}}));
	t.throws(createStore.bind(null, dispatcher, {}));
	t.end();
});