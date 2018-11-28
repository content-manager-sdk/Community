/**
 * @jest-environment jsdom
 */

import { AppStore } from "./AppStore";
import {
  IWordConnector,
  IGetRecordUriResponse
} from "../office-coms/word-connector";

import { ITrimConnector, ILocation } from "../trim-coms/trim-connector";

import { ITrimMainObject } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";

let Mock_Action = "";
class MockWordConnector implements IWordConnector {
  registerInTrim(): Promise<IGetRecordUriResponse> {
    throw new Error("Method not implemented.");
  }
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

let Mock_Trim_Action = "";
class MockTrimConnector implements ITrimConnector {
  getMessages(): Promise<any> {
    return new Promise(function(resolve, reject) {
      resolve({ web_HPRM: "Content Manager" });
    });
  }
  getMe(): Promise<ILocation> {
    return new Promise(function(resolve, reject) {
      if (Mock_Trim_Action === "ERROR") {
        reject({ message: "error" });
      } else {
        resolve({ FullFormattedName: { Value: "david" }, Uri: 1 });
      }
    });
  }
  search<T extends ITrimMainObject>(
    trimType: BaseObjectTypes,
    query: string,
    purpose: number = 0
  ): Promise<T[]> {
    return new Promise(function(resolve, reject) {
      //   fetch(url, options)
      //     .then(response => response.json())
      //     .then(data => {
      //       if (data.Results && data.Results.length > 0) {
      //         const trimObjects = data.Results.map(function(trimObject: T) {
      //           return trimObject;
      //         });
      //         resolve(trimObjects);
      //       } else {
      //         reject({ message: data.ResponseStatus.Message });
      //       }
      //     });
    });
  }
}

let appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
beforeEach(() => {
  appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
  Mock_Action = "";
  Mock_Trim_Action = "";
});

describe("Test basic setup from Trim", () => {
  //   fetchMock.get("begin:" + SERVICEAPI_BASE_URI + "/Location/me", {
  //     Results: [
  //       {
  //         LocationFullFormattedName: { Value: "david" },
  //         TrimType: "Location",
  //         Uri: 1
  //       }
  //     ],
  //     PropertiesAndFields: {},
  //     TotalResults: 1,
  //     MinimumCount: 0,
  //     Count: 0,
  //     HasMoreItems: false,
  //     TrimType: "Location",
  //     ResponseStatus: {}
  //   });

  //   fetchMock.get("begin:" + SERVICEAPI_BASE_URI + "/Localisation", {
  //     Messages: {
  //       web_HPRM: "Content Manager"
  //     },
  //     ResponseStatus: {}
  //   });

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

  it("Message from getMessage", () => {
    expect.assertions(1);
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.messages["web_HPRM"]).toBe("Content Manager");
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

  test("Error handled", () => {
    Mock_Trim_Action = "ERROR";

    expect.assertions(3);
    expect(appStore.status).toBe("WAITING");
    return appStore.fetchBaseSettingFromTrim().then(() => {
      expect(appStore.errorMessage).toBe("error");

      expect(appStore.status).toBe("ERROR");
    });
  });
});
