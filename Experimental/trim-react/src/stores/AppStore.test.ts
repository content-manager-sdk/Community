/**
 * @jest-environment jsdom
 */

import * as fetchMock from "fetch-mock";
import { appStore, SERVICEAPI_BASE_URI } from "./AppStore";

// test("fetch user", () => {
//   fetchMock.get("*", {
//     Results: [{ TrimType: "Location", Uri: 1 }],
//     PropertiesAndFields: {},
//     TotalResults: 1,
//     MinimumCount: 0,
//     Count: 0,
//     HasMoreItems: false,
//     TrimType: "Location",
//     ResponseStatus: {}
//   });

//   appStore.updateUserInfoGenerator().then(function() {
//     expect(appStore.userProfile.DisplayName).toEqual("david2");
//   });
// });

// describe("appStore", () => {
//   it("is a test", () => {
//     appStore.createThing("a");

//     expect(appStore.someThings.length).toBe(1);
//   });
// });

test("the display name is david", () => {
  fetchMock.get("begin:" + SERVICEAPI_BASE_URI + "/Location/me", {
    Results: [
      {
        LocationFullFormattedName: { Value: "david" },
        TrimType: "Location",
        Uri: 1
      }
    ],
    PropertiesAndFields: {},
    TotalResults: 1,
    MinimumCount: 0,
    Count: 0,
    HasMoreItems: false,
    TrimType: "Location",
    ResponseStatus: {}
  });
  expect.assertions(3);
  expect(appStore.status).toBe("WAITING");
  return appStore.updateUserInfoGenerator().then(function() {
    expect(appStore.userProfile.DisplayName).toBe("david");
    expect(appStore.status).toBe("WAITING");
  });
});

test("Error is handled", () => {
  fetchMock.reset();
  fetchMock.get("*", {
    body: {
      Results: [],
      PropertiesAndFields: {},
      TotalResults: 0,
      MinimumCount: 0,
      Count: 0,
      HasMoreItems: false,
      TrimType: "Location",
      ResponseStatus: {
        ErrorCode: "ApplicationException",
        Message: "Unable to find object test",
        Errors: []
      }
    },
    status: 500
  });
  expect.assertions(3);
  expect(appStore.status).toBe("WAITING");
  return appStore.updateUserInfoGenerator().then(function() {
    expect(appStore.status).toBe("ERROR");
    expect(appStore.errorMessage).toBe("Unable to find object test");
  });
});
