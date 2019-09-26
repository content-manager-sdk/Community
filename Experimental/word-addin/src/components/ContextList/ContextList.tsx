import * as React from "react";
import { inject, observer } from "mobx-react";
import "./ContextList.css";

import { IconButton } from "office-ui-fabric-react/lib/Button";
import { ITrimConnector, ITrimMainObject } from "src/trim-coms/trim-connector";
import { IContextualMenuProps } from "office-ui-fabric-react/lib/ContextualMenu";

import { IWordConnector } from "src/office-coms/word-connector";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import {
	ComboBox,
	IComboBox,
	IComboBoxOption,
	mergeStyles,
	FocusTrapZone,
} from "office-ui-fabric-react";

import { debounce } from "throttle-debounce";

const wrapperClassName = mergeStyles({
	selectors: {
		"& .ms-ComboBox-container": {
			display: "inline",
			float: "right",
		},
	},
});

const comboOptions: IComboBoxOption[] = [
	{ key: "container", text: "in same container" },
	{ key: "contacts", text: "with same contacts" },
	{ key: "related", text: "related to" },
	{ key: "all_related", text: "all related to" },
];

export class ContextList extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		className?: string;
	},
	{ selectRecord: ITrimMainObject; searchQuery: string }
> {
	private _searchList = createRef<ITrimObjectSearchList>();
	private _basicComboBox = React.createRef<IComboBox>();
	autocompleteSearchDebounced: any;
	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	}) {
		super(props);

		this.state = {
			selectRecord: { Uri: 0 },
			searchQuery: this._getQuery("container"),
		};

		this.autocompleteSearchDebounced = debounce(1000, this.__textChanged);
	}

	private _getQuery(key: string) {
		const { appStore } = this.props;

		const searches = {
			container: `recContainerEx:[recContainsEx:${appStore!.RecordUri}]`,
			contacts: `recSameContact:${appStore.RecordUri}`,
			related: `recRelated:${appStore.RecordUri}`,
			all_related: `recAllRelated:${appStore.RecordUri}`,
		};

		return searches[key];
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

	private _comboChange = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	): void => {
		if (option) {
			this.setState({ searchQuery: this._getQuery(option!.key as string) });
		}
	};

	private __textChanged = (value: string): void => {
		this.setState({ searchQuery: value! });
	};

	private _pendingChange = (
		option?: IComboBoxOption,
		index?: number,
		value?: string
	): void => {
		if (value) {
			this.autocompleteSearchDebounced(value);
			//this.setState({ searchQuery: value! });
		}
	};

	private _findCannedSearch = (searchQuery: string): number => {
		for (let counter = 0; counter < comboOptions.length; counter++) {
			if (searchQuery === this._getQuery(comboOptions[counter].key as string)) {
				return counter;
			}
		}
		return -1;
	};

	public render() {
		const { appStore } = this.props;
		const { searchQuery } = this.state;

		const cannedSearchNumber = this._findCannedSearch(searchQuery);
		const defaultProps =
			cannedSearchNumber > -1
				? {
						selectedKey: comboOptions[cannedSearchNumber].key,
				  }
				: { value: searchQuery };

		console.log(defaultProps);

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
					text: "Paste link",
					iconProps: { iconName: "PasteAsText" },
					onClick: () => {
						this._openInCM("INSERT_LINK");
					},
				},
			],
		};

		return (
			<div className={wrapperClassName}>
				<IconButton
					className="trim-action-button"
					iconProps={{ iconName: "CollapseMenu" }}
					menuProps={contextMenuProps}
					split={false}
				/>
				<h3>
					<span>Show </span>
					<ComboBox
						{...defaultProps}
						options={comboOptions}
						componentRef={this._basicComboBox}
						onChange={this._comboChange}
						allowFreeform={true}
						autoComplete="off"
						onPendingValueChanged={this._pendingChange}
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
