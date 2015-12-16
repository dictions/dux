'use strict';

var Dispatcher = require('flux').Dispatcher;
var assign = require('lodash/object/assign');
var CHANGE_EVENT = 'CHANGE';

var createStore = function(dispatcher, options) {

	if (!(dispatcher instanceof Dispatcher)) {
		throw new Error('First argument must be an instance of a Flux Dispatcher');
	}

	if (options === null || typeof options !== 'object') {
		throw new Error('Options must be an object');
	}

	if (!('getInitialState' in options)) {
		throw new Error('getIntialState is missing from Options');
	}

	var state = options.getIntialState();

	var listeners = {
		[CHANGE_EVENT]: []
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
		if (dispatcher.isDispatching()) {
			dispatcher.waitFor([dispatchToken]);
		}
		return state;
	};

	var subscribe = function(event, callback) {
		if (typeof event === 'function') {
			callback = event;
			event = CHANGE_EVENT;
		}
		if (!listeners[event]) {
			listeners[event] = [];
		}
		listeners.push[callback];
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

	return assign({}, options, {
		dispatchToken,
		listeners,
		getState,
		subscribe,
		unsubscribe
	});
};

module.exports = createStore;