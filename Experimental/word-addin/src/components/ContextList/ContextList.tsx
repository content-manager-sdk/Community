import * as React from "react";
import { inject, observer } from "mobx-react";
import "./ContextList.css";
import { ITrimConnector, ITrimMainObject } from "src/trim-coms/trim-connector";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { FocusTrapZone, mergeStyles } from "office-ui-fabric-react";

import SearchBar from "../SearchBar/SearchBar";
import ObjectContextMenu from "../ObjectContextMenu/ObjectContextMenu";

interface IContextListProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	className?: string;
	trimType?: BaseObjectTypes;
	hideSearchBar?: boolean;
	searchString?: string;
	onCommand?: (commandKey: string) => void;
}

export class ContextList extends React.Component<
	IContextListProps,
	{
		selectRecord: ITrimMainObject;
		searchQuery: string;
	}
> {
	private _searchList = createRef<ITrimObjectSearchList>();

	constructor(props: IContextListProps) {
		super(props);

		this.state = {
			selectRecord: { Uri: 0 },
			searchQuery: "",
		};
	}

	private _trimObjectSelected = (trimObject: ITrimMainObject) => {
		this.setState({ selectRecord: trimObject });
	};

	private getStyles(): string {
		const { hideSearchBar } = this.props;
		return mergeStyles({
			selectors: {
				"& .trim-list-container": {
					top: hideSearchBar ? "80px" : "150px",
				},
			},
		});
	}

	public render() {
		const { searchQuery, selectRecord } = this.state;
		const { trimType, hideSearchBar, searchString, onCommand } = this.props;

		return (
			<div>
				<ObjectContextMenu
					isInList={true}
					record={selectRecord}
					onCommandComplete={(key: string) => {
						if (onCommand) {
							onCommand(key);
						}
					}}
				/>
				{!hideSearchBar && (
					<SearchBar
						trimType={BaseObjectTypes.Record}
						onQueryChange={(newValue) => {
							this.setState({ searchQuery: newValue });
						}}
						includeShortCuts={true}
					/>
				)}

				<FocusTrapZone
					isClickableOutsideFocusTrap={true}
					className={"context-list " + this.getStyles()}
				>
					<TrimObjectSearchList
						componentRef={this._searchList}
						trimType={trimType || BaseObjectTypes.Record}
						q={searchString || searchQuery}
						contentsInReverseDateOrder={true}
						includeAlternateWhenShowingFolderContents={true}
						excludeShortCuts={true}
						onTrimObjectSelected={this._trimObjectSelected}
						advancedSearch={true}
					/>
				</FocusTrapZone>
			</div>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(ContextList));
