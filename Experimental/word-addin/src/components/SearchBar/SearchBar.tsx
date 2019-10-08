import * as React from "react";
import { inject, observer } from "mobx-react";
import "./SearchBar.css";

import {
	ITrimConnector,
	ISearchClauseOrFieldDef,
} from "src/trim-coms/trim-connector";

import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";

import {
	ComboBox,
	IComboBox,
	IComboBoxOption,
	SelectableOptionMenuItemType,
	TextField,
} from "office-ui-fabric-react";

import { debounce } from "throttle-debounce";

const config = (global as any).config;

export class SearchBar extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		className?: string;
		trimType: BaseObjectTypes;
		onChange?: (newQuery: string) => void;
		includeShortCuts: boolean;
	},
	{
		searchQuery: string;
		searchType: string;
		searchTypeOptions: IComboBoxOption[];
		searchFormat: string;
	}
> {
	private _basicComboBox = React.createRef<IComboBox>();
	autocompleteSearchDebounced: any;

	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		className?: string;
		trimType: BaseObjectTypes;
		includeShortCuts: boolean;
	}) {
		super(props);

		this.state = {
			searchQuery: this._getQuery("container"),
			searchType: "goto",
			searchTypeOptions: [],
			searchFormat: "",
		};

		this.autocompleteSearchDebounced = debounce(1000, this.__textChanged);
	}

	componentDidMount() {
		const { trimType, includeShortCuts, onChange } = this.props;

		if (includeShortCuts && onChange) {
			onChange(this._getQuery("container"));
		}

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
		let searchTypeOptions: IComboBoxOption[] = includeShortCuts
			? [{ key: "goto", text: "Show" }]
			: [];

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
			{ key: "container", text: appStore.messages.web_in_Same_Container },
			{ key: "contacts", text: appStore.messages.web_with_Same_Contacts },
			{ key: "related", text: appStore.messages.web_Related_To },
			{ key: "all_related", text: appStore.messages.web_All_Related_To },
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

					if (this._basicComboBox.current) {
						this._basicComboBox.current.focus();
					}
				}
			}
		}
	};

	private callChange(newQuery: string, newSearchType?: string) {
		const { onChange } = this.props;
		const { searchTypeOptions, searchType } = this.state;

		const thisSearchType = newSearchType || searchType;

		if (onChange) {
			let fullSearchQuery = newQuery;

			if (thisSearchType != "goto") {
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
							onChange(so.key);
						} else if (fullSearchQuery) {
							onChange(so.key + ":" + fullSearchQuery);
						} else {
							onChange("");
						}
					}
				});
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

		const comboOptions = this.getComboOptions();
		const cannedSearchNumber = this._findCannedSearch(searchQuery);
		const defaultProps =
			cannedSearchNumber > -1
				? {
						selectedKey: comboOptions[cannedSearchNumber].key,
				  }
				: { value: searchQuery };

		return (
			<span>
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
			</span>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(SearchBar));
