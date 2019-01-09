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
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";

export interface ITrimObjectSearchListState {
	q?: string;
	items: ITrimMainObject[];
	lastScrollPos: number;
	scrollDirection: string;
	searchShortCuts: any;
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
		const { trimConnector, trimType } = this.props;
		if (trimConnector) {
			trimConnector!.getSearchClauseDefinitions(trimType!).then((data) => {
				const sc = { ...this.state.searchShortCuts };

				data.forEach((clauseDef) => {
					if (sc[trimType!][clauseDef.Id]) {
						sc[trimType!][clauseDef.Id].ToolTip = clauseDef.ToolTip;
						sc[trimType!][clauseDef.Id].Caption = clauseDef.Caption;
					}
				});

				this.setState({ searchShortCuts: sc });
			});

			if (trimType === BaseObjectTypes.Location) {
				trimConnector!.getMessages().then((messages) => {
					const sc = { ...this.state.searchShortCuts };
					sc[trimType!]["Me"].Caption = messages.bob_sbMe;
				});
			}
		}
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
	}

	private _onShortcutClick = (query: string) => {
		this._newQuery = query;
		this.doSearch();
	};

	public render(): JSX.Element {
		return (
			<div className="trim-search-list-outer">
				<div className="trim-search-shortcuts">
					<ul>
						{Object.keys(this.state.searchShortCuts[this.props.trimType!]).map(
							(key: any, index: number) => {
								const sc = this.state.searchShortCuts[this.props.trimType!][
									key
								];
								return (
									<TooltipHost
										key={key}
										tooltipProps={{
											onRenderContent: () => {
												return (
													<div>
														<div className="ms-fontWeight-semibold">
															{sc.Caption}
														</div>
														<div>{sc.ToolTip}</div>
													</div>
												);
											},
										}}
										id="myID"
										calloutProps={{ gapSpace: 0 }}
									>
										<li
											key={key}
											onClick={() => {
												this._onShortcutClick(sc.q);
											}}
										>
											<img src={`/assets/${sc.src}_x32.png`} />
										</li>
									</TooltipHost>
								);
							}
						)}
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
		event.preventDefault();
		this._onTrimObjectSelected(
			Number(
				(event.nativeEvent.target! as HTMLDivElement).getAttribute(
					"data-trim-uri"
				)
			)
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
			searchShortCuts: {
				[BaseObjectTypes.Record]: {
					RecordMyContainers: {
						src: "recmycontainerstray",

						q: "recMyContainers",
					},
					RecordMyDocuments: {
						src: "recrecentdocstray",

						q: "recMyDocuments",
					},
					Favorite: { src: "recfavoritestray", q: "unkFavorite" },
					RecordWorkTray: { src: "recworktray", q: "recWorkTray" },
					RecordInTray: { src: "recintray", q: "recInTray" },
					RecordDueOrInTray: { src: "recinduetray", q: "recDueOrInTray" },
				},
				[BaseObjectTypes.Location]: {
					Favorite: { src: "recfavoritestray", q: "unkFavorite" },
					Me: { src: "User", q: "me" },
					All: { src: "loc_list", q: "unkAll" },
				},
			},
		};
	}
}

export default inject("trimConnector")(TrimObjectSearchList);
