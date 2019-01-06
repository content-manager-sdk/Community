import * as React from "react";
import { shallow } from "enzyme";
import { BootStrap } from "./BootStrap";
import MainApp from "./MainApp";
import { ErrorDisplay } from "./ErrorDisplay";

(global as any).Office = {};

describe("BootStrap", function() {
	const mockWordConnector = {
		getAutoOpen(): boolean {
			return false;
		},
	};

	it("shows error component", function() {
		const wrapper = shallow(
			<BootStrap
				appStore={{
					status: "ERROR",
					errorMessage: "test",
					fetchBaseSettingFromTrim: () => {},
				}}
				wordConnector={mockWordConnector}
			/>
		);
		//   expect(wrapper).toMatchSnapshot();
		expect(wrapper.find(ErrorDisplay).exists()).toBeTruthy();
		//expect(wrapper.find("ErrorDisplay"));
		//  expect(wrapper.find("div"));
	});

	//   beforeEach(function(this: any) {
	//     this.appStore = { status: "WAITING" };
	//   });

	it("shows Main component", function() {
		const wrapper = shallow(
			<BootStrap
				appStore={{ status: "WAITING", fetchBaseSettingFromTrim: () => {} }}
				wordConnector={mockWordConnector}
			/>
		);

		expect(wrapper.find(MainApp).exists()).toBeTruthy();
		//expect(wrapper.find("ErrorDisplay"));
		//  expect(wrapper.find("div"));
	});
});
