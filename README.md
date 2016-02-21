# Mighty Dux

Flux stores inspired by Redux

![build status](https://circleci.com/gh/dictions/mighty-dux.svg?style=shield&circle-token=9f7931841df5f2be93ba50a6cfbd609cce9e4b58)

## Install
```
$ npm install mighty-dux flux --save
```

## Usage
Dux exposes two methods for creating stores, `createStore` and `createClass`.

### Create Store
Returns a new instance of a Dux Store. It is passed a flux dispatcher and an object of options.

```js
var Dux = require('mighty-dux');
var Dispatcher = require('flux').Dispatcher;

var dispatcher = new Dispatcher();
var store = Dux.createStore(dispatcher, {options});
```

### Create Class
Returns a class for creating instances of a Dux Store. It is passed an object of options. This is useful for an instances architecture rather than traditional flux singletons.

```js
var Dux = require('mighty-dux');
var Dispatcher = require('flux').Dispatcher;

var dispatcher = new Dispatcher();
var AppStore = Dux.createClass({options});

var app = new AppStore(dispatcher);
```

## Store Options

### getInitialState
`getInitialState` returns the intial state of the store

### Action Reducers (currentState, action)
Action Reducers are reducers that are called on a store when an action matches the action type. Action Reducers are passed the current state object, as well as the matching action. Return the new state object.

```js
var Store = Dux.createStore(app, {
	getInitialState() {
		return {counter: 0};
	},
	INCREMENT(state, action) {
		return {counter: state.counter + 1};
	},
	DECREMENT(state, action) {
		return {counter: state.counter - 1};
	}
});

app.dispatch({type: 'INCREMENT'});
console.log(Store.getState().counter); // 1
```

### Custom Options
Any other methods or properties have direct access to the store object via the this keyword.

```js
var Store = Dux.createStore(app, {
	getInitialState() {
		return {
			firstName: 'ian',
			lastName: 'williams'
		};
	},
	fullName() {
		var {firstName, lastName} = this.getState();
		return firstName + ' ' + lastName;
	}
});
```

## API

### store.getState
Returns the current state of the store

### store.resetState
Resets the state of the store and fires `RESET` and `CHANGE` callbacks. This is useful for rehydrating stores on the client in isomorphic applications. **This does not reset the event listeners on the store.**

### store.dispatchToken
The Flux dispatch token for the store. Can be used with `Dispatcher.waitFor`

### store.subscribe (event, callback)
Subscribe to store events. Optionally pass an event type, or subscribe to all events that affect the store.
```js
store.subscribe('EVENT', function() {
	store.getState(); // current state
});
```

### store.unsubscribe (event, callback)
Unsubscribe callback from Store events. Event Type is also optional
```js
store.unsubscribe('EVENT', callback);
```

### store.listeners
Object of event listeners per store event.

### store.waitFor (event)
Calls the dispatcher instance's waitFor method.