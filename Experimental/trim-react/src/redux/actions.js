/*
 * action types
 */
import fetch from "cross-fetch";

export const SEARCH = "SEARCH";
export const REQUEST_SEARCH = "REQUEST_SEARCH";
export const RECEIVE_RECORDS = "RECEIVE_RECORDS";

export function objectSearch(query) {
  const action = {
    type: SEARCH,
    query
  };
}

export function fetchRecords(query) {
  return function(dispatch) {
    dispatch(objectSearch(query));

    return fetch(
      "http://localhost/serviceapi/record?properties=RecordTitle,RecordNumber,RecordExtension&q=" +
        query +
        "&pageSize=30&resultsOnly=true&format=json"
    )
      .then(
        response => response.json(),
        error => console.log("an error occurred", error)
      )
      .then(json => dispatch(receiveSearch(query, json)));
  };

  return {
    type: REQUEST_SEARCH,
    query
  };
}

function receiveSearch(query, json) {
  return {
    type: RECEIVE_POSTS,
    query,
    records: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}
