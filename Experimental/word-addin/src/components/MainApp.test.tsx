//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { MainApp } from "./MainApp";
import NewRecord from "./NewRecord";
import ViewTrimObject from "./ViewTrimObject/ViewTrimObject";
import EditTrimObject from "./EditTrimObject/EditTrimObject";

// it("Title exists on page", () => {
//   const hello = mount(<MainApp appStore={{ ApplicationDisplayName: "CM" }} />);
//   expect(hello.find("div")).toBe;
// });

describe("MainApp", function() {
	//   it("shows product name", function(this: any) {
	//     const wrapper = mount(
	//       <MainApp appStore={{ ApplicationDisplayName: "CM" }} />
	//     );

	//     expect(wrapper.find("div.ms-font-l").text()).toMatch("CM");
	//     //expect(wrapper.find("ErrorDisplay"));
	//     //  expect(wrapper.find("div"));
	//   });

	it("Shows New Record component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(
			<MainApp appStore={{ RecordUri: 0, Id: "my id" }} />
		);

		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it("Shows Exising Record component when no Record Uri found", function(this: any) {
		const wrapper = shallow<MainApp>(<MainApp appStore={{ RecordUri: 1 }} />);

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
	});

	it("Shows Edit Record component on edit", function(this: any) {
		const wrapper = shallow<MainApp>(<MainApp appStore={{ RecordUri: 1 }} />);

		const viewer = wrapper.find(ViewTrimObject);
		viewer.props().onEdit();

		expect(wrapper.find(ViewTrimObject).exists()).toBeFalsy();
		expect(wrapper.find(EditTrimObject).exists()).toBeTruthy();
	});

	it("Shows View Record component on edit", function(this: any) {
		const wrapper = shallow<MainApp>(<MainApp appStore={{ RecordUri: 1 }} />);

		const viewer = wrapper.find(ViewTrimObject);
		viewer.props().onEdit();

		const editor = wrapper.find(EditTrimObject);
		editor.props().onSave();

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
		expect(wrapper.find(EditTrimObject).exists()).toBeFalsy();
	});

	it("Shows null when neither Uri or Id found (yet)", function(this: any) {
		const wrapper = shallow<MainApp>(<MainApp appStore={{ RecordUri: 0 }} />);

		expect(wrapper.children()).toHaveLength(0);
	});
});
