import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import {
	IRecordType,
	SERVICEAPI_BASE_URI,
	TrimConnector,
} from "./trim-connector";
import MockAdapter from "axios-mock-adapter";

//import * as fetchMock from "fetch-mock";

const axios = require("axios");
//const MockAdapter = require("axios-mock-adapter");

const mock = new MockAdapter(axios);

describe("Test fetch from TRIM", () => {
	const trimConnector = new TrimConnector();
	trimConnector.CredentialsResolver = new Promise<string>((resolve) => {
		resolve("token123");
	});

	/*
	const recordTypeSearchMatch = (url: string, opts: any) => {
		return (
			url.startsWith(SERVICEAPI_BASE_URI + "/RecordType") &&
			url.indexOf("q=all") > -1 &&
			url.indexOf("properties=NameString") > -1 &&
			url.indexOf("purpose=3") > -1
		);
	};

	fetchMock.get(recordTypeSearchMatch, {
		Count: 0,
		MinimumCount: 0,
		HasMoreItems: false,
		PropertiesAndFields: {},
		ResponseStatus: {},
		Results: [
			{
				NameString: "Document",
				TrimType: "RecordType",
				Uri: 1,
			},
		],
		TotalResults: 1,
		TrimType: "RecordType",
	});

	fetchMock.get(
		"begin:" + SERVICEAPI_BASE_URI + "/Location/me",
		{
			Results: [
				{
					LocationFullFormattedName: { Value: "david" },
					TrimType: "Location",
					Uri: 1,
				},
			],
			PropertiesAndFields: {},
			TotalResults: 1,
			MinimumCount: 0,
			Count: 0,
			HasMoreItems: false,
			TrimType: "Location",
			ResponseStatus: {},
		},
		{ name: "GetMe" }
	);

	fetchMock.get(
		"begin:" + SERVICEAPI_BASE_URI + "/Localisation?MatchMessages=w",
		{
			Messages: { web_HPRM: "Content Manager" },
			ResponseStatus: {},
		}
	);

	fetchMock.get(
		"begin:" +
			SERVICEAPI_BASE_URI +
			"/RecordType/123?properties=dataentryformdefinition",
		{
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
		}
	);
*/

	it("Record Types are returned", () => {
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RecordType`, {
				params: { q: "all", properties: ["NameString"], purpose: 3 },
			})
			.reply(200, {
				Results: [{ NameString: "Document" }],
			});

		expect.assertions(1);
		return trimConnector
			.search<IRecordType>(BaseObjectTypes.RecordType, "all", 3)
			.then((data) => {
				expect(data[0].NameString).toBe("Document");
			});
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

	it("Application name is Content Manager", () => {
		mock.onGet(`${SERVICEAPI_BASE_URI}/Localisation`).reply(200, {
			Messages: { web_HPRM: "Content Manager" },
			ResponseStatus: {},
		});

		expect.assertions(1);
		return trimConnector.getMessages().then((data) => {
			expect(data.web_HPRM).toBe("Content Manager");
		});
	});

	it("Property sheet requested from Record Type", () => {
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RecordType/123`, {
				params: { properties: ["dataentryformdefinition"] },
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

	/*

	it("has posted a new Record", () => {
		fetchMock.post(
			"begin:" + SERVICEAPI_BASE_URI + "/Record",
			{
				Results: [
					{
						Uri: 123,
					},
				],
			},
			{ name: "NewRecord" }
		);

		return trimConnector
			.registerInTrim(1, { RecordTypedTitle: "test" })
			.then((data) => {
				let calls = fetchMock.calls("NewRecord");

				expect(calls.length).toBe(1);
				expect(calls[0][1].body).toEqual(
					JSON.stringify({ RecordTypedTitle: "test", RecordRecordType: 1 })
				);
				expect(calls[0][1].headers!["Accept"]).toEqual("application/json");
				expect(calls[0][1].headers!["Content-Type"]).toEqual(
					"application/json"
				);
				expect(data.Uri).toEqual(123);
			});
	});
*/
	it("sends the token with a request", () => {
		let token = "";
		mock
			.onGet(`${SERVICEAPI_BASE_URI}/RegisterFile`)
			.reply(function(config: any) {
				token = config.headers["Authorization"];

				return [200, { Id: "0123" }];
			});
		expect.assertions(2);

		return trimConnector.getDriveId("").then((id) => {
			expect(id).toEqual("0123");
			expect(token).toEqual("Bearer token123");
		});
	});
});
