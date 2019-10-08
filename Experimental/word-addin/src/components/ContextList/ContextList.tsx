import * as React from "react";
import { inject, observer } from "mobx-react";
import "./ContextList.css";

import { IconButton } from "office-ui-fabric-react/lib/Button";
import {
	ITrimConnector,
	ITrimMainObject,
	IEnumDetails,
} from "src/trim-coms/trim-connector";
import { IContextualMenuProps } from "office-ui-fabric-react/lib/ContextualMenu";

import { IWordConnector } from "src/office-coms/word-connector";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { mergeStyles, FocusTrapZone } from "office-ui-fabric-react";

import SearchBar from "../SearchBar/SearchBar";

const wrapperClassName = mergeStyles({
	selectors: {
		"& .ms-ComboBox-container": {
			display: "inline",
			float: "left",
			marginLeft: "4px",
		},
		"& .trim-search-text": {
			float: "left",
			marginLeft: "4px",
		},
		"& .context-list-title": {
			float: "left",
			width: "70px",
		},
		"& .context-list-title .ms-Button--icon": {
			display: "none",
		},
		"& .context-list-title .ms-ComboBox": {
			paddingRight: "5px",
			paddingLeft: "5px",
		},
	},
});

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

	private _openInCM = (action: string) => {
		const { selectRecord } = this.state;
		const { appStore, wordConnector } = this.props;

		if (selectRecord.Uri === 0) {
			appStore.setError(appStore.messages.web_Please_Select);
		}

		switch (action) {
			case "OPEN": {
				appStore.openInCM(selectRecord.Uri);
				break;
			}
			case "INSERT_TITLE": {
				wordConnector!.insertText(selectRecord.ToolTip!);
				break;
			}
			case "INSERT_LINK": {
				const url = appStore.getWebClientUrl(selectRecord.Uri);
				wordConnector!.insertLink(selectRecord.NameString!, url);
				break;
			}
		}
	};

	public render() {
		const { appStore, trimConnector } = this.props;
		const { searchQuery, selectRecord } = this.state;

		const contextMenuProps: IContextualMenuProps = {
			items: [
				{
					key: "goTo",
					text: appStore.messages.web_GoToCM,
					iconProps: { iconName: "OpenInNewWindow" },
					onClick: () => {
						this._openInCM("OPEN");
					},
				},
				{
					key: "pasteTitle",
					text: appStore.messages.web_Paste_Title,
					iconProps: { iconName: "PasteAsText" },
					onClick: () => {
						this._openInCM("INSERT_TITLE");
					},
				},
				{
					key: "pasteTitle",
					text: appStore.messages.web_Paste_Link,
					iconProps: { iconName: "PasteAsText" },
					onClick: () => {
						this._openInCM("INSERT_LINK");
					},
				},
				{
					key: "addRelationshipto",
					text: appStore.messages.web_Add_Relationship,
					title: appStore.messages.web_Add_RelationshipTitle,
					subMenuProps: {
						items: appStore.documentInfo.Enums.RecordRelationshipType.map(
							(rel: IEnumDetails) => {
								return {
									key: rel.Id,
									text: rel.Caption,
									onClick: () => {
										trimConnector!
											.createRelationship(
												appStore.RecordUri,
												selectRecord.Uri,
												rel.Id
											)
											.then(() => {});
									},
								};
							}
						),
					},
				},
			],
		};

		return (
			<div className={wrapperClassName}>
				<IconButton
					className="trim-action-button"
					iconProps={{ iconName: "GlobalNavButton" }}
					menuProps={contextMenuProps}
					split={false}
				/>
				<h3>
					<SearchBar
						trimType={BaseObjectTypes.Record}
						onChange={(newValue) => {
							this.setState({ searchQuery: newValue });
						}}
						includeShortCuts={true}
					/>
				</h3>

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
