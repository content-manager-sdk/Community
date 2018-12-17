import * as React from "react";
import { inject, observer } from "mobx-react";
import { ITrimObjectSearchListProps } from "./TrimObjectSearchList.types";
import { List } from "office-ui-fabric-react/lib/List";
import { ITrimMainObject } from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

export interface ITrimObjectSearchListState {
	//q?: string;
	items: ITrimMainObject[];
}

export class TrimObjectSearchList extends React.Component<
	ITrimObjectSearchListProps,
	ITrimObjectSearchListState
> {
	constructor(props: ITrimObjectSearchListProps) {
		super(props);
		this.state = this._getDefaultState();
	}

	componentDidMount() {
		const { trimConnector } = this.props;
		if (trimConnector) {
			trimConnector!
				.search<ITrimMainObject>(BaseObjectTypes.Record, "all", 3)
				.then((response: ITrimMainObject[]) => {
					this.setState({ items: response });
				});
		}
	}

	public render(): JSX.Element {
		return <List items={this.state.items} onRenderCell={this._onRenderCell} />;
	}

	private _onRenderCell = (
		item: any,
		index: number | undefined
	): JSX.Element => {
		return <div>{item.NameString}</div>;
	};

	private _getDefaultState(
		props: ITrimObjectSearchListProps = this.props
	): ITrimObjectSearchListState {
		return {
			items: [],
		};
	}
}

export default inject("trimConnector")(observer(TrimObjectSearchList));
