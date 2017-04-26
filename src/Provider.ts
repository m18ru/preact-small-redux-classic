/*
 * Makes the Redux store available to the connect() calls in the component
 * hierarchy below.
 */

import {Component, ComponentProps} from 'preact';
import {Action, Store} from 'small-redux';

/**
 * Properties of Provider.
 */
export interface ProviderProps<TState, TAction extends Action>
	extends ComponentProps<Provider>
{
	/** The single Redux store in your application. */
	store: Store<TState, TAction>;
}

/**
 * Context of Provider.
 */
export interface ProviderContext<TState, TAction extends Action>
{
	/** The single Redux store in your application. */
	store: Store<TState, TAction>;
}

/**
 * Makes the Redux store available to the connect() calls in the component
 * hierarchy below.
 */
export default class Provider extends Component<ProviderProps<any, any>, void>
{
	/**
	 * For requesting context from hierarchy below.
	 */
	public getChildContext(): ProviderContext<any, any>
	{
		return {
			store: this.props.store,
		};
	}
	
	/**
	 * Render component.
	 */
	public render( {children}: ProviderProps<any, any> ): JSX.Element
	{
		return ( children && children[0] ) as JSX.Element;
	}
}

/**
 * Module.
 */
/*export {
	Provider as default,
	ProviderProps,
	ProviderContext,
};*/
