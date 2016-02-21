'use strict';

var test = require('tape');
var Store = require('../src/Store');
var createClass = require('../src/createClass');
var Dispatcher = require('flux').Dispatcher;

test('Creates a Store class', function(t) {
	var StoreClass = createClass({
		getInitialState: () => {}
	});
	var store = new StoreClass(new Dispatcher);
	t.true(store instanceof StoreClass && store instanceof Store);
	t.false(store instanceof Boolean);
	t.end();
});