import * as React from "react";
import { inject, observer } from "mobx-react";
import {
	DetailsList,
	Stack,
	Dialog,
	PrimaryButton,
	PivotItem,
	PivotLinkFormat,
	PivotLinkSize,
	Pivot,
	Sticky,
	IRenderFunction,
	ScrollablePane,
	StickyPositionType,
	//mergeStyles,
} from "office-ui-fabric-react";
import {
	IColumn,
	DetailsListLayoutMode,
	SelectionMode,
	Selection,
	IDetailsHeaderProps,
} from "office-ui-fabric-react/lib/DetailsList";
import {
	ITrimConnector,
	ITrimProperty,
	IPropertyOrFieldDef,
	ITrimMainObject,
	IObjectDetails,
} from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { IAppStore } from "../../stores/AppStoreBase";
import SearchBar from "../SearchBar/SearchBar";
import PropertySetTypes from "src/trim-coms/PropertySetTypes";
import ObjectContextMenu from "../ObjectContextMenu/ObjectContextMenu";
import DetailsView from "../DetailsView";
import Preview from "../Preview/Preview";

//import { mergeStyles } from "@uifabric/styling";

export interface ITrimSearchDialogState {
	columns: IColumn[];
	items: NullableDocument[];
	hideContext: boolean;
	selectionDetails: ITrimMainObject;
	showViewPane: boolean;
	recordDetails: IObjectDetails;
	height: number;
	showPreview: boolean;
}

export interface ITrimSearchDialogProps {
	trimConnector: ITrimConnector;
	trimType: BaseObjectTypes;
	appStore: IAppStore;
}

export interface IDocument {
	key: string;
	name: string;
	[x: string]: any;
}

const PAGING_SIZE: number = 30;
const PAGING_DELAY = 500;

type NullableDocument = IDocument | null;

export class TrimSearchGrid extends React.Component<
	ITrimSearchDialogProps,
	ITrimSearchDialogState
> {
	private _allItems: NullableDocument[] = [];
	private _q: string = "unkNone";
	private _sortBy: string;
	private _isFetchingItems: boolean;
	private _selection: Selection;

	constructor(props: ITrimSearchDialogProps) {
		super(props);

		this.state = {
			items: this._allItems,
			columns: [],
			hideContext: true,
			selectionDetails: { Uri: 0 },
			showViewPane: false,
			recordDetails: { results: [], propertiesAndFields: [] },
			height: window.innerHeight,
			showPreview: false,
		};

		this._selection = new Selection({
			onSelectionChanged: () => {
				this.setState({
					selectionDetails: this._getSelectionDetails(),
				});
			},
		});
	}

	updateDimensions = () => {
		this.setState({ height: window.innerHeight });
	};

	async componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
		window.addEventListener("load", this.updateDimensions);
		this.loadRows();
	}

	componentDidUpdate(
		prevProps: ITrimSearchDialogProps,
		prevState: ITrimSearchDialogState
	) {
		const { showViewPane, selectionDetails, recordDetails } = this.state;

		if (
			showViewPane === true &&
			selectionDetails.Uri > 0 &&
			selectionDetails.Uri !== prevState.selectionDetails.Uri
		) {
			this.loadRecordDetails();
		}

		if (
			recordDetails.results.length > 0 &&
			this.state.selectionDetails.Uri === 0
		) {
			this.setState({
				recordDetails: { results: [], propertiesAndFields: [] },
			});
		}
	}

	// private getStyles(): string {
	// 	const { height } = this.state;
	// 	return mergeStyles({
	// 		selectors: {
	// 			"& .ms-DetailsList-contentWrapper": {
	// 				height: `${height - 160}px`,
	// 			},
	// 		},
	// 	});
	// }

	private loadRecordDetails = (): any => {
		const { trimConnector, trimType } = this.props;
		const { selectionDetails } = this.state;
		return trimConnector!
			.getObjectDetails(trimType, selectionDetails.Uri)
			.then((response: IObjectDetails) => {
				this.setState({ recordDetails: response });
			});
	};

	private async loadRows() {
		const { trimConnector, trimType, appStore } = this.props;
		const { columns } = this.state;
		appStore.setSpinning(true);

		let startAt = this._allItems.length;
		if (startAt > 0) {
			startAt++;
		}
		try {
			const gridRows = await trimConnector.gridSearch({
				q: this._q,
				trimType,
				purpose: 0,
				sortBy: this._sortBy,
				pageSize: PAGING_SIZE,
				start: startAt,
			});

			gridRows.results.forEach((row) => {
				let gridRow = { key: `${row.Uri}`, name: `${row.Uri}` };
				for (var propertyName in row) {
					if (row[propertyName].hasOwnProperty("StringValue")) {
						gridRow[propertyName] = (row[
							propertyName
						] as ITrimProperty).StringValue;
					}

					if (propertyName === "RecordRecordType") {
						const icon = row[propertyName].Icon;
						gridRow["Icon"] = icon.Hash || icon.Id;
					}
				}

				for (var fieldName in row.Fields) {
					if (row.Fields[fieldName].hasOwnProperty("StringValue")) {
						gridRow[fieldName] = (row.Fields[
							fieldName
						] as ITrimProperty).StringValue;
					}
				}

				this._allItems.push(gridRow);
			});
			if (gridRows.hasMoreItems === true) {
				this._allItems.push(null);
			}
			if (columns.length === 0) {
				let propertyDefs: IPropertyOrFieldDef[] = gridRows.PropertiesAndFields;
				if (!propertyDefs) {
					propertyDefs = await trimConnector.getViewPanePropertyDefs(
						trimType,
						PropertySetTypes.DataGridVisible
					);
				}
				const newColumns = this.makeColumns(propertyDefs);
				this.setState({ columns: newColumns });
			} else {
				this.setState({ items: [...this._allItems] });
				this.forceUpdate();
			}
			appStore.setSpinning(false);
		} catch (e) {
			appStore.setError(e);
		}
	}

	private makeColumns(propertyOrFieldDefs: IPropertyOrFieldDef[]): IColumn[] {
		const columns: IColumn[] = [];
		const { trimConnector } = this.props;
		const servicePath = trimConnector.getServiceAPIPath();

		propertyOrFieldDefs.forEach((propertyDef) => {
			const col: IColumn = {
				key: propertyDef.Id,
				name: propertyDef.Caption,
				minWidth: propertyDef.ColumnWidth,
				fieldName: propertyDef.Id,
				data: propertyDef,
				isResizable: true,
			};

			if (propertyDef.IconAndOrTextMode === "Icon") {
				col.onRender = (item: IDocument, index: number, column: IColumn) => {
					const iconName = `${servicePath}/TrimIcon/W24h24/${item.Icon}.png`;
					return (
						<span>
							<img src={iconName} />
							{/* <div className="ms-BrandIcon--icon16 ms-BrandIcon--word" /> */}
						</span>
					);
				};
			}

			columns.push(col);
		});

		return columns;
	}

	public render(): JSX.Element {
		const {
			columns,
			items,
			hideContext,
			selectionDetails,
			showViewPane,
			recordDetails,
			height,
			showPreview,
		} = this.state;
		const { trimType } = this.props;

		let leftColSize = "12";
		let viewPaneSize = "3";
		if (showViewPane) {
			leftColSize = showPreview ? "7" : "9";
			viewPaneSize = showPreview ? "5" : "3";
		}

		return (
			<Stack>
				<div className="ms-Grid" dir="ltr">
					<div
						className="ms-Grid-row"
						style={{
							backgroundColor: "rgb(244,244,244)",
							marginTop: "-8px",
							paddingTop: "8px",
							marginLeft: "-8px",
						}}
					>
						<div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
							<ObjectContextMenu
								trimType={trimType}
								isInList={false}
								record={selectionDetails}
								showViewPane={showViewPane}
								onCommandComplete={(key) => {
									if (key === "viewpane") {
										if (!showViewPane === true) {
											this.loadRecordDetails();
										}
										this.setState({ showViewPane: !showViewPane });
									}
								}}
							/>
						</div>
						<div className="ms-Grid-col ms-sm9 ms-md9 ms-lg9">
							<SearchBar
								trimType={trimType}
								includeShortCuts={false}
								wideDisplay={true}
								onQueryChange={this._changeQuery}
								callChangeOnLoad={true}
							/>
						</div>
						<div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">
							<PrimaryButton onClick={this._doSearch}>Search</PrimaryButton>
						</div>
					</div>
				</div>
				<div className="ms-Grid" dir="ltr">
					<div className="ms-Grid-row">
						<div
							className={`ms-Grid-col ms-sm${leftColSize} ms-md${leftColSize} ms-lg${leftColSize}`}
						>
							<ScrollablePane style={{ height: `${height - 55}px` }}>
								<DetailsList
									columns={columns}
									items={items}
									onColumnHeaderClick={this._onColumnHeaderClick}
									layoutMode={DetailsListLayoutMode.fixedColumns}
									isHeaderVisible={true}
									onItemContextMenu={this._onContextMenu}
									onRenderMissingItem={this._onRenderMissingItem}
									listProps={{
										renderedWindowsAhead: 0,
									}}
									selectionMode={SelectionMode.single}
									selection={this._selection}
									selectionPreservedOnEmptyClick={true}
									onRenderDetailsHeader={
										// tslint:disable-next-line:jsx-no-lambda
										(
											detailsHeaderProps: IDetailsHeaderProps,
											defaultRender: IRenderFunction<IDetailsHeaderProps>
										) => {
											return (
												<Sticky stickyPosition={StickyPositionType.Both}>
													{defaultRender(detailsHeaderProps)}
												</Sticky>
											);
										}
									}
								/>
							</ScrollablePane>
						</div>

						<div
							className={`ms-Grid-col ms-sm${viewPaneSize} ms-md${viewPaneSize} ms-lg${viewPaneSize}`}
							style={{
								transform: showViewPane ? "translate(0)" : "scale(0)",
								paddingRight: "0",
							}}
						>
							<Pivot
								linkFormat={PivotLinkFormat.tabs}
								linkSize={PivotLinkSize.normal}
								style={{ marginTop: "8px" }}
								onLinkClick={(item: PivotItem) => {
									this.setState({
										showPreview:
											item.props.itemKey === "preview" ? true : false,
									});
								}}
							>
								<PivotItem headerText="Properties" key="properties">
									<DetailsView
										trimType={trimType}
										recordDetails={recordDetails}
										className="wd-viewpane"
									/>
								</PivotItem>
								<PivotItem headerText="Preview" key="preview" itemKey="preview">
									<Preview record={recordDetails.results[0]} />
								</PivotItem>
							</Pivot>
						</div>
					</div>
				</div>

				<Dialog hidden={hideContext}>
					<div>test</div>
				</Dialog>
			</Stack>
		);
	}

	private _getSelectionDetails(): ITrimMainObject {
		const selectionCount = this._selection.getSelectedCount();
		if (selectionCount === 1) {
			return {
				Uri: Number((this._selection.getSelection()[0] as IDocument).key),
			};
		}
		return { Uri: 0 };
	}

	private _onDataMiss(): void {
		if (!this._isFetchingItems) {
			this._isFetchingItems = true;

			setTimeout(async () => {
				this._allItems.pop();
				await this.loadRows();
				this._isFetchingItems = false;
			}, PAGING_DELAY);
		}
	}

	private _onRenderMissingItem = (index: number): null => {
		if ((this, this._allItems.length > 0)) {
			this._onDataMiss();
		}

		return null;
	};

	private _onContextMenu = (): void => {
		const { hideContext } = this.state;
		this.setState({ hideContext: !hideContext });
	};

	private _doSearch = (): void => {
		this._allItems.length = 0;
		this.loadRows();
	};

	private _changeQuery = (newText: string): void => {
		if (newText !== this._q) {
			this._q = newText;
		}
	};
	/*
	private _getKey(item: any, index?: number): string {
		if (item) {
		return item.key;
		}
	}

	*/
	private _onColumnHeaderClick = async (
		ev: React.MouseEvent<HTMLElement>,
		column: IColumn
	) => {
		const { columns } = this.state;
		const { trimConnector, trimType } = this.props;
		if (column.data.SortMode === "None") {
			return;
		}

		const newColumns: IColumn[] = columns.slice();
		const currColumn: IColumn = newColumns.filter(
			(currCol) => column.key === currCol.key
		)[0];

		let searchClause = column.data.Id;
		if (column.data.IsAProperty === true) {
			const clauseDefs = await trimConnector!.getSearchClauseOrFieldDefinitions(
				trimType
			);

			const searchClauseDef = clauseDefs.find((c) => {
				return c.ClauseDef && c.ClauseDef.BasedOnProperty === column.data.Id;
			});

			if (!searchClauseDef) {
				return;
			}
			searchClause = searchClauseDef.ClauseDef.InternalName;
		}

		newColumns.forEach((newCol: IColumn) => {
			if (newCol === currColumn) {
				currColumn.isSortedDescending = !currColumn.isSortedDescending;
				currColumn.isSorted = true;

				if (currColumn.isSortedDescending === false) {
					searchClause += "-";
				}
			} else {
				newCol.isSorted = false;
				newCol.isSortedDescending = true;
			}
		});

		this.setState({
			columns: newColumns,
		});

		this._allItems = [];
		this._sortBy = searchClause;
		await this.loadRows();
		this.setState({ items: this._allItems });
	};
}

/*
function _fileIcon(): { docType: string; url: string } {
	const docType: string = FILE_ICONS[Math.floor(Math.random() * FILE_ICONS.length)].name;
	return {
	  docType,
	  url: `https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${docType}.svg`,
	};
  }
*/
export default inject("appStore", "trimConnector")(observer(TrimSearchGrid));
