/**
 * @jest-environment jsdom
 */
(global as any).config = { BASE_URL: "", WEB_CLIENT: "cm" };
import { AppStore } from "./AppStore";

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
import { IWordUrl } from "../office-coms/word-connector";
import { CommandIds } from "../trim-coms/trim-command-ids";

let Mock_Action = "";

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
}

let postedFields: any;
let Mock_Trim_Action = "";
class MockTrimConnector implements ITrimConnector {
	clearCache: () => void;
	cancel: () => void;
	getSearchClauseOrFieldDefinitions(trimType: BaseObjectTypes): Promise<ISearchClauseOrFieldDef[]> {
		return new Promise(function(resolve, reject) {});
	}
	getObjectDefinitions(): Promise<import("../trim-coms/trim-connector").IObjectDef[]> {
		throw new Error("Method not implemented.");
	}
	getObjectCaption(trimType: BaseObjectTypes): Promise<string> {
		throw new Error("Method not implemented.");
	}
	createRelationship(uri: number, relatedRecord: number, relationshipType: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	setLatestClause(trimType: BaseObjectTypes, queryName: string): void {
		throw new Error("Method not implemented.");
	}
	getLatestClause(trimType: BaseObjectTypes): string {
		throw new Error("Method not implemented.");
	}
	setViewPaneProperties(trimObject: ITrimMainObject, propertyIds: string[]): Promise<import("../trim-coms/trim-connector").IPropertyOrFieldDef[]> {
		throw new Error("Method not implemented.");
	}
	getViewPanePropertyDefs(trimType: BaseObjectTypes, uri: number): Promise<import("../trim-coms/trim-connector").IPropertyOrFieldDef[]> {
		throw new Error("Method not implemented.");
	}
	getGlobalUserOptions(forUserOptionSet: string): Promise<void> {
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
		return new Promise(function(resolve, reject) {});
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
				resolve({ Uri: 0, Id: "abc", CommandDefs: [] });
			} else if (Mock_Action == "ERROR") {
				reject({ message: "some message" });
			} else {
				resolve({ Uri: 567, Id: "abc", CommandDefs: [] });
			}
		});
	}

	setAccessToken(accessToken: string) {
		//	throw new Error("Method not implemented.");
	}
	registerInTrim(
		recordTypeUri: number,
		properties: any,
		fields: any
	): Promise<ITrimMainObject> {
		postedFields = fields;

		return new Promise(function(resolve, reject) {
			if (Mock_Trim_Action === "ERROR") {
				reject({ message: "error" });
			} else {
				resolve({ Uri: 567 });
			}
		});
	}
	getPropertySheet(recordTypeUri: number): Promise<any> {
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

let appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
beforeEach(() => {
	appStore = new AppStore(new MockWordConnector(), new MockTrimConnector());
	Mock_Action = "";
	Mock_Trim_Action = "";
	postedFields = null;
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

		expect(appStore.RecordUri).toBe(0);
		appStore.fetchBaseSettingFromTrim(false);
		setTimeout(() => {
			try {
				expect(appStore.RecordUri).toBe(567);
				expect(appStore.status).toBe("WAITING");
				expect.assertions(3);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	test("word connector URI not found", (done) => {
		Mock_Action = "NOT_FOUND";

		expect(appStore.RecordUri).toBe(0);
		appStore.fetchBaseSettingFromTrim(false);

		setTimeout(() => {
			try {
			expect(appStore.RecordUri).toBe(0);
			expect(appStore.status).toBe("WAITING");
			expect.assertions(3);
			done();
			}
			catch(e) {
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

	it("updates the store after a document has been registered in TRIM", async () => {
		// appStore.dcTest("ffff");
		await appStore.createRecord(2, {});
		expect(appStore.documentInfo.Uri).toBe(567);
	});

	it("sets the Drive Id in the DriveID field when stored in TRIM", (done) => {
		expect.assertions(1);

		appStore.setDocumentInfo({ Id: "abc", Uri: 0, CommandDefs: [] });
		appStore.createRecord(2, {}).then(() =>{
			expect(postedFields["DriveID"]).toBe("abc");
			done();
		});

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
});
