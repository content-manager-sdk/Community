/**
 * @jest-environment jsdom
 */
(global as any).config = { BASE_URL: "", WEB_CLIENT: "cm" };
import { AppStoreOutlook } from "./AppStoreOutlook";

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
		trimType: BaseObjectTypes,
		properties: any,
		fields: any
	): Promise<ITrimMainObject> {
		postedFields = properties;

		return new Promise(function(resolve, reject) {
			if (Mock_Trim_Action === "ERROR") {
				reject({ message: "error" });
			} else {
				resolve({ Uri: 567, URN: "trim:567" });
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

let appStore = new AppStoreOutlook(
	new MockTrimConnector(),
	new MockWordConnector()
);
beforeEach(() => {
	appStore = new AppStoreOutlook(
		new MockTrimConnector(),
		new MockWordConnector()
	);
	Mock_Action = "";
	Mock_Trim_Action = "";
	postedFields = null;
});

describe("Test basic setup from Trim", () => {
	test("Create record from email", (done) => {
		appStore.documentInfo.EmailPath = "test.eml";

		appStore.createRecord(1, {});

		setTimeout(function() {
			try {
				expect(postedFields.RecordFilePath).toBe("test.eml");

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	test("URN sent to autoOpen", (done) => {
		appStore.documentInfo.EmailPath = "test.eml";

		appStore.createRecord(1, {});

		setTimeout(function() {
			try {
				expect(appStore.documentInfo.URN).toBe("trim:567");

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
