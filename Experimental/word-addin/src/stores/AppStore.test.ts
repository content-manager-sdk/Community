/**
 * @jest-environment jsdom
 */

import { AppStore } from "./AppStore";
import {
	IWordConnector,
	IGetRecordUriResponse,
} from "../office-coms/word-connector";

import { ITrimConnector, ILocation } from "../trim-coms/trim-connector";

import { ITrimMainObject } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";

let Mock_Action = "";
let testSetUri: number = 0;
class MockWordConnector implements IWordConnector {
	getWebUrl(): string {
		throw new Error("Method not implemented.");
	}
	getAccessToken(): Promise<string> {
		throw new Error("Method not implemented.");
	}
	setUri(uri: number): Promise<IGetRecordUriResponse> {
		testSetUri = uri;
		return new Promise(function(resolve, reject) {
			resolve();
		});
	}
	getName(): string {
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
	credentialsResolver: Promise<string>;
	getDriveId(token: string, webUrl: string): Promise<string> {
		throw new Error("Method not implemented.");
	}

	setAccessToken(accessToken: string) {
		throw new Error("Method not implemented.");
	}
	registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject> {
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
		expect(appStore.documentInfo.uri).toBe(567);
	});

	it("writes the Record Uri to a  custom property in the document when the record is created in CM", async () => {
		// appStore.dcTest("ffff");
		await appStore.createRecord(2, {});
		expect(testSetUri).toBe(567);
	});
});
