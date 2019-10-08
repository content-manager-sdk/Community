import * as React from "react";
import { inject, observer } from "mobx-react";
import "./ContextList.css";

import { IconButton } from "office-ui-fabric-react/lib/Button";
import {
	ITrimConnector,
	ITrimMainObject,
	IEnumDetails,
	ISearchClauseOrFieldDef,
} from "src/trim-coms/trim-connector";
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
	TextField,
} from "office-ui-fabric-react";

import { debounce } from "throttle-debounce";

const config = (global as any).config;

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
		searchType: string;
		searchTypeOptions: IComboBoxOption[];
	}
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
			searchTypeOptions: [],
		};

		this.autocompleteSearchDebounced = debounce(1000, this.__textChanged);
	}

	componentDidMount() {
		const groupBy = function(list: any, keyGetter: any) {
			const map = new Map();
			list.forEach((item: any) => {
				const key = keyGetter(item);
				const collection = map.get(key);
				if (!collection) {
					map.set(key, [item]);
				} else {
					collection.push(item);
				}
			});
			return map;
		};

		const { trimConnector } = this.props;
		const searchClauses = config.SEARCH_CLAUSES || ["anyWord", "content"];
		let searchTypeOptions: IComboBoxOption[] = [{ key: "goto", text: "Show" }];
		const trimType = BaseObjectTypes.Record;
		let lastGroup = "";
		trimConnector!.getSearchClauseOrFieldDefinitions(trimType).then((data) => {
			groupBy(data, function(sc: any) {
				return sc.MethodGroup;
			}).forEach((clauseDefs: ISearchClauseOrFieldDef[]) => {
				clauseDefs.forEach((clauseDef: ISearchClauseOrFieldDef) => {
					if (
						clauseDef.IsFavorite ||
						clauseDef.IsRecent ||
						searchClauses.includes(clauseDef.ClauseName)
					) {
						if (lastGroup !== clauseDef.MethodGroup) {
							lastGroup = clauseDef.MethodGroup;
							searchTypeOptions.push({
								key: clauseDef.MethodGroup,
								text: clauseDef.MethodGroup,
								itemType: SelectableOptionMenuItemType.Header,
							});
						}
						searchTypeOptions.push({
							key: clauseDef.ClauseName,
							text: clauseDef.Caption,
							data: clauseDef,
						});
					}
				});
			});

			this.setState({ searchTypeOptions: searchTypeOptions });
		});
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
				if (
					option.data &&
					(option.data.ParameterFormat === "Boolean" ||
						option.data.SearchParameterFormat === "Boolean")
				) {
					this.setState({ searchQuery: option.text, searchType: key });
				} else {
					this.setState({ searchQuery: "", searchType: key });

					if (this._basicComboBox.current) {
						this._basicComboBox.current.focus();
					}
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

	private _textChange = (newValue: any): void => {
		if (newValue) {
			this.autocompleteSearchDebounced(newValue);
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
		const { appStore, trimConnector } = this.props;
		const {
			searchQuery,
			searchType,
			selectRecord,
			searchTypeOptions,
		} = this.state;

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

		let fullSearchQuery = searchQuery;
		let searchFormat = "";

		if (searchType != "goto") {
			searchTypeOptions.forEach((so) => {
				if (so.key === searchType) {
					searchFormat =
						so.data.SearchParameterFormat || so.data.ParameterFormat;
					if (
						so.data.ParameterFormat === "Boolean" ||
						so.data.SearchParameterFormat === "Boolean"
					) {
						fullSearchQuery = so.text;
					} else if (fullSearchQuery) {
						fullSearchQuery = so.text + ":" + fullSearchQuery;
					}
				}
			});
		}

		return (
			<div className={wrapperClassName}>
				<IconButton
					className="trim-action-button"
					iconProps={{ iconName: "GlobalNavButton" }}
					menuProps={contextMenuProps}
					split={false}
				/>
				<h3>
					<ComboBox
						className="context-list-title"
						options={searchTypeOptions}
						selectedKey={searchType}
						onChange={this._comboChangeSearchType}
					/>

					{searchType === "goto" ? (
						<ComboBox
							{...defaultProps}
							options={comboOptions}
							componentRef={this._basicComboBox}
							onChange={this._comboChange}
							allowFreeform={false}
							autoComplete="off"
							onPendingValueChanged={this._pendingChange}
							className="trim-search-query"
						/>
					) : searchFormat === "Boolean" ? null : (
						<TextField
							onBeforeChange={this._textChange}
							className="trim-search-text"
						/>
					)}
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
