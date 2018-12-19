import * as React from "react";
import "./TrimObjectSearchList.css";
import { inject } from "mobx-react";
import { ITrimObjectSearchListProps } from "./TrimObjectSearchList.types";
import { List, IListProps } from "office-ui-fabric-react/lib/List";
import {
	ITrimMainObject,
	ISearchResults,
} from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

export interface ITrimObjectSearchListState {
	q?: string;
	items: ITrimMainObject[];
	lastScrollPos: number;
	scrollDirection: string;
}

export class TrimObjectSearchList extends React.Component<
	ITrimObjectSearchListProps,
	ITrimObjectSearchListState
> {
	constructor(props: ITrimObjectSearchListProps) {
		super(props);

		this._onTrimObjectSelected = this._onTrimObjectSelected.bind(this);

		this.state = this._getDefaultState();
	}

	componentDidMount() {
		this.doSearch();
	}

	private _newQuery = "";
	private _searchRunning = false;
	private _hasMore = true;
	private doSearch(start: number = 1): void {
		if (start < 2) {
			this._hasMore = true;
		}
		if (this._searchRunning === true || this._hasMore === false) {
			return;
		}
		this._searchRunning = true;
		const { trimConnector, trimType, q, purpose } = this.props;

		if (trimConnector && trimType) {
			trimConnector!
				.search<ISearchResults<ITrimMainObject>>({
					trimType: trimType,
					q: this._newQuery || q || "unkAll",
					purpose: purpose || 0,
					start,
				})
				.then((response: ISearchResults<ITrimMainObject>) => {
					this._hasMore = response.hasMoreItems;
					if (start > 1) {
						this.setState((prevState) => ({
							items: [...prevState.items, ...response.results],
						}));
					} else {
						this.setState({ items: response.results });
					}
					this._searchRunning = false;
				})
				.catch(() => {
					this._searchRunning = false;
				});
		}
	}

	private _onTrimObjectSelected(uri: number): void {
		const { onTrimObjectSelected } = this.props;
		if (onTrimObjectSelected && uri > 0) {
			const trimObject = this.state.items.find((i) => {
				return i.Uri == uri;
			});
			onTrimObjectSelected(trimObject);
		}
		// const { item, itemIndex } = row.props;
		// const itemKey = this._getItemKey(item, itemIndex);
		// this._activeRows[itemKey] = row; // this is used for column auto resize
		// this._setFocusToRowIfPending(row);
		// const { onRowDidMount } = this.props;
		// if (onRowDidMount) {
		//   onRowDidMount(item, itemIndex);
		// }
	}

	private _onShortcutClick = (query: string) => {
		this._newQuery = query;
		this.doSearch();
	};

	public render(): JSX.Element {
		const searchShortCuts = {
			[BaseObjectTypes.Record]: [
				{
					src: "recmycontainerstray",
					key: "myContainers",
					q: "recMyContainers",
				},
				{
					src: "recrecentdocstray",
					key: "recentDocuments",
					q: "recMyDocuments",
				},
				{ src: "recfavoritestray", key: "favourite", q: "unkFavorite" },
				{ src: "recworktray", key: "workTray", q: "recWorkTray" },
				{ src: "recintray", key: "inTray", q: "recInTray" },
				{ src: "recinduetray", key: "dueTray", q: "recDueOrInTray" },
			],
			[BaseObjectTypes.Location]: [
				{ src: "recfavoritestray", key: "favourite", q: "unkFavorite" },
				{ src: "User", key: "me", q: "me" },
				{ src: "loc_list", key: "all", q: "unkAll" },
			],
		};

		return (
			<div className="trim-search-list-outer">
				<div className="trim-search-shortcuts">
					<ul>
						{searchShortCuts[this.props.trimType!].map((sc: any) => {
							return (
								<li
									key={sc.key}
									onClick={() => {
										this._onShortcutClick(sc.q);
									}}
								>
									<img src={`/assets/${sc.src}_x32.png`} />
								</li>
							);
						})}
					</ul>
				</div>
				<div
					className="trim-list-container is-scrollable"
					data-is-scrollable="true"
					onScroll={this._onScroll}
				>
					<List
						items={this.state.items}
						onRenderCell={this._onRenderCell}
						onShouldVirtualize={this._onVirtualize}
						onClick={this._onListClick}
					/>
				</div>
			</div>
		);
	}

	private _onListClick = (event: React.MouseEvent<HTMLDivElement>): void => {
		this._onTrimObjectSelected(
			Number(event.currentTarget.attributes.getNamedItem("data-trim-uri"))
		);
	};

	private _onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
		if (this.state.lastScrollPos > event.currentTarget.scrollTop) {
			this.setState({
				scrollDirection: "up",
				lastScrollPos: event.currentTarget.scrollTop,
			});
		} else if (this.state.lastScrollPos < event.currentTarget.scrollTop) {
			this.setState({
				scrollDirection: "down",
				lastScrollPos: event.currentTarget.scrollTop,
			});
		}
	};

	private _onVirtualize = (props: IListProps): boolean => {
		return true;
	};

	private _onRenderCell = (
		item: any,
		index: number | undefined,
		isScrolling: boolean
	): JSX.Element => {
		if (
			this.state.scrollDirection === "down" &&
			index! + 1 === this.state.items.length
		) {
			this.doSearch(this.state.items.length + 1);
		}
		return (
			<div className="trim-list-row" data-trim-uri={item.Uri}>
				{item.NameString}
			</div>
		);
	};

	private _getDefaultState(
		props: ITrimObjectSearchListProps = this.props
	): ITrimObjectSearchListState {
		return {
			q: "",
			items: [],
			lastScrollPos: 0,
			scrollDirection: "",
		};
	}
}

export default inject("trimConnector")(TrimObjectSearchList);
