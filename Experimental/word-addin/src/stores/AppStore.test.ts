/**
 * @jest-environment jsdom
 */

import { AppStore } from "./AppStore";

import {
	IDriveInformation,
	ITrimConnector,
	ILocation,
} from "../trim-coms/trim-connector";

import { ITrimMainObject } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { IWordUrl } from "src/office-coms/word-connector";

let Mock_Action = "";

class MockWordConnector implements IWordUrl {
	getWebUrl(): string {
		return "My.Url";
	}
}

let postedProperties: any;
let Mock_Trim_Action = "";
class MockTrimConnector implements ITrimConnector {
	credentialsResolver: Promise<string>;
	getDriveId(webUrl: string): Promise<IDriveInformation> {
		return new Promise(function(resolve, reject) {
			if (Mock_Action == "NOT_FOUND") {
				resolve({ Uri: 0, Id: "abc" });
			} else if (Mock_Action == "ERROR") {
				reject({ message: "some message" });
			} else {
				resolve({ Uri: 567, Id: "abc" });
			}
		});
	}

	setAccessToken(accessToken: string) {
		//	throw new Error("Method not implemented.");
	}
	registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject> {
		postedProperties = properties;

		return new Promise(function(resolve, reject) {
			resolve({ Uri: 567 });
		});
	}
	getPropertySheet(recordTypeUri: number): Promise<any> {
		throw new Error("Method not implemented.");
	}
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
		return new Promise(function(resolve, reject) {});
	}
}

let appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
beforeEach(() => {
	appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
	Mock_Action = "";
	Mock_Trim_Action = "";
});

describe("Test basic setup from Trim", () => {
	it("the display name is david", () => {
		expect.assertions(3);
		expect(appStore.status).toBe("STARTING");
		return appStore.fetchBaseSettingFromTrim().then(() => {
			expect(appStore.UserProfile.DisplayName).toBe("david");
			expect(appStore.status).toBe("WAITING");
		});
	});

	it("Content Manager name is returned", async () => {
		expect.assertions(1);

		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.ApplicationDisplayName).toBe("Content Manager");
	});

	it("Message from getMessage", async () => {
		expect.assertions(1);
		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.messages["web_HPRM"]).toBe("Content Manager");
	});

	test("Error in Word Connector is handled", async () => {
		Mock_Action = "ERROR";

		expect.assertions(1);

		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.status).toBe("ERROR");
	});

	test("word conector URI found", async () => {
		Mock_Action = "";

		expect.assertions(3);
		expect(appStore.RecordUri).toBe(0);
		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.RecordUri).toBe(567);

		expect(appStore.status).toBe("WAITING");
	});

	test("word conector URI not found", async () => {
		Mock_Action = "NOT_FOUND";

		expect.assertions(3);
		expect(appStore.RecordUri).toBe(0);
		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.RecordUri).toBe(0);
		expect(appStore.status).toBe("WAITING");
	});

	test("Error handled", async () => {
		Mock_Trim_Action = "ERROR";

		expect.assertions(3);
		expect(appStore.status).toBe("STARTING");
		await appStore.fetchBaseSettingFromTrim();
		expect(appStore.errorMessage).toBe("error");

		expect(appStore.status).toBe("ERROR");
	});

	it("updates the store after a document has been registered in TRIM", async () => {
		// appStore.dcTest("ffff");
		await appStore.createRecord(2, {});
		expect(appStore.documentInfo.Uri).toBe(567);
	});

	it("sets the Drive Id in the TRIM External ID when stored in TRIM", async () => {
		postedProperties = null;

		expect.assertions(1);
		await appStore.fetchBaseSettingFromTrim();
		await appStore.createRecord(2, {});
		expect(postedProperties["RecordExternalReference"]).toBe("abc");
	});
});
