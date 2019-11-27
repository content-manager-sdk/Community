import { OutlookConnector } from "./OutlookConnector";
import { SERVICEAPI_BASE_URI } from "../trim-coms/trim-connector";
import MockAdapter from "axios-mock-adapter";

export namespace Office {
	export const MailboxEnums = { RestVersion: {} };

	export const context = {
		mailbox: {
			diagnostics: {},
			convertToRestId: (
				itemId: string,
				restVersion: Office.MailboxEnums.RestVersion
			) => {
				return "rest_id";
			},
			getCallbackTokenAsync: (
				options: Office.AsyncContextOptions & { isRest?: boolean },
				callback: (result: AsyncResult<string>) => void
			) => {
				callback({ status: "succeeded", value: "abc" });
			},
			restUrl: "rest_url",
			item: { subject: "test_subject" },
		},
	};
}

(<any>global).Office = Office;

const axios = require("axios");

describe("Outlook connector tests", () => {
	beforeEach(() => {
		Office.context.mailbox.item.subject = "test_subject";
	});
	const outlookConnector = new OutlookConnector();
	const mock = new MockAdapter(axios);

	it("set URN on email", (done) => {
		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:/123", "CM:");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:/123",
							},
						],
						Subject: "CM: test_subject",
					})
				);

				expect(postConfig.headers.Authorization).toEqual("Bearer abc");

				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("not duplicate prefix", (done) => {
		Office.context.mailbox.item.subject = "CM: test_subject";

		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:/123", "CM:");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:/123",
							},
						],
						Subject: "CM: test_subject",
					})
				);

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("prefix is empty", (done) => {
		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:/123", "");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:/123",
							},
						],
					})
				);

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
