'use strict';

var Dispatcher = require('flux').Dispatcher;
var CHANGE_EVENT = 'CHANGE';
var RESET_EVENT  = 'RESET';

module.exports = function Store(options, dispatcher) {

	if (!(dispatcher instanceof Dispatcher)) {
		throw new Error('First argument must be an instance of a Flux Dispatcher');
	}
	if (options === null || typeof options !== 'object') {
		throw new Error('Options must be an object');
	}
	if (!('getInitialState' in options)) {
		throw new Error('getInitialState is missing from Options');
	}

	var state = options.getInitialState();

	var listeners = {
		[CHANGE_EVENT]: [],
		[RESET_EVENT]:  []
	};

	var dispatchAction = function(action) {
		if (action.type in options) {
			state = options[action.type](state, action);
			var callbacks = (listeners[action.type] || []).concat(listeners[CHANGE_EVENT]);
			callbacks.forEach(c => c());
		}
	};

	var dispatchToken = dispatcher.register(dispatchAction);

	var getState = function() {
		return state;
	};

	var resetState = function(newState) {
		state = newState;
		var callbacks = listeners[RESET_EVENT].concat(listeners[CHANGE_EVENT]);
		callbacks.forEach(c => c());
	};

	var subscribe = function(event, callback) {
		if (typeof event === 'function') {
			callback = event;
			event = CHANGE_EVENT;
		}
		if (!listeners[event]) {
			listeners[event] = [];
		}
		listeners[event].push(callback);
	};

	var unsubscribe = function(event, callback) {
		if (typeof event === 'function') {
			callback = event;
			event = CHANGE_EVENT;
		}
		if (!listeners[event]) {
			listeners[event] = [];
		} else {
			listeners[event] = listeners[event].filter(function(c) {
				return c !== callback;
			});
		}
	};

	Object.assign(this, {
		...options,
		listeners,
		dispatchToken,
		getState,
		resetState,
		subscribe,
		unsubscribe
	});
};