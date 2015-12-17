'use strict';

var test = require('tape');
var _ = require('lodash');
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

test('Store is passed dispatchToken and listeners', function(t) {
	var dispatcher = new Dispatcher();
	var store = createStore(dispatcher, {
		getInitialState:() => {}
	});
	t.true(_.isString(store.dispatchToken));
	t.true(_.isObject(store.listeners));
	t.true(_.isFunction(store.subscribe));
	t.true(_.isFunction(store.unsubscribe));
	t.end();
});

test('Store is passed all option props', function(t) {
	var dispatcher = new Dispatcher();
	var store = createStore(dispatcher, {
		getInitialState: function() {
			return {
				firstName: 'ian',
				lastName: 'williams'
			};
		},
		getFullName: function() {
			return `${this.getState().firstName} ${this.getState().lastName}`;
		},
		arbitraryProp: true
	});
	t.true(store.arbitraryProp);
	t.equals(store.getFullName(), 'ian williams');
	t.end();
});

test('Sets state with getInitialState and getState returns state', function(t) {
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
	t.equal(store.getInitialState(), state);
	t.equal(store.getState(), state);
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

test('waitFor runs dispatcher callback on store and returns that store', function(t) {
	var dispatcher = new Dispatcher();
	var COUNT_EVENT = 'COUNT_EVENT';
	var storeA = createStore(dispatcher, {
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			return {counter: state.counter + 1};
		}
	});
	var storeB = createStore(dispatcher, {
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			return storeA.waitFor().getState();
		}
	});
	storeB.subscribe(function() {
		t.equal(storeB.getState(), storeA.getState());
		t.end();
	});
	dispatcher.dispatch({type: COUNT_EVENT});
});

test('waitFor throws on circular dependency', function(t) {
	var dispatcher = new Dispatcher();
	var COUNT_EVENT = 'COUNT_EVENT';
	var storeA = createStore(dispatcher, {
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			storeB.waitFor();
			return {counter: state.counter + 1};
		}
	});
	var storeB = createStore(dispatcher, {
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			return storeA.waitFor().getState();
		}
	});
	t.throws(dispatcher.dispatch.bind(null, {type: COUNT_EVENT}));
	t.end();
});

test('Subscribe callbacks run after dispatch', function(t) {
	var EVENT = 'EVENT';
	var dispatcher = new Dispatcher();
	var store = createStore(dispatcher, {
		getInitialState:() => {},
		[EVENT](state, action) {
			return state;
		}
	});

	t.plan(2);
	// should get called once
	store.subscribe(function() {
		t.true(true);
	});
	// should get called once
	store.subscribe(EVENT, function() {
		t.true(true);
	});
	dispatcher.dispatch({type: EVENT});
});

test('Unsubscribe removes events', function(t) {
	var dispatcher = new Dispatcher();
	var CHANGE = 'CHANGE';
	var EVENT = 'EVENT';
	var store = createStore(dispatcher, {
		getInitialState:() => {}
	});
	var callback = () => {};
	store.subscribe(callback);
	t.equal(store.listeners[CHANGE][0], callback);
	store.unsubscribe(callback);
	t.equal(store.listeners[CHANGE].length, 0);
	store.subscribe(EVENT, callback);
	t.equal(store.listeners[EVENT][0], callback);
	store.unsubscribe(EVENT, callback);
	t.equal(store.listeners[EVENT].length, 0);
	t.end();
});
