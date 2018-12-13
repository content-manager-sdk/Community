import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import {
	IRecordType,
	SERVICEAPI_BASE_URI,
	TrimConnector,
} from "./trim-connector";
import MockAdapter from "axios-mock-adapter";
import TrimMessages from "./trim-messages";

//import * as fetchMock from "fetch-mock";

const axios = require("axios");
//const MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);

describe("Test fetch from TRIM", () => {
	const trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = new Promise<string>((resolve) => {
		resolve("token123");
	});

	it("Record Types are returned", async () => {
		let props: string = "";
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RecordType`, {
				params: { q: "all", properties: "NameString", purpose: 3 },
			})
			.reply(function(config: any) {
				props = config.params.properties;

				return [
					200,
					{
						Results: [{ NameString: "Document" }],
					},
				];
			});

		expect.assertions(2);
		const data = await trimConnector.search<IRecordType>(
			BaseObjectTypes.RecordType,
			"all",
			3
		);
		expect(props).toEqual("NameString");
		expect(data[0].NameString).toBe("Document");
	});

	it("the FullFormattedName is david", () => {
		mock.reset();
		mock.onGet(`${SERVICEAPI_BASE_URI}/Location/me`).replyOnce(200, {
			Results: [{ LocationFullFormattedName: { Value: "david" } }],
		});

		expect.assertions(1);
		return trimConnector.getMe().then((data) => {
			expect(data.FullFormattedName.Value).toBe("david");
		});
	});

	it("does not send a body with a GET", async () => {
		mock.reset();
		let body = {};
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/Location/me`)
			.replyOnce(function(config: any) {
				body = config.data;

				return [
					200,
					{
						Results: [{ LocationFullFormattedName: { Value: "david" } }],
					},
				];
			});

		await trimConnector.getMe();
		expect(body).toBeUndefined();
	});

	it("Application name is Content Manager", async () => {
		let messageMatch: string = "";

		mock
			.onGet(`${SERVICEAPI_BASE_URI}/Localisation`)
			.reply(function(config: any) {
				messageMatch = config.params.MatchMessages;
				return [
					200,
					{
						Messages: { web_HPRM: "Content Manager" },
						ResponseStatus: {},
					},
				];
			});

		expect.assertions(2);
		const data = await trimConnector.getMessages();
		expect(data.web_HPRM).toBe("Content Manager");
		expect(messageMatch).toEqual(Object.keys(new TrimMessages()).join("|"));
	});

	it("Property sheet requested from Record Type", () => {
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RecordType/123`, {
				params: { properties: "dataentryformdefinition" },
			})
			.reply(200, {
				Results: [
					{
						TrimType: "RecordType",
						DataEntryFormDefinition: {
							Version: "1",
							SupportsElectronicDocs: true,
							TitlingMethod: "FreeText",
							Pages: [{}],
						},
					},
				],
			});

		expect.assertions(1);
		return trimConnector.getPropertySheet(123).then((data) => {
			expect(data.Pages.length).toBe(1);
		});
	});

	it("Error is handled", () => {
		//mock.reset();
		mock.onGet(`${SERVICEAPI_BASE_URI}/RecordType/567`).reply(500, {
			Count: 0,
			HasMoreItems: false,
			MinimumCount: 0,
			PropertiesAndFields: {},
			ResponseStatus: {
				ErrorCode: "ApplicationException",
				Errors: [],
				Message: "Unable to find object test",
			},
			Results: [],
			TotalResults: 0,
			TrimType: "Location",
		});

		expect.assertions(1);

		return trimConnector
			.getPropertySheet(567)
			.then(() => {})
			.catch((data) => {
				expect(data.message).toBe("Unable to find object test");
			});
	});

	it("Error is handled on Get me", () => {
		//mock.reset();
		mock.onGet(`${SERVICEAPI_BASE_URI}/Location/me`).reply(500, {
			Count: 0,
			HasMoreItems: false,
			MinimumCount: 0,
			PropertiesAndFields: {},
			ResponseStatus: {
				ErrorCode: "ApplicationException",
				Errors: [],
				Message: "Unable to find object test",
			},
			Results: [],
			TotalResults: 0,
			TrimType: "Location",
		});

		expect.assertions(1);

		return trimConnector
			.getMe()
			.then(() => {})
			.catch((data) => {
				// expect(appStore.status).toBe("ERROR");
				expect(data.message).toBe("Unable to find object test");
			});
	});

	it("has posted a new Record", () => {
		let postConfig: any;
		mock.onPost(`${SERVICEAPI_BASE_URI}/Record`).reply(function(config: any) {
			postConfig = config;

			return [
				200,
				{
					Results: [
						{
							Uri: 123,
						},
					],
				},
			];
		});

		expect.assertions(4);

		return trimConnector
			.registerInTrim(1, { RecordTypedTitle: "test" })
			.then((data) => {
				expect(postConfig.data).toEqual(
					JSON.stringify({ RecordTypedTitle: "test", RecordRecordType: 1 })
				);
				expect(postConfig.headers!["Accept"]).toEqual("application/json");
				expect(postConfig.headers!["Content-Type"]).toEqual("application/json");
				expect(data.Uri).toEqual(123);
			});
	});

	it("sends the token with a request", () => {
		let token = "";
		let webUrl = "";
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RegisterFile`)
			.reply(function(config: any) {
				token = config.headers["Authorization"];
				webUrl = config.params["webUrl"];

				return [200, { Results: [{ Id: "0123", Uri: 567 }] }];
			});

		expect.assertions(4);
		return trimConnector.getDriveId("abc").then((data) => {
			expect(webUrl).toEqual("abc");
			expect(data.Id).toEqual("0123");
			expect(data.Uri).toEqual(567);
			expect(token).toEqual("Bearer token123");
		});
	});

	it("handles an error response without a body", async () => {
		mock.onGet(`${SERVICEAPI_BASE_URI}/RegisterFile`).networkError();

		expect.assertions(1);

		try {
			await trimConnector.getDriveId("");
		} catch (error) {
			expect(error.message).toEqual("Network Error");
		}
	});

	describe("Test object details fetch from TRIM", () => {
		beforeEach(() => {
			mock
				.onGet(`${SERVICEAPI_BASE_URI}/Record/678`, {
					params: {
						propertySets: "Details",
						propertyValue: "String",
						stringDisplayType: "ViewPane",
						includePropertyDefs: true,
					},
				})
				.reply((config) => {
					return [
						200,
						{
							Results: [
								{
									TrimType: "RecordType",
									RecordTitle: { StringValue: "test" },
									Fields: {
										Visibility: {
											StringValue: "High",
										},
									},
								},
							],
							PropertiesAndFields: {
								Record: [
									{
										Id: "RecordTitle",
										Caption: "Title",
									},
									{
										Id: "Visibility",
										Caption: "Visibility Caption",
									},
								],
							},
						},
					];
				});
		});

		it("requests details in a Record details request", async () => {
			expect.assertions(5);
			const data = await trimConnector.getObjectDetails(
				BaseObjectTypes.Record,
				678
			);
			expect(data.results.length).toBe(1);
			expect(data.propertiesAndFields.length).toBe(2);
			expect(data.results[0].RecordTitle.StringValue).toEqual("test");
			expect(data.propertiesAndFields[0].Caption).toEqual("Title");
			expect(data.propertiesAndFields[0].Id).toEqual("RecordTitle");
		});

		it("handles fields in response", async () => {
			expect.assertions(3);
			const data = await trimConnector.getObjectDetails(
				BaseObjectTypes.Record,
				678
			);

			expect(data.results[0].Fields!.Visibility.StringValue).toEqual("High");
			expect(data.propertiesAndFields[1].Id).toEqual("Visibility");
			expect(data.propertiesAndFields[1].Caption).toEqual("Visibility Caption");
		});
	});
});
