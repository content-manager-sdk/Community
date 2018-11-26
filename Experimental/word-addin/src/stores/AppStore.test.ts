/**
 * @jest-environment jsdom
 */

import * as fetchMock from "fetch-mock";
import { AppStore, SERVICEAPI_BASE_URI } from "./AppStore";
import {
  IWordConnector,
  IGetRecordUriResponse
} from "../office-coms/word-connector";

let Mock_Action = "";
class MockWordConnector implements IWordConnector {
  getUri(): Promise<IGetRecordUriResponse> {
    return new Promise(function(resolve, reject) {
      if (Mock_Action == "NOT_FOUND") {
        resolve({ found: false, uri: 0 });
      } else if (Mock_Action == "ERROR") {
        resolve({ found: false, uri: 0, message: "" });
      } else {
        resolve({ found: true, uri: 1 });
      }
    });
  }
}

let appStore = new AppStore(new MockWordConnector());
beforeEach(() => {
  appStore = new AppStore(new MockWordConnector());
  Mock_Action = "";
});

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

  it("the display name is david", () => {
    expect.assertions(3);
    expect(appStore.status).toBe("WAITING");
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.UserProfile.DisplayName).toBe("david");
      expect(appStore.status).toBe("WAITING");
    });
  });

  it("Content Manager name is returned", () => {
    expect.assertions(1);

    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.ApplicationDisplayName).toBe("Content Manager");
    });
  });

  test("Error in Word Connector is handled", () => {
    Mock_Action = "ERROR";

    expect.assertions(1);

    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.status).toBe("WAITING");
    });
  });

  test("word conector URI found", () => {
    Mock_Action = "";

    expect.assertions(3);
    expect(appStore.RecordUri).toBe(-1);
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.RecordUri).toBe(1);

      expect(appStore.status).toBe("WAITING");
    });
  });

  test("word conector URI not found", () => {
    Mock_Action = "NOT_FOUND";

    expect.assertions(3);
    expect(appStore.RecordUri).toBe(-1);
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.RecordUri).toBe(0);

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
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.status).toBe("ERROR");
      expect(appStore.errorMessage).toBe("Unable to find object test");
    });
  });
});
