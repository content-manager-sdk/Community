import * as React from "react";
import { inject, observer } from "mobx-react";
import "./ContextList.css";
import { ITrimConnector, ITrimMainObject } from "src/trim-coms/trim-connector";
import { IWordConnector } from "src/office-coms/word-connector";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { FocusTrapZone } from "office-ui-fabric-react";

import SearchBar from "../SearchBar/SearchBar";
import ObjectContextMenu from "../ObjectContextMenu/ObjectContextMenu";

export class ContextList extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		className?: string;
	},
	{
		selectRecord: ITrimMainObject;
		searchQuery: string;
	}
> {
	private _searchList = createRef<ITrimObjectSearchList>();

	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	}) {
		super(props);

		this.state = {
			selectRecord: { Uri: 0 },
			searchQuery: "",
		};
	}

	private _trimObjectSelected = (trimObject: ITrimMainObject) => {
		this.setState({ selectRecord: trimObject });
	};

	public render() {
		const { searchQuery, selectRecord } = this.state;

		return (
			<div>
				<ObjectContextMenu isInList={true} record={selectRecord} />

				<SearchBar
					trimType={BaseObjectTypes.Record}
					onQueryChange={(newValue) => {
						this.setState({ searchQuery: newValue });
					}}
					includeShortCuts={true}
				/>

				<FocusTrapZone
					isClickableOutsideFocusTrap={true}
					className="context-list"
				>
					<TrimObjectSearchList
						componentRef={this._searchList}
						trimType={BaseObjectTypes.Record}
						q={searchQuery}
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

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(ContextList)
);
