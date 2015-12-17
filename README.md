# Mighty Dux

Flux stores inspired by Redux

## Install
```
$ npm install mighty-dux --save
```

## Usage
Create a store by passing an instance of the Flux Dispatcher and store options.

```js
var Dux = require('mighty-dux');
var Dispatcher = require('flux').Dispatcher;

var COUNT_EVENT = 'COUNT_EVENT';
var app = new Dispatcher();

var Store = Dux.createStore(app, ...options);
```

## Create Store Options

### getInitialState
`getInitialState` returns the intial state of the store

### Action Reducers (currentState, action)
Action Reducers are reducers that are called on a store when an action matches the action type. Action Reducers are passed the current state object, as well as the matching action. Return the new state object.

```js
var INCREMENT = 'INCREMENT';
var DECREMENT = 'DECREMENT';

var Store = Dux.createStore(app, {
	getInitialState() {
		return {counter: 0};
	},
	[INCREMENT](state, action) {
		return {counter: state.counter + 1};
	},
	[DECREMENT](state, action) {
		return {counter: state.counter + 1};
	}
});

app.dispatch({type: INCREMENT});
console.log(Store.getState().counter); // 1
```

## API

### store.getState
Returns the current state of the store

### store.subscribe (event, callback)
Subscribe to store events. Optionally pass an event type, or subscribe to all events that affect the store.
```js
store.subscribe('EVENT', function() {
	store.getState(); // current state
});
```

### store.subscribe (event, callback)
Unsubscribe callback from Store events. Event Type is also optional
```js
store.unsubscribe('EVENT', callback);
```

### store.waitFor
Runs all dispatch reducers for that store, then returns the store itself. Handy for calling the traditional Flux waitFor in other store reducers.
```js
var StoreA = Dux.createStore(app, {
	[ACTION](state, action) {
		return StoreB.waitFor().getState();
	}
});
```
