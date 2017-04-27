# preact-small-redux-classic

Preact bindings for Small-Redux (classic API with Provider and connect).

It's simplified alternative to `react-redux` bindings to use
[preact](https://github.com/developit/preact)
with [small-redux](https://github.com/m18ru/small-redux).

This bindings is similar to base `react-redux` API. But currently **there is no
optimisation for store updates**, so component props updated on every store
change (in original `react-redux` there is a lot of code with memoization and so
on).

You can use another bindings
[preact-small-redux](https://github.com/m18ru/preact-small-redux)
that use different way to bind React with Redux. It is much simpler and provides
a simple update optimization.

Written in TypeScript, types are also included.

## Installation

For bundlers and other NPM-based environments:

```
npm install --save-dev preact small-redux tslib preact-small-redux-classic
```

Package `tslib` required in ES5-ESM version for `__extends` helper function.
It's not required for ES2015 version and for UMD version (function is included
in UMD).

## Usage

### UMD

UMD is default for this package, so just use something like:

```js
import {createStore} from 'small-redux';
import {Provider, connect} from 'preact-small-redux-classic';
// or
const {createStore} = require( 'small-redux' );
const {Provider, connect} = require( 'preact-small-redux-classic' );

const store = createStore( reducer );

// …
```

For using directly in browser (import with `<script>` tag in HTML-file):

* [Development version](https://unpkg.com/preact-small-redux-classic/es5/index.js)
* [Production version](https://unpkg.com/preact-small-redux-classic/es5/preact-small-redux.min.js)

You can use AMD or `PreactSmallReduxClassic` global variable.

### ES2015 module systems (ES5-ESM)

Package contain `module` property for use with ES2015 module bundlers
(like Rollup and Webpack 2).

### ES2015 code base

If you don't want to use transplitted to ES5 code, you can use included
ES2015 version.

You can directly import this version:

```js
import createSubscribedComponent from 'preact-small-redux-classic/es2015';
```

Or specify alias in Webpack config:

```js
{
	// …
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			"preact-small-redux-classic": 'preact-small-redux-classic/es2015',
		},
	},
};
```

## Module interface

* `Provider` — makes the Redux store available to the connect() calls in the component hierarchy below.
* `ProviderProps` [TS] — interface of the properties of Provider.
* `ProviderContext` [TS] — interface of the context of Provider.
* `connect` — connects a Preact component to a Redux store.
* `MapStateToProps` [TS] — type of a function to map state properties into the component’s props.
* `MapDispatchToProps` [TS] — type of a function to map dispatch functions into the component’s props.
* `DefaultProps` [TS] — type of default props of connected component (`dispatch` property, when `mapDispatchToProps` is omitted).

The `connect` function implements only this basic interface:

```ts
connect(
	mapStateToProps?: ( state: StoreState, ownProps?: WrapperProps ) => ObjectOfPropsFromState,
	mapDispatchToProps?: ( dispatch: DispatchFunc, ownProps?: WrapperProps ) => ObjectOfPropsWithActions
): WrappedComponent;
```

## Example

```tsx

import {h, render} from 'preact';
import {Action, createStore, Dispatch} from 'small-redux';
import {connect, MapStateToProps, Provider} from './index';

interface State
{
	test: string;
}

const initialState: State = {
	test: 'Hello',
};

function reducer(
	state: State = initialState,
	action: Action,
): State
{
	switch ( action.type )
	{
		case 'TEST':
			return {
				...state,
				test: 'Test',
			};
		
		default:
			return state;
	}
}

const store = createStore( reducer );

interface TestProps
{
	text: string;
	onClick(): void;
}

function Test( {text, onClick}: TestProps ): JSX.Element
{
	return (
		<button
			type="button"
			onClick={onClick}
		>
			{text}
		</button>
	);
}

function mapStateToProps( state: State ): Partial<TestProps>
{
	return {
		text: state.test,
	};
}

function mapDispatchToProps( dispatch: Dispatch<Action> ): Partial<TestProps>
{
	return {
		onClick(): void
		{
			dispatch( {type: 'TEST'} );
		},
	};
}

const TestConnected = connect( mapStateToProps, mapDispatchToProps )( Test );

const App = <Provider store={store}>
	<TestConnected />
</Provider>;

render( App, document.body );

```

## Changelog

[View changelog](CHANGELOG.md).
