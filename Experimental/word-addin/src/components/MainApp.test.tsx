//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { MainApp } from "./MainApp";
import NewRecord from "./NewRecord";
import EditTrimObject from "./EditTrimObject/EditTrimObject";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import OutlookAttachments from "./OutlookAttachments/OutlookAttachments";
import TrimConnector from "../trim-coms/trim-connector";
import flushPromises = require("flush-promises");

describe("MainApp", function () {
	let trimConnector = new TrimConnector();

	trimConnector.getDefaultRecordType = function () {
		return new Promise(function (resolve) {
			resolve();
		});
	}.bind(trimConnector);

	it("Shows OutlookAttachments component when no Record Uri found", function (this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{
					documentInfo: { Uris: [] },
					status: "WAITING",
					isEmail: function () {
						return true;
					},
				}}
				trimConnector={trimConnector}
			/>
		);

		expect(wrapper.find(OutlookAttachments).exists()).toBeTruthy();
	});

	it("Shows NewRecord for Word Addin component when no Record Uri found", async () => {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{
					documentInfo: { Uris: [] },
					status: "WAITING",
					isEmail: function () {
						return false;
					},
					messages: {},
				}}
				trimConnector={trimConnector}
				wordConnector={{
					getWebUrl: function () {
						return Promise.resolve("http");
					},
				}}
			/>
		);
		await flushPromises();
		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it("Does not show New Record component when no Record Uri found", async () => {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{ documentInfo: { Uris: [] }, status: "STARTING" }}
				trimConnector={trimConnector}
			/>
		);
		await flushPromises();
		expect(wrapper.find(NewRecord).exists()).toBeFalsy();
	});

	it("Shows Existing Record component when no Record Uri found", async () => {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{ documentInfo: { Uris: [1] } }}
				trimConnector={trimConnector}
			/>
		);
		await flushPromises();
		expect(wrapper.find(ViewTrimObjects).exists()).toBeTruthy();
	});
});
