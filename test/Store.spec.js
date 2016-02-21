'use strict';

var test = require('tape');
var _ = require('lodash');
var Store = require('../src/Store');
var Dispatcher = require('flux').Dispatcher;

test('Throws warning errors', function(t) {
	var dispatcher = new Dispatcher();

	t.throws(Store);
	t.throws(Store.bind(null, 'not object', dispatcher));
	t.throws(Store.bind(null, {getInitialState() {}}, null));
	t.throws(Store.bind(null, {}, dispatcher));
	t.end();
});

test('Store has public API', function(t) {
	var dispatcher = new Dispatcher();
	var store = new Store({
		getInitialState: () => {}
	}, dispatcher);

	t.true(_.isString(store.dispatchToken));
	t.true(_.isFunction(store.getState));
	t.true(_.isFunction(store.subscribe));
	t.true(_.isFunction(store.unsubscribe));
	t.true(_.isObject(store.listeners));
	t.end();
});

test('Store is passed all option props', function(t) {
	var dispatcher = new Dispatcher();
	var store = new Store({
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
	}, dispatcher);

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
	var store = new Store({
		getInitialState() {
			return state;
		}
	}, dispatcher);

	t.equal(store.getInitialState(), state);
	t.equal(store.getState(), state);
	t.end();
});

test('Resets state and calls reset and change listeners', function(t) {
	var dispatcher = new Dispatcher();
	var initialState = {bool: true};
	var newState = {bool: false};
	var store = new Store({
		getInitialState() {
			return initialState;
		}
	}, dispatcher);

	t.plan(4);

	// should get called once
	store.subscribe('CHANGE', function() {
		t.true(true);
	});
	// should get called once
	store.subscribe('RESET', function() {
		t.true(true);
	});

	t.equal(store.getState(), initialState);

	store.resetState(newState);
	t.equal(store.getState(), newState);
});

test('Store responds to dispatcher', function(t) {
	var dispatcher = new Dispatcher();
	var COUNT_EVENT = 'COUNT_EVENT';
	var store = new Store({
		getInitialState() {
			return {counter: 0};
		},
		[COUNT_EVENT](state, action) {
			return {counter: state.counter + 1};
		}
	}, dispatcher);

	dispatcher.dispatch({type: COUNT_EVENT});
	t.equal(store.getState().counter, 1);
	dispatcher.dispatch({type: COUNT_EVENT});
	t.equal(store.getState().counter, 2);
	t.end();
});

test('Subscribe callbacks run after dispatch', function(t) {
	var EVENT = 'EVENT';
	var dispatcher = new Dispatcher();
	var store = new Store({
		getInitialState:() => {},
		[EVENT](state, action) {
			return state;
		}
	}, dispatcher);

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
	var store = new Store({
		getInitialState:() => {}
	}, dispatcher);
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
