//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { MainApp } from "./MainApp";
import NewRecord from "./NewRecord";
import EditTrimObject from "./EditTrimObject/EditTrimObject";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";

describe("MainApp", function() {
	it("Shows New Record component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ documentInfo: { Uris: [] }, Id: "my id" }} />
		);

		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
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
