import * as React from "react";
import {
  ContextualMenu,
  IContextualMenuItem
} from "office-ui-fabric-react/lib/ContextualMenu";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import {
  DetailsList,
  IColumn,
  Selection
} from "office-ui-fabric-react/lib/DetailsList";

import "../index.css";
import { IListProps } from "office-ui-fabric-react/lib/List";
import {
  IBobListState,
  IDocument,
  searchAction,
  loadNextPageAction
} from "../redux/actions2";
//import { LocalizedFontFamilies } from "@uifabric/styling/lib/styles/fonts";

let _items: IDocument[] = [];

/*
export interface IBobListState {
  columns: IColumn[];
  items: IDocument[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  queryText: string;
  lastItem: number;
  morePages: boolean;
  listMenuEvent?: MouseEvent;
  showContextMenu: boolean;
}


export interface IDocument {
  [key: string]: any;
  RecordNumber: string;
  RecordTitle: string;
  iconName: string;
  modifiedBy?: string;
  dateModified?: string;
  dateModifiedValue?: number;
  fileSize?: string;
  fileSizeRaw?: number;
}*/

export class BobList extends React.Component<any, IBobListState> {
  private _selection: Selection;

  constructor(props: any) {
    super(props);

    this._onSearch = this._onSearch.bind(this);
    this.props.store.subscribe(() => {
      console.log(this.props.store.getState());
      this.setState(this.props.store.getState());
    });
    const _columns: IColumn[] = [
      {
        key: "column1",
        name: "File Type",
        headerClassName: "DetailsListExample-header--FileIcon",
        className: "DetailsListExample-cell--FileIcon",
        iconClassName: "DetailsListExample-Header-FileTypeIcon",
        ariaLabel: "Column operations for File type",
        iconName: "Page",
        isIconOnly: true,
        fieldName: "name",
        minWidth: 16,
        maxWidth: 16,
        onColumnClick: this._onColumnClick,
        onRender: (item: IDocument) => {
          return (
            <img
              src={item.iconName}
              className={"DetailsListExample-documentIconImage"}
              onError={this._onIconMissing}
            />
          );
        }
      },
      {
        key: "column2",
        name: "Record Number",
        fieldName: "RecordNumber",
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true
      },
      {
        key: "column3",
        name: "Record Title",
        fieldName: "RecordTitle",
        minWidth: 70,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true
      }
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          isModalSelection: this._selection.isModal()
        });
      }
    });

    this.state = {
      items: _items,
      columns: _columns,
      selectionDetails: this._getSelectionDetails(),
      isModalSelection: this._selection.isModal(),
      isCompactMode: false,
      queryText: "",
      // lastItem: 1,
      morePages: true,
      showContextMenu: false,
      loadNextPage: false
    };
  }

  public render() {
    const menuItems: IContextualMenuItem[] = [
      { key: "newItem", text: "New", onClick: () => console.log("new clicked") }
    ];
    const { columns, isCompactMode, items } = this.state;

    // this.props.store.subscribe(() => console.log(this.props.store.getState()));

    return (
      <div className="ms-Grid">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-lg10">
            <SearchBox
              placeholder="Search CM"
              onChange={this._onQueryChange}
              onSearch={this._searchClicked}
            />
          </div>
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
            <DefaultButton text={"Search"} onClick={this._searchClicked} />
          </div>
        </div>
        <DetailsList
          items={items}
          compact={isCompactMode}
          columns={columns}
          onShouldVirtualize={this._onVirtualize}
          onRowDidMount={this._rowDidMount}
          onItemContextMenu={this._onContextMenu}
          onActiveItemChanged={this._onItemActivated}
        />
        {this.state.showContextMenu ? (
          <ContextualMenu target={this.state.listMenuEvent} items={menuItems} />
        ) : null}
      </div>
    );
  }

  private _onSearch(): void {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch();
    }
  }

  private _onItemActivated = (): void => {
    this.setState({ showContextMenu: false });
  };
  private _onContextMenu = (item?: any, index?: number, ev?: Event): void => {
    console.log(ev);
    this.setState({ showContextMenu: true, listMenuEvent: ev as MouseEvent });
  };

  private _onVirtualize = (props: IListProps): boolean => {
    //console.log("fff");
    return true;
  };

  private _rowDidMount = (item?: any, index?: number): void => {
    console.log(
      this.props.store.getState().items.length - 1 + " -------" + index
    );
    if (
      this.props.store.getState().morePages === true &&
      this.props.store.getState().items.length - 1 === index
    ) {
      this.props.store.dispatch(loadNextPageAction(true));
      this._onSearch();
    }
  };

  private _searchClicked = (): void => {
    this.props.store.dispatch(loadNextPageAction(false));
    this._onSearch();
  };
  /*
  private doSearch = (): void => {
    this._onSearch();
  };*/

  private _onIconMissing(e: React.FormEvent<HTMLImageElement>) {
    e.currentTarget.style.display = "none";
  }

  private _onQueryChange = (newValue: any): void => {
    this.props.store.dispatch(searchAction(newValue));
  };

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return "No items selected";
      case 1:
        return (
          "1 item selected: " + (this._selection.getSelection()[0] as any).name
        );
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    const { columns, items } = this.state;
    let newItems: IDocument[] = items.slice();
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol: IColumn, idx: number) => {
        return column.key === currCol.key;
      }
    )[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    newItems = this._sortItems(
      newItems,
      currColumn.fieldName || "",
      currColumn.isSortedDescending
    );
    this.setState({
      columns: newColumns,
      items: newItems
    });
  };
  /*
  private _randomFileIcon(docType: string): { docType: string; url: string } {
    return {
      docType,
      url: `http://localhost:3000/images/webicons/${docType.toLocaleLowerCase()}_x16.png`
    };
  }
*/
  private _sortItems = (
    items: IDocument[],
    sortBy: string,
    descending = false
  ): IDocument[] => {
    if (descending) {
      return items.sort((a: IDocument, b: IDocument) => {
        if (a[sortBy] < b[sortBy]) {
          return 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return -1;
        }
        return 0;
      });
    } else {
      return items.sort((a: IDocument, b: IDocument) => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }
        return 0;
      });
    }
  };
}

export default BobList;
