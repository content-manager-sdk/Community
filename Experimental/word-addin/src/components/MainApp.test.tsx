//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { MainApp } from "./MainApp";
import NewRecord from "./NewRecord";
import EditTrimObject from "./EditTrimObject/EditTrimObject";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import OutlookAttachments from "./OutlookAttachments/OutlookAttachments";

describe("MainApp", function() {
	it("Shows OutlookAttachments component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{
					documentInfo: { Uris: [] },
					status: "WAITING",
					isEmail: function() {
						return true;
					},
				}}
			/>
		);

		expect(wrapper.find(OutlookAttachments).exists()).toBeTruthy();
	});

	it("Shows NewRecord for Word Addin component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp
				appStore={{
					documentInfo: { Uris: [] },
					status: "WAITING",
					isEmail: function() {
						return false;
					},
				}}
			/>
		);

		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it("Does not show New Record component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [] }, status: "STARTING" }} />
		);

		expect(wrapper.find(NewRecord).exists()).toBeFalsy();
	});

	it("Shows Existing Record component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [1] } }} />
		);

		expect(wrapper.find(ViewTrimObjects).exists()).toBeTruthy();
	});

	it("Shows Edit Record component on edit", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [1] } }} />
		);

		const viewer = wrapper.find(ViewTrimObjects);
		viewer.props().onEdit(1);

		expect(wrapper.find(ViewTrimObjects).exists()).toBeFalsy();
		expect(wrapper.find(EditTrimObject).exists()).toBeTruthy();
	});

	it("Shows View Record component on edit", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [1] } }} />
		);

		const viewer = wrapper.find(ViewTrimObjects);
		viewer.props().onEdit(1);

		const editor = wrapper.find(EditTrimObject);
		editor.props().onSave();

		expect(wrapper.find(ViewTrimObjects).exists()).toBeTruthy();
		expect(wrapper.find(EditTrimObject).exists()).toBeFalsy();
	});

	it("Shows null when neither Uri or Id found (yet)", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [] } }} />
		);

		expect(wrapper.children()).toHaveLength(0);
	});
});
