'use strict';

const Flux = require('flux');
const invariant = require('invariant');
const assign = require('lodash/object/assign');
const CHANGE_EVENT = 'CHANGE';

const createStore = function(dispatcher, options) {

	invariant(
		!(dispatcher instanceof Flux),
		'First argument must be an instance of a Flux Dispatcher'
	);

	invariant(
		!('getInitialState' in options),
		'getIntialState is missing from options'
	);

	let state;
	let listeners = {
		[CHANGE_EVENT]: []
	};

	const dispatchAction = function(action) {
		if (action.type in options) {
			state = options[action.type](state, action);
			let callbacks = (listeners[action.type] || []).concat(listeners[CHANGE_EVENT]);
			callbacks.forEach(c => c());
		}
	};

	const dispatchToken = dispatcher.register(dispatchAction);

	const getState = function() {
		if (dispatcher.isDispatching()) {
			dispatcher.waitFor([dispatchToken]);
		}
		return state || options.getInitialState();
	};

	const subscribe = function(event, callback) {
		if (typeof event === 'function') {
			callback = event;
			event = CHANGE_EVENT;
		}
		if (!listeners[event]) {
			listeners[event] = [];
		}
		listeners.push[callback];
	};

	const unsubscribe = function(event, callback) {
		if (typeof event === 'function') {
			callback = event;
			event = CHANGE_EVENT;
		}
		if (!listeners[event]) {
			listeners[event] = [];
		} else {
			listeners[event] = listeners[event].filter(function(c) {
				c !== callback;
			});
		}
	};

	return assign({}, {
		dispatchToken,
		getState,
		subscribe,
		unsubscribe
	}, options);
};

module.exports = createStore;