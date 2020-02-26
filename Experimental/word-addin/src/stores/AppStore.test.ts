/**
 * @jest-environment jsdom
 */
(global as any).config = { BASE_URL: "", WEB_CLIENT: "cm" };
import { AppStoreWord } from "./AppStoreWord";

import {
	IDriveInformation,
	ISearchClauseDef,
	ITrimConnector,
	ITrimMainObject,
	ILocation,
	IObjectDetails,
	ITokenCallback,
	ISearchResults,
	ISearchOptions,
	ISearchParameters,
	ISearchClauseOrFieldDef,
} from "../trim-coms/trim-connector";

import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { IWordUrl } from "../office-coms/office-connector";
import { CommandIds } from "../trim-coms/trim-command-ids";

let Mock_Action = "";
let testSearchResults;

class MockWordConnector implements IWordUrl {
	getDocumentData(writeSlice: any): Promise<string> {
		return new Promise(function(resolve, reject) {
			resolve("test");
		});
	}
	getWebUrl(): Promise<string> {
		return new Promise(function(resolve, reject) {
			resolve("My.Url");
		});
	}
	getRecordUri(): number {
		return 0;
	}
}

let postedFields: any;
let Mock_Trim_Action = "";
let foundOptions;

class MockTrimConnector implements ITrimConnector {
	clearCache: () => void;
	cancel: () => void;
	getSearchClauseOrFieldDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseOrFieldDef[]> {
		return new Promise(function(resolve, reject) {});
	}
	getObjectDefinitions(): Promise<
		import("../trim-coms/trim-connector").IObjectDef[]
	> {
		throw new Error("Method not implemented.");
	}
	getObjectCaption(trimType: BaseObjectTypes): Promise<string> {
		throw new Error("Method not implemented.");
	}
	createRelationship(
		uri: number,
		relatedRecord: number,
		relationshipType: string
	): Promise<void> {
		throw new Error("Method not implemented.");
	}
	setLatestClause(trimType: BaseObjectTypes, queryName: string): void {
		throw new Error("Method not implemented.");
	}
	getLatestClause(trimType: BaseObjectTypes): string {
		throw new Error("Method not implemented.");
	}
	setViewPaneProperties(
		trimObject: ITrimMainObject,
		propertyIds: string[]
	): Promise<import("../trim-coms/trim-connector").IPropertyOrFieldDef[]> {
		throw new Error("Method not implemented.");
	}
	getViewPanePropertyDefs(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<import("../trim-coms/trim-connector").IPropertyOrFieldDef[]> {
		throw new Error("Method not implemented.");
	}
	setGlobalUserOptions(forUserOptionSet: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getRecordAsText(recordUri: number): Promise<string> {
		throw new Error("Method not implemented.");
	}
	getDriveUrl(recordUri: number): Promise<string> {
		throw new Error("Method not implemented.");
	}
	writeFileSlice(data: number[], fileName: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	getDatabaseProperties(): Promise<
		import("../trim-coms/trim-connector").IDatabase
	> {
		throw new Error("Method not implemented.");
	}
	makeFriendlySearchQuery(trimType: BaseObjectTypes, query: string): string {
		throw new Error("Method not implemented.");
	}
	getSearchOptions(): Promise<ISearchOptions> {
		return new Promise(function(resolve, reject) {});
	}
	getSearchClauseDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]> {
		return new Promise(function(resolve, reject) {});
	}
	search<T>(
		options: ISearchParameters
	): Promise<ISearchResults<ITrimMainObject>> {
		foundOptions = options;
		return new Promise(function(resolve, reject) {
			resolve(testSearchResults);
		});
	}
	credentialsResolver: (callback: ITokenCallback) => void;
	runAction(commandId: CommandIds, Uri: number): Promise<IDriveInformation> {
		throw new Error("Method not implemented.");
	}

	getObjectDetails(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<IObjectDetails> {
		throw new Error("Method not implemented.");
	}

	getDriveId(webUrl: string): Promise<IDriveInformation> {
		return new Promise(function(resolve, reject) {
			if (Mock_Action == "NOT_FOUND") {
				resolve({ Uris: [], Id: "abc", CommandDefs: [] });
			} else if (Mock_Action == "ERROR") {
				reject({ message: "some message", Uri: [] });
			} else {
				resolve({ Uris: [567], Id: "abc", CommandDefs: [] });
			}
		});
	}

	setAccessToken(accessToken: string) {
		//	throw new Error("Method not implemented.");
	}
	saveToTrim(
		trimType: BaseObjectTypes,
		properties: any,
		fields: any
	): Promise<ITrimMainObject> {
		postedFields = fields;

		return new Promise(function(resolve, reject) {
			if (Mock_Trim_Action === "ERROR") {
				reject({ message: "error" });
			} else {
				resolve({ Uri: 567, URN: "urn_567" });
			}
		});
	}
	getPropertySheet(
		trimType: BaseObjectTypes,
		recordTypeUri: number
	): Promise<any> {
		throw new Error("Method not implemented.");
	}
	getMessages(): Promise<any> {
		return new Promise(function(resolve, reject) {
			resolve({
				web_HPRM: "Content Manager",
				bob_needSelectedRow:
					"Please select the {0} you wish to perform the task on.",
				web_Test_two: "message {0} and {1}",
			});
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
}

let appStore = new AppStoreWord(
	new MockTrimConnector(),
	new MockWordConnector()
);
beforeEach(() => {
	appStore = new AppStoreWord(new MockTrimConnector(), new MockWordConnector());
	Mock_Action = "";
	Mock_Trim_Action = "";
	postedFields = null;
	testSearchResults = undefined;
	foundOptions = undefined;
});

describe("Test basic setup from Trim", () => {
	it("the display name is david", (done) => {
		expect(appStore.status).toBe("STARTING");
		appStore.fetchBaseSettingFromTrim(false);
		setImmediate(() => {
			try {
				expect(appStore.UserProfile.DisplayName).toBe("david");
				expect(appStore.status).toBe("WAITING");
				expect.assertions(3);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("Content Manager name is returned", (done) => {
		expect.assertions(1);

		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			expect(appStore.ApplicationDisplayName).toBe("Content Manager");
			done();
		});
	});

	it("Message from getMessage", (done) => {
		expect.assertions(1);
		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			expect(appStore.messages["web_HPRM"]).toBe("Content Manager");
			done();
		});
	});

	test("Error in Word Connector is handled", (done) => {
		Mock_Action = "ERROR";

		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			try {
				expect(appStore.status).toBe("ERROR");
				expect.assertions(1);
				done();
			} catch (e) {
				done.fail();
			}
		});
	});

	test("word connector URI found", (done) => {
		Mock_Action = "";

		appStore.fetchBaseSettingFromTrim(false);
		setTimeout(() => {
			try {
				expect(appStore.RecordUri).toBe(567);
				expect(appStore.status).toBe("WAITING");
				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	test("word connector URI not found", (done) => {
		Mock_Action = "NOT_FOUND";

		expect(appStore.RecordUri).toEqual(0);
		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			try {
				expect(appStore.status).toBe("WAITING");
				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	test("Error handled", (done) => {
		Mock_Trim_Action = "ERROR";

		expect(appStore.status).toBe("STARTING");
		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			try {
				expect(appStore.errorMessage).toBe("error (fetch base settings)");

				expect(appStore.status).toBe("ERROR");
				expect.assertions(3);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	test("Error handled on createRecord", (done) => {
		Mock_Trim_Action = "ERROR";

		expect(appStore.status).toBe("STARTING");

		appStore.createRecord(1, {});

		setTimeout(function() {
			try {
				expect(appStore.errorMessage).toBe("error (create record)");

				expect(appStore.status).toBe("ERROR");
				expect.assertions(3);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("isEmail is false", () => {
		expect(appStore.isEmail()).toBeFalsy();
	});

	it("updates the store after a document has been registered in TRIM", async () => {
		// appStore.dcTest("ffff");
		await appStore.createRecord(2, {});
		expect(appStore.documentInfo.URN).toEqual("urn_567");
	});

	it("clears Uris ready to file more", () => {
		expect.assertions(2);

		appStore.setDocumentInfo({ Id: "abc", Uris: [1, 2, 3], CommandDefs: [] });
		appStore.clearUris();
		expect(appStore.documentInfo).toEqual({
			Id: "abc",
			Uris: [],
			CommandDefs: [],
		});

		expect(appStore.PreservedUris).toEqual([1, 2, 3]);
	});

	it("sets the Drive Id in the DriveID field when stored in TRIM", (done) => {
		expect.assertions(1);

		appStore.setDocumentInfo({ Id: "abc", Uris: [], CommandDefs: [] });
		appStore.createRecord(2, {}).then(() => {
			expect(postedFields["DriveID"]).toBe("abc");
			done();
		});
	});

	it("sends fields to TRIM", (done) => {
		expect.assertions(1);

		appStore.createRecord(2, {}, { Speed: 20 }).then(() => {
			try {
				expect(postedFields["Speed"]).toBe(20);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("returns record from create", (done) => {
		expect.assertions(1);

		appStore
			.createRecord(2, {}, { Speed: 20 })
			.then((trimMainObject) => {
				try {
					expect(trimMainObject.Uri).toBe(567);
					done();
				} catch (e) {
					done.fail(e);
				}
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("returns a list of Records for the current Uris", async () => {
		testSearchResults = { results: [{ Uri: 1 }] };
		appStore.setDocumentInfo({ Uris: [1, 3] });

		const records = await appStore.fetchFiledRecords();

		expect(foundOptions.q).toEqual("unkUri:1,3");
		expect(foundOptions.properties).toEqual(
			"ToolTip,RecordMessageId,RecordESource"
		);
		expect(records).toEqual([{ Uri: 1 }]);
	});

	it("returns a list of Records for the preserved Uris", async () => {
		testSearchResults = { results: [{ Uri: 1 }] };
		appStore.PreservedUris = [1, 3];

		const records = await appStore.fetchFiledRecords();

		expect(foundOptions.q).toEqual("unkUri:1,3");
		expect(foundOptions.properties).toEqual(
			"ToolTip,RecordMessageId,RecordESource"
		);
		expect(records).toEqual([{ Uri: 1 }]);
	});
});

describe("Test operation", () => {
	it("get a record URL", function() {
		appStore.errorMessage = "test";
		appStore.status = "ERROR";

		const url = appStore.getWebClientUrl(5);

		expect(url).toEqual("/cm?uri=5");
	});

	it("get a container URL", function() {
		appStore.errorMessage = "test";
		appStore.status = "ERROR";

		const url = appStore.getWebClientUrl(5, true);

		expect(url).toEqual("/cm?q=recContainerEx:[unkUri:5]&t=Record");
	});

	it("clears the error when reset called", function() {
		appStore.errorMessage = "test";
		appStore.status = "ERROR";

		appStore.resetError();

		expect(appStore.errorMessage).toBeFalsy();
		expect(appStore.status).toEqual("WAITING");
	});

	it("sets the error", function() {
		appStore.errorMessage = "";
		appStore.status = "WAITING";

		appStore.setError("an error");

		expect(appStore.errorMessage).toEqual("an error");
		expect(appStore.status).toEqual("ERROR");
	});

	[
		{
			msg: "bob_needSelectedRow",
			replacements: ["record"],
			expected: "Please select the record you wish to perform the task on.",
		},
		{ msg: "web_HPRM", expected: "Content Manager" },
		{
			msg: "web_Test_two",
			replacements: ["one", "two"],
			expected: "message one and two",
		},
	].forEach((testData) => {
		it("sets the error message", (done) => {
			appStore.errorMessage = "";
			appStore.status = "WAITING";

			appStore.fetchBaseSettingFromTrim(false);

			setImmediate(() => {
				try {
					appStore.setErrorMessage(testData.msg, ...testData.replacements);

					expect(appStore.errorMessage).toEqual(testData.expected);
					expect(appStore.status).toEqual("ERROR");
					done();
				} catch (e) {
					done.fail(e);
				}
			});
		});
	});
});
