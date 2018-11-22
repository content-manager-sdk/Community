/**
 * @jest-environment jsdom
 */

import * as fetchMock from "fetch-mock";
import { appStore, SERVICEAPI_BASE_URI } from "./AppStore";

describe("Test basic setup from Trim", () => {
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

  fetchMock.get("begin:" + SERVICEAPI_BASE_URI + "/Localisation", {
    Messages: {
      web_HPRM: "Content Manager"
    },
    ResponseStatus: {}
  });

  test("the display name is david", () => {
    expect.assertions(3);
    expect(appStore.status).toBe("WAITING");
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.UserProfile.DisplayName).toBe("david");
      expect(appStore.status).toBe("WAITING");
    });
  });

  test("Content Manager name is returned", () => {
    expect.assertions(1);

    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.ApplicationDisplayName).toBe("Content Manager");
    });
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
  return appStore.fetchBaseSettingFromTrim().then(() => {
    expect(appStore.status).toBe("ERROR");
    expect(appStore.errorMessage).toBe("Unable to find object test");
  });
});
