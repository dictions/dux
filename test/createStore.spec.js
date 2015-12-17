'use strict';

var test = require('tape');
var createStore = require('../src/createStore');
var Dispatcher = require('flux').Dispatcher;

test('Throws warning errors', function(t) {
	var dispatcher = new Dispatcher();
	t.throws(createStore);
	t.throws(createStore.bind(null, dispatcher, 'object'));
	t.throws(createStore.bind(null, null, {getInitialState() {}}));
	t.throws(createStore.bind(null, dispatcher, {}));
	t.end();
});

test('Sets state with getInitialState', function(t) {
	var dispatcher = new Dispatcher();
	var state = {
		bool: true,
		object: {
			a: 'string',
			b: function() {
				return this.a;
			}
		},
		array: [1, 3]
	};
	var store = createStore(dispatcher, {
		getInitialState() {
			return state;
		}
	});
	t.deepEqual(state, store.getState());
	t.end();
});

test('Store responds to dispatcher', function(t) {
	var dispatcher = new Dispatcher();
	var COUNT_EVENT = 'COUNT_EVENT';
	var store = createStore(dispatcher, {
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			return {counter: state.counter + 1};
		}
	});
	dispatcher.dispatch({type: COUNT_EVENT});
	t.equal(store.getState().counter, 1);
	dispatcher.dispatch({type: COUNT_EVENT});
	t.equal(store.getState().counter, 2);
	t.end();
});