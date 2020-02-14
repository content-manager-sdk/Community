/**
 * @jest-environment jsdom
 */
(global as any).config = { BASE_URL: "", WEB_CLIENT: "cm" };
import { AppStoreOutlook } from "./AppStoreOutlook";

import TrimConnector, {
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
	IDatabase,
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
	getRecordUri = () => {
		return "";
	};
}

let postedFields: any;
let Mock_Trim_Action = "";
const trimConnector = new TrimConnector();
trimConnector.getDatabaseProperties = function(): Promise<IDatabase> {
	return new Promise(function(resolve) {
		resolve({ Id: "N1", CurrencySymbol: "$", EmailSubjectPrefix: "CM:" });
	});
};

trimConnector.getSearchClauseOrFieldDefinitions = function(
	trimType: BaseObjectTypes
): Promise<ISearchClauseOrFieldDef[]> {
	return new Promise(function(resolve, reject) {});
}.bind(trimConnector);

trimConnector.getSearchClauseDefinitions = function(
	trimType: BaseObjectTypes
): Promise<ISearchClauseDef[]> {
	return new Promise(function(resolve, reject) {});
}.bind(trimConnector);

trimConnector.search = function<T>(
	options: ISearchParameters
): Promise<ISearchResults<ITrimMainObject>> {
	return new Promise(function(resolve, reject) {});
}.bind(trimConnector);

trimConnector.getDriveId = function(
	webUrl: string
): Promise<IDriveInformation> {
	return new Promise(function(resolve, reject) {
		if (Mock_Action == "NOT_FOUND") {
			resolve({ Uri: 0, Id: "abc", CommandDefs: [] });
		} else if (Mock_Action == "ERROR") {
			reject({ message: "some message" });
		} else {
			resolve({ Uri: 567, Id: "abc", CommandDefs: [] });
		}
	});
}.bind(trimConnector);

trimConnector.saveToTrim = function(
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
}.bind(trimConnector);

trimConnector.getMessages = function(): Promise<any> {
	return new Promise(function(resolve, reject) {
		resolve({
			web_HPRM: "Content Manager",
			bob_needSelectedRow:
				"Please select the {0} you wish to perform the task on.",
			web_Test_two: "message {0} and {1}",
		});
	});
}.bind(trimConnector);

trimConnector.getMe = function(): Promise<ILocation> {
	return new Promise(function(resolve, reject) {
		if (Mock_Trim_Action === "ERROR") {
			reject({ message: "error" });
		} else {
			resolve({ FullFormattedName: { Value: "david" }, Uri: 1 });
		}
	});
}.bind(trimConnector);

let appStore = new AppStoreOutlook(trimConnector, new MockWordConnector());
beforeEach(() => {
	appStore = new AppStoreOutlook(trimConnector, new MockWordConnector());
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

	it("does not get DriveInfo for attachments", (done) => {
		appStore.setDocumentInfo(null);
		appStore.deferFetchDriveInfo();
		appStore.fetchBaseSettingFromTrim(false);
		setTimeout(() => {
			try {
				expect(appStore.documentInfo).toBeFalsy();
				expect(appStore.status).toEqual("WAITING");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
