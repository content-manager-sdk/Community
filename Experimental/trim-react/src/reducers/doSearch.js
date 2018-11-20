import { combineReducers } from "redux";
import { SEARCH, REQUEST_SEARCH, RECEIVE_RECORDS } from "../redux/actions";

function doSearch(state = "none", action) {
  switch (action.type) {
    case SEARCH:
      return action.query;
    default:
      return state;
  }
}


functions recordsByQuery(state = {}, action) {
    switch (action.type) {
        case RECEIVE_RECORDS:
        case REQUEST_SEARCH:
            return Object.assign({}, state, {[action.query]:records(state[action.query], action)});
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    doSearch, recordsByQuery
});

export default rootReducer;