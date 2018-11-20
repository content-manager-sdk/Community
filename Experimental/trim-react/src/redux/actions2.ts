import { ReducerFactory } from "redux-actions-ts-reducer";
import { createAction } from "redux-actions";

import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
//import { fetchRecords } from "./actions";
//import { ActionButton } from "office-ui-fabric-react/lib/Button";

// Sample action creators(redux-actions) and action type constants that reducer can handle
//const negate = createAction("NEGATE"); // action without payload
export const add = createAction<number>("ADD"); // action with payload type `number`
export const searchAction = createAction<string>("SEARCH");
const receiveRecordsAction = createAction<any>("RECEIVE_RECORDS");
export const loadNextPageAction = createAction<boolean>("LOAD_NEXT_PAGE");
//export const fetchRecordsAction = createAction("FETCH_RECORDS");
//const SOME_LIB_NO_ARGS_ACTION_TYPE = '@@some-lib/NO_ARGS_ACTION_TYPE'; // could be useful when action type like this is defined by 3rd party library
//const SOME_LIB_STRING_ACTION_TYPE = '@@some-lib/STRING_ACTION_TYPE'; // could be useful when action type like this is defined by 3rd party library

// type of the state
/*class SampleState {
  count = 0;
  query: string = "";
}*/

export interface ISearchResults {
  Results: [any];
  HasMoreItems: boolean;
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
}

export class IBobListState {
  columns: IColumn[];
  items: IDocument[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  queryText: string;
  morePages: boolean;
  listMenuEvent?: MouseEvent;
  showContextMenu: boolean;
  loadNextPage: boolean;
}

// creating reducer that combines several reducers
export const reducer = new ReducerFactory(new IBobListState())
  // `state` argument and return type is inferred based on `new ReducerFactory(initialState)`.
  // Type of `action.payload` is inferred based on first argument (action creator)

  .addReducer<ISearchResults>(receiveRecordsAction, (state, action) => {
    var getValue = (prop: any, propName: string, defaultValue = "") => {
      return (prop[propName] || { Value: defaultValue })["Value"];
    };

    let items: IDocument[] = [];
    let result = action.payload || ({} as ISearchResults);

    if (state.loadNextPage) {
      items = state.items.slice(0, state.items.length - 1);
    }

    for (let idx in result.Results) {
      let record = result.Results[idx];

      items.push({
        RecordNumber: getValue(record, "RecordNumber"),
        RecordTitle: getValue(record, "RecordTitle"),
        iconName: `images/webIcons/${getValue(
          record,
          "RecordExtension",
          "blank"
        )}_x16.png`
      });
    }

    return {
      ...state,
      items: items,
      morePages: result.HasMoreItems || false
    };
  })
  .addReducer<boolean>(loadNextPageAction, (state, action) => {
    return {
      ...state,
      loadNextPage: action.payload as boolean
    };
  })
  .addReducer<string>(searchAction, (state, action) => {
    return {
      ...state,
      queryText: action.payload as string
    };
  })

  .toReducer();

export default reducer;

export const fetchRecordsThunk = () => (dispatch: any, state: any) => {
  // Note: no need to pass in username and password to
  // the loginRequest action creator because they're already
  // in scope and not used in our store.
  //  dispatch(searchAction(""));

  let startAt: number = 0;

  dispatch(receiveRecordsAction(null));

  if (state().loadNextPage) {
    startAt = state().items.length + 1;
  }

  fetch(
    "http://localhost/serviceapi/record?properties=RecordTitle,RecordNumber,RecordExtension&q=" +
      state().queryText +
      "&pageSize=30&resultsOnly=true&format=json&start=" +
      startAt,
    {
      method: "GET",
      mode: "cors",
      credentials: "include"
    }
  ).then(response => {
    response.json().then(result => {
      dispatch(receiveRecordsAction(result));
    });
  });
};
