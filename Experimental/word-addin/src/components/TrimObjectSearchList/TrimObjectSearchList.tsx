import * as React from "react";
import "./TrimObjectSearchList.css";
import { inject } from "mobx-react";
import { ITrimObjectSearchListProps } from "./TrimObjectSearchList.types";
import { List, IListProps } from "office-ui-fabric-react/lib/List";
import {
	ITrimMainObject,
	ISearchResults,
	IClassification,
} from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import {
	Breadcrumb,
	IBreadcrumbItem,
} from "office-ui-fabric-react/lib/Breadcrumb";

export interface ITrimObjectSearchListState {
	q?: string;
	items: ITrimMainObject[];
	ancestors: ITrimMainObject[];
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

	componentDidUpdate(prevProps: ITrimObjectSearchListProps) {
		if (prevProps.q !== this.props.q) {
			this.doSearch();
		}
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
		const { trimConnector, trimType, q, purpose, purposeExtra } = this.props;

		if (trimConnector && trimType) {
			trimConnector!
				.search<ISearchResults<ITrimMainObject>>({
					trimType: trimType,
					q: this._newQuery || q || "unkAll",
					purpose: purpose || 0,
					purposeExtra: purposeExtra || 0,
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

	private _onTrimObjectContainerSearch(uri: number): void {
		const { includeAlternateWhenShowingFolderContents, trimType } = this.props;

		let clause = includeAlternateWhenShowingFolderContents
			? "recContainerEx"
			: "recContainer";

		if (trimType === BaseObjectTypes.Classification) {
			clause = "plnParent";
		}
		if (trimType === BaseObjectTypes.Location) {
			clause = "locMembers";
		}

		const ancestors = this.state.ancestors.slice(0);
		const currentAncestor = ancestors.find((a) => {
			return a.Uri === uri;
		});

		if (currentAncestor) {
			while (ancestors[ancestors.length - 1].Uri !== uri) {
				ancestors.pop();
			}
		} else {
			this.state.items.forEach((item) => {
				if (item.Uri === uri) {
					ancestors.push(item);
				}
			});
		}
		this.setState({ ancestors: ancestors });

		this._onShortcutClick(`${clause}:${uri}`, true);
	}

	private _onShortcutClick = (query: string, containerSearch = false) => {
		if (!containerSearch) {
			this.setState({ ancestors: [] });
		}
		this._newQuery = query;
		this.doSearch();
	};

	private _onBreadcrumbItemClicked = (
		ev: React.MouseEvent<HTMLElement>,
		item: IBreadcrumbItem
	): void => {
		ev.preventDefault();
		this._onTrimObjectContainerSearch(Number(item.key));
	};

	public render(): JSX.Element {
		const { trimType } = this.props;
		const { searchShortCuts, items, ancestors } = this.state;

		return (
			<div className="trim-search-list">
				{ancestors.length > 0 && (
					<Breadcrumb
						items={ancestors.map((a) => {
							return {
								text:
									trimType === BaseObjectTypes.Classification
										? (a as IClassification).Name.Value
										: a.NameString!,
								key: String(a.Uri),
								onClick: this._onBreadcrumbItemClicked,
							};
						})}
					/>
				)}
				<div className="trim-search-list-outer">
					<div className="trim-search-shortcuts">
						<ul>
							{Object.keys(searchShortCuts[trimType!]).map(
								(key: any, index: number) => {
									const sc = searchShortCuts[trimType!][key];
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
							items={items}
							onRenderCell={this._onRenderCell}
							onShouldVirtualize={this._onVirtualize}
							onClick={this._onListClick}
						/>
					</div>
				</div>
			</div>
		);
	}

	private findAncestor(el: HTMLElement): HTMLElement | null {
		let elReturn: HTMLElement | null = el;
		while (
			(elReturn = elReturn.parentElement) &&
			!elReturn.getAttribute("data-trim-uri")
		);
		return elReturn;
	}

	private _onListClick = (event: React.MouseEvent<HTMLDivElement>): void => {
		event.preventDefault();

		const target = event.nativeEvent.target as HTMLElement;
		const el = this.findAncestor(target!);
		if (el) {
			const uri = Number(el.getAttribute("data-trim-uri"));
			if (target.classList && target.classList.contains("trim-find-children")) {
				this._onTrimObjectContainerSearch(uri);
			} else {
				this._onTrimObjectSelected(uri);
			}
		}
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
		item: ITrimMainObject,
		index: number | undefined,
		isScrolling: boolean
	): JSX.Element => {
		if (
			this.state.scrollDirection === "down" &&
			index! + 1 === this.state.items.length
		) {
			this.doSearch(this.state.items.length + 1);
		}

		let icon = "unknownExt";
		if (item.Icon) {
			if (item.Icon.Id && item.Icon.Id !== "Unknown") {
				icon = item.Icon.Id;
			} else if (item.Icon.FileType) {
				icon = item.Icon.FileType;
			}
		}
		return (
			<div className="trim-list-row" data-trim-uri={item.Uri}>
				<div className="trim-list-row-label">
					<div>
						<img src={`/assets/webIcons/${icon}_x16.png`} />
					</div>
					<div>
						{item.ToolTip
							? `${item.ToolTip} (${item.NameString})`
							: item.NameString}
					</div>
				</div>
				{item.PossiblyHasSubordinates && (
					<Icon iconName="NavigateForward" className="trim-find-children" />
				)}
			</div>
		);
	};

	private _getDefaultState(
		props: ITrimObjectSearchListProps = this.props
	): ITrimObjectSearchListState {
		return {
			q: "",
			items: [],
			ancestors: [],
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
					Favorite: { src: "locfavorites", q: "unkFavorite" },
					Me: { src: "User", q: "me" },
					All: { src: "loc_list", q: "unkAll" },
				},
				[BaseObjectTypes.Classification]: {
					Favorite: { src: "fpfavorites", q: "unkFavorite" },
					Top: { src: "navContents", q: "unkTop" },
					All: { src: "fpplans", q: "unkAll" },
					Owner: { src: "fpplans", q: "plnOwner:me" },
				},
			},
		};
	}
}

export default inject("trimConnector")(TrimObjectSearchList);
