import * as React from "react";
import { shallow } from "enzyme";
import { BootStrap } from "./BootStrap";
import MainApp from "./MainApp";
import { ErrorDisplay } from "./ErrorDisplay";

describe("BootStrap", function() {
	it("shows error component", function() {
		const wrapper = shallow(
			<BootStrap.wrappedComponent
				appStore={{
					status: "ERROR",
					errorMessage: "test",
					fetchBaseSettingFromTrim: () => {},
				}}
			/>
		);
		//   expect(wrapper).toMatchSnapshot();
		expect(wrapper.find(ErrorDisplay).exists()).toBeTruthy();
		//expect(wrapper.find("ErrorDisplay"));
		//  expect(wrapper.find("div"));
	});
});

describe("BootStrap", function() {
	//   beforeEach(function(this: any) {
	//     this.appStore = { status: "WAITING" };
	//   });

	it("shows Main component", function() {
		const wrapper = shallow(
			<BootStrap.wrappedComponent
				appStore={{ status: "WAITING", fetchBaseSettingFromTrim: () => {} }}
			/>
		);

		expect(wrapper.find(MainApp).exists()).toBeTruthy();
		//expect(wrapper.find("ErrorDisplay"));
		//  expect(wrapper.find("div"));
	});
});
