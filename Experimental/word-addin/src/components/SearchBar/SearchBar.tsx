import * as React from "react";
import { inject, observer } from "mobx-react";
import "./SearchBar.css";

import {
	ITrimConnector,
	ISearchClauseOrFieldDef,
	IEnumDetails,
} from "src/trim-coms/trim-connector";

import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";

import {
	ComboBox,
	IComboBox,
	IComboBoxOption,
	SelectableOptionMenuItemType,
	TextField,
	ITextField,
	mergeStyles,
	IBaseProps,
} from "office-ui-fabric-react";

import { debounce } from "throttle-debounce";

const config = (global as any).config;
export interface ISearchBar {}
export interface ISearchBarState {
	searchQuery: string;
	searchType: string;
	searchTypeOptions: IComboBoxOption[];
	searchFormat: string;
	clauseGrouping: string;
}

export interface ISearchBarProps
	extends IBaseProps<ISearchBar>,
		React.HTMLAttributes<HTMLElement> {
	appStore?: any;
	trimConnector?: ITrimConnector;
	className?: string;
	trimType: BaseObjectTypes;
	onQueryChange?: (newQuery: string) => void;
	includeShortCuts: boolean;
	wideDisplay?: boolean;
	callChangeOnLoad?: boolean;
	startingSearch?: string;
}

export class SearchBar extends React.Component<ISearchBarProps, ISearchBarState>
	implements ISearchBar {
	private _basicComboBox = React.createRef<IComboBox>();
	private _textField = React.createRef<ITextField>();
	private _loaded: boolean = false;
	autocompleteSearchDebounced: any;

	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		className?: string;
		trimType: BaseObjectTypes;
		includeShortCuts: boolean;
		wideDisplay: boolean;
	}) {
		super(props);

		this.state = {
			searchQuery: this._getQuery("container"),
			searchType: "goto",
			searchTypeOptions: [],
			searchFormat: "",
			clauseGrouping: "category",
		};

		this.autocompleteSearchDebounced = debounce(1000, this.__textChanged);
	}
	private _clauseGrouping = "category";
	async componentDidMount() {
		this.loadSearchClauses();
	}

	private getComboStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-ComboBox-optionsContainerWrapper": {
					maxHeight: `${window.innerHeight - 100}px`,
					overflowY: "auto",
				},
			},
		});
	}

	componentDidUpdate(prevProps: ISearchBarProps, prevState: ISearchBarState) {
		const { trimType, trimConnector } = this.props;

		if (trimType != prevProps.trimType) {
			if (trimType !== BaseObjectTypes.Record) {
				trimConnector!.setLatestClause(trimType, "top");
			}
			this.loadSearchClauses();
		}
	}

	private loadSearchClauses = async (): Promise<void> => {
		const {
			trimType,
			includeShortCuts,
			onQueryChange,
			trimConnector,
			callChangeOnLoad,
			appStore,
			startingSearch,
		} = this.props;

		if (includeShortCuts && onQueryChange) {
			onQueryChange(this._getQuery("container"));
		}

		const searchClauseGroup = await trimConnector!.getEnum("SearchClauseGroup");
		const searchClauseFormats = await trimConnector!.getEnum(
			"SearchParameterFormats"
		);
		let latestClause = ""; // = trimConnector!.getLatestClause(trimType);
		let latestFormat = "";
		const searchClauses: string[] = (config.SEARCH_CLAUSES || {})[trimType] || [
			"anyWord",
			"content",
		];

		let searchTypeOptions: IComboBoxOption[] = includeShortCuts
			? [
					{
						key: "goto",
						text: appStore!.messages.web_show,
					},
					{
						key: "div",
						text: "",
						itemType: SelectableOptionMenuItemType.Divider,
					},
			  ]
			: [];

		let lastGroup = "";

		const addClausesToList = (
			clauseDefs: ISearchClauseOrFieldDef[],
			key: string
		) => {
			clauseDefs.forEach((clauseDef: ISearchClauseOrFieldDef) => {
				if (
					(clauseDef.ClauseDef || []).IsBlocked === false &&
					(clauseDef.IsFavorite ||
						clauseDef.IsRecent ||
						searchClauses.length === 0 ||
						searchClauses.includes(clauseDef.ClauseName))
				) {
					if (
						this._clauseGrouping === "category" ||
						this._clauseGrouping === "format"
					) {
						if (lastGroup !== key) {
							lastGroup = key;
							let enumItem: IEnumDetails;
							if (this._clauseGrouping === "category") {
								enumItem = searchClauseGroup.find((sg) => {
									return sg.Name == key;
								})!;
							} else {
								enumItem = searchClauseFormats.find((sg) => {
									return sg.Name == key;
								})!;
							}
							const text = enumItem ? enumItem.Caption : key;
							searchTypeOptions.push({
								key: key,
								text: text,
								itemType: SelectableOptionMenuItemType.Header,
							});
						}
					}

					if ((clauseDef.ClauseDef || {}).InternalName === startingSearch) {
						latestClause = key + clauseDef.ClauseName;

						latestFormat =
							clauseDef.SearchParameterFormat || clauseDef.ParameterFormat;
					}

					searchTypeOptions.push({
						key: key + clauseDef.ClauseName,
						text: clauseDef.Caption,
						data: clauseDef,
					});
				}
			});
		};

		const clauses = await trimConnector!.getSearchClauseOrFieldDefinitions(
			trimType
		);
		if (this._clauseGrouping === "format") {
			const clauseMap = this.groupBy(clauses, function (sc: any) {
				const g = [sc.SearchParameterFormat];

				return g;
			});

			const keys = Array.from(clauseMap.keys());

			keys
				.sort((a: any, b: any) => {
					return a < b ? -1 : 1;
				})
				.forEach((key) => {
					const clauseDefs = clauseMap.get(key);
					addClausesToList(clauseDefs, key);
				});
		} else if (this._clauseGrouping === "category") {
			const favLabel = searchClauseGroup.find((sg) => {
				return sg.Name == "Favorite";
			})!.Caption;

			const recentLabel = searchClauseGroup.find((sg) => {
				return sg.Name == "Recent";
			})!.Caption;

			const clauseMap = this.groupBy(clauses, function (sc: any) {
				const g = [sc.MethodGroup];
				if (sc.IsRecent === true) {
					g.push(recentLabel);
				}
				if (sc.IsFavorite === true) {
					g.push(favLabel);
				}
				return g;
			});

			const keys = Array.from(clauseMap.keys());

			keys
				.sort((a: any, b: any) => {
					if (b === favLabel && a === recentLabel) {
						return 1;
					}
					if (a === favLabel || a === recentLabel) {
						return -1;
					}
					if (b === favLabel || b === recentLabel) {
						return 1;
					}
					return a < b ? -1 : 1;
				})
				.forEach((key) => {
					const clauseDefs = clauseMap.get(key);
					addClausesToList(clauseDefs, key);
				});
		} else {
			addClausesToList(
				clauses.sort(function (a, b) {
					return a.Caption > b.Caption ? 1 : -1;
				}),
				""
			);
		}
		if (!includeShortCuts) {
			this.setState({
				searchType: latestClause,
				searchQuery: "",
				searchFormat: latestFormat,
				searchTypeOptions: searchTypeOptions,
			});
		} else {
			this.setState({ searchTypeOptions: searchTypeOptions });
		}
		if (this._loaded === false && latestFormat === "Boolean") {
			this._loaded = true;
			if (callChangeOnLoad === true && onQueryChange) {
				onQueryChange(latestClause);
			}
		}

		return Promise.resolve();
	};

	private getStyles(): string {
		const { wideDisplay } = this.props;
		return mergeStyles({
			selectors: {
				"& .ms-ComboBox-container": {
					display: "inline",
					float: "left",
					marginLeft: "4px",
				},
				"& .trim-search-text": {
					float: "left",
					marginLeft: "4px",
					width: `${wideDisplay ? "calc(100% - 182px)" : "190px"}`,
				},
				"& .trim-search-query": {
					width: `${wideDisplay ? "calc(100% - 180px)" : "190px"}`,
				},
				"& .context-list-title": {
					float: "left",
					width: `${wideDisplay ? "170" : "90"}px`,
				},
				"& .context-list-title .ms-ComboBox": {
					paddingRight: "5px",
					paddingLeft: "5px",
				},
			},
		});
	}

	private groupBy = (list: any, keyGetter: any) => {
		const map = new Map();
		list.forEach((item: any) => {
			const keys = keyGetter(item);
			keys.forEach((key: any) => {
				const collection = map.get(key);
				if (!collection) {
					map.set(key, [item]);
				} else {
					collection.push(item);
				}
			});
		});
		return map;
	};

	private getComboOptions = (): IComboBoxOption[] => {
		const { appStore } = this.props;

		return [
			{ key: "container", text: appStore.messages.web_in_Same_Container },
			{ key: "contacts", text: appStore.messages.web_with_Same_Contacts },
			{ key: "related", text: appStore.messages.web_Related_To },
			{ key: "all_related", text: appStore.messages.web_All_Related_To },
		];
	};

	private _getQuery(key: string) {
		if (key.indexOf("search_") > -1) {
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

	private _comboChange = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	): void => {
		if (option) {
			this.callChange(this._getQuery(option!.key as string));
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
				this.callChange(this._getQuery("container"), key);
			} else {
				if (
					option.data &&
					(option.data.ParameterFormat === "Boolean" ||
						option.data.SearchParameterFormat === "Boolean")
				) {
					this.callChange(option.text, key);
				} else {
					this.callChange("", key);

					if (this._textField.current) {
						this._textField.current.focus();
					}
				}
			}
		}
	};

	private callChange(newQuery: string, newSearchType?: string) {
		const { onQueryChange, trimConnector, trimType } = this.props;
		const { searchTypeOptions, searchType } = this.state;

		const thisSearchType = newSearchType || searchType;

		if (onQueryChange) {
			let fullSearchQuery = newQuery;

			if (thisSearchType != "goto") {
				trimConnector!.setLatestClause(trimType, thisSearchType);

				searchTypeOptions.forEach((so) => {
					if (so.key === thisSearchType) {
						this.setState({
							searchFormat:
								so.data.SearchParameterFormat || so.data.ParameterFormat,
						});
						if (
							so.data.ParameterFormat === "Boolean" ||
							so.data.SearchParameterFormat === "Boolean"
						) {
							onQueryChange(so.data.ClauseName);
						} else if (fullSearchQuery) {
							onQueryChange(so.data.ClauseName + ":" + fullSearchQuery);
						} else {
							onQueryChange("");
						}
					}
				});
			} else {
				onQueryChange(newQuery);
			}
		}

		if (newSearchType) {
			this.setState({ searchQuery: newQuery, searchType: newSearchType });
		} else {
			this.setState({ searchQuery: newQuery });
		}
	}

	private __textChanged = (value: string): void => {
		this.callChange(value!);
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
		const {
			searchQuery,
			searchType,
			searchTypeOptions,
			searchFormat,
		} = this.state;

		const { includeShortCuts, appStore } = this.props;

		const comboOptions = this.getComboOptions();
		const cannedSearchNumber = this._findCannedSearch(searchQuery);
		const defaultProps =
			cannedSearchNumber > -1
				? {
						selectedKey: comboOptions[cannedSearchNumber].key,
				  }
				: { value: searchQuery };

		const comboProps = {
			calloutProps: {
				hideOverflow: true,
				className: this.getComboStyles(),
			},
		};

		return (
			<div className={"search-bar " + this.getStyles()}>
				<ComboBox
					{...comboProps}
					className="context-list-title"
					options={searchTypeOptions}
					selectedKey={searchType}
					onChange={this._comboChangeSearchType}
					allowFreeform={false}
					autoComplete="on"
					onRenderLowerContent={() => {
						return (
							<ComboBox
								selectedKey={this._clauseGrouping}
								options={[
									{ key: "category", text: appStore.messages.web_category },
									{ key: "alphabetic", text: appStore.messages.web_alpha },
									{ key: "format", text: appStore.messages.web_format },
								]}
								onChange={(event, option) => {
									this._clauseGrouping = `${option!.key}`;
									this.setState({ searchTypeOptions: [] }, () => {
										this.loadSearchClauses();
									});
								}}
							/>
						);
					}}
				/>

				{includeShortCuts && searchType === "goto" ? (
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
				) : !searchFormat || searchFormat === "Boolean" ? null : (
					<TextField
						onBeforeChange={this._textChange}
						className="trim-search-text"
						componentRef={this._textField}
						value={searchQuery}
					/>
				)}
			</div>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(SearchBar));
