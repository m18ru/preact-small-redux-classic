import {Component, ComponentConstructor, ComponentProps, h} from 'preact';
import {Dispatch, Unsubscribe} from 'small-redux';
import {ProviderContext} from './Provider';

/**
 * Connects a Preact component to a Redux store.
 * 
 * @param mapStateToProps This function will be called on every store update
 *  and it’s result will be merged into the component’s props.
 * @param mapDispatchToProps This function will be called with `dispatch`
 *  function as argument on every store update and it’s result will be merged
 *  into the component’s props.
 * @returns Component decorator.
 */
function connect<TStateProps extends {}, TDispatchProps extends {}, TOwnProps extends {}>(
	mapStateToProps?: MapStateToProps<TStateProps, TOwnProps> | null,
	// tslint:disable-next-line:typedef
	mapDispatchToProps?: MapDispatchToProps<TDispatchProps, TOwnProps>,
)
{
	return (
		// tslint:disable-next-line:variable-name
		WrappedComponent: ComponentConstructor<
				TStateProps & TDispatchProps & TOwnProps, any
			>
			| FunctionalComponent<
				TStateProps & TDispatchProps & TOwnProps
			>,
	): ComponentConstructor<TOwnProps, any> =>
	{
		class Connect extends Component<TOwnProps, any>
		{
			public context: ProviderContext<any, any>;
			
			private propsChanged: boolean = true;
			private unsubscribe: Unsubscribe | undefined;
			
			public componentDidMount(): void
			{
				if ( !mapStateToProps )
				{
					return;
				}
				
				this.unsubscribe = this.context.store.subscribe(
					() => (this as any).forceUpdate(),
				);
			}
			
			public componentWillUnmount(): void
			{
				if ( this.unsubscribe )
				{
					this.unsubscribe();
					this.unsubscribe = undefined;
				}
			}
			
			public componentWillReceiveProps( nextProps: TOwnProps ): void
			{
				this.propsChanged = ( nextProps !== this.props );
			}
			
			public shouldComponentUpdate(): boolean
			{
				return this.propsChanged;
			}
			
			public render( props: TOwnProps ): JSX.Element
			{
				this.propsChanged = false;
				
				return h(
					WrappedComponent as any,
					this.mergeProps( props ),
				);
			}
			
			private mergeProps( props: TOwnProps ): TStateProps & DefaultProps & TDispatchProps & TOwnProps
			{
				let stateProps: TStateProps | undefined;
				
				if ( mapStateToProps )
				{
					stateProps = mapStateToProps(
						this.context.store.getState(),
						props,
					);
				}
				
				let dispatchProps: TDispatchProps | DefaultProps | undefined;
				
				if ( mapDispatchToProps )
				{
					dispatchProps = mapDispatchToProps(
						this.context.store.dispatch,
						props,
					);
				}
				else
				{
					dispatchProps = {
						dispatch: this.context.store.dispatch,
					};
				}
				
				return Object.assign(
					{},
					props,
					stateProps,
					dispatchProps,
				) as any;
			}
		}
		
		return Connect;
	};
}

/**
 * Map state properties into the component’s props.
 */
export type MapStateToProps<TStateProps, TOwnProps> =
	( state: any, ownProps?: TOwnProps ) => TStateProps;

/**
 * Map dispatch functions into the component’s props.
 */
export type MapDispatchToProps<TDispatchProps, TOwnProps> =
	( dispatch: Dispatch<any>, ownProps?: TOwnProps ) => TDispatchProps;

/**
 * Default properties.
 */
export interface DefaultProps
{
	/**
	 * Dispatch function.
	 * Available when `mapDispatchToProps` is omitted.
	 */
	dispatch: Dispatch<any>;
}

/**
 * Functional component (with strict props).
 */
export interface FunctionalComponent<PropsType>
{
	(props: PropsType & ComponentProps<this>, context?: any): JSX.Element;
	displayName?: string;
	defaultProps?: any;
}

/**
 * Module.
 */
export {
	connect as default,
	// MapStateToProps,
	// MapDispatchToProps,
};
