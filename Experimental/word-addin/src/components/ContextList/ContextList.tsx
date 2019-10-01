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
	SelectableOptionMenuItemType,
} from "office-ui-fabric-react";

import { debounce } from "throttle-debounce";

const wrapperClassName = mergeStyles({
	selectors: {
		"& .ms-ComboBox-container": {
			display: "inline",
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
	{ selectRecord: ITrimMainObject; searchQuery: string; searchType: string }
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
			searchType: "goto",
		};

		this.autocompleteSearchDebounced = debounce(1000, this.__textChanged);
	}

	private getComboOptions = (): IComboBoxOption[] => {
		const { appStore } = this.props;

		return [
			// {
			// 	key: "Header1",
			// 	text: "Navigate to",
			// 	itemType: SelectableOptionMenuItemType.Header,
			// },
			{ key: "container", text: appStore.messages.web_in_Same_Container },
			{ key: "contacts", text: appStore.messages.web_with_Same_Contacts },
			{ key: "related", text: appStore.messages.web_Related_To },
			{ key: "all_related", text: appStore.messages.web_All_Related_To },
			// {
			// 	key: "Header2",
			// 	text: "Quick search",
			// 	itemType: SelectableOptionMenuItemType.Header,
			// },
			// { key: "search_content", text: appStore.messages.web_Search_Content },
		];
	};

	private _getQuery(key: string) {
		if (key.startsWith("search_")) {
			return "";
		}

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

	private _comboChangeSearchType = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	): void => {
		if (option) {
			const key = option.key as string;

			if (key === "goto") {
				this.setState({
					searchQuery: this._getQuery("container"),
					searchType: key,
				});
			} else {
				this.setState({ searchQuery: "", searchType: key });

				if (this._basicComboBox.current) {
					this._basicComboBox.current.focus();
				}
			}
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
		}
	};

	private _findCannedSearch = (searchQuery: string): number => {
		const comboOptions = this.getComboOptions();
		for (let counter = 0; counter < comboOptions.length; counter++) {
			if (searchQuery === this._getQuery(comboOptions[counter].key as string)) {
				return counter;
			}
		}
		return -1;
	};

	public render() {
		const { appStore } = this.props;
		const { searchQuery, searchType } = this.state;

		const searchTypeOptions: IComboBoxOption[] = [
			{ key: "goto", text: "Show" },
			{
				key: "Header1",
				text: "Quick search",
				itemType: SelectableOptionMenuItemType.Header,
			},
			{ key: "content", text: "Content", data: "recContent:" },
			{ key: "title", text: "Title", data: "recTitle:" },
			{ key: "anyWord", text: "Any word", data: "recAnyWord:" },
		];

		const comboOptions = this.getComboOptions();
		const cannedSearchNumber = this._findCannedSearch(searchQuery);
		const defaultProps =
			cannedSearchNumber > -1
				? {
						selectedKey: comboOptions[cannedSearchNumber].key,
				  }
				: { value: searchQuery };

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

		let fullSearchQuery = searchQuery;

		if (searchType != "goto" && fullSearchQuery) {
			searchTypeOptions.forEach((so) => {
				if (so.key === searchType) {
					fullSearchQuery = so.data + fullSearchQuery;
				}
			});
		}

		return (
			<div className={wrapperClassName}>
				<IconButton
					className="trim-action-button"
					iconProps={{ iconName: "CollapseMenu" }}
					menuProps={contextMenuProps}
					split={false}
				/>
				<h3>
					{/* <span className="context-list-title">
						{appStore.messages.web_Show}
					</span> */}
					<ComboBox
						className="context-list-title"
						options={searchTypeOptions}
						selectedKey={searchType}
						onChange={this._comboChangeSearchType}
					/>
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
						q={fullSearchQuery}
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
