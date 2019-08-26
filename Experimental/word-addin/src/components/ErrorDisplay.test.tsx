//import * as enzyme from "enzyme";
import * as React from "react";
import { mount } from "enzyme";

import { ErrorDisplay } from "./ErrorDisplay";

describe("ErrorDisplay", function() {
	it("shows product name", function(this: any) {
		const wrapper = mount(
			<ErrorDisplay
				appStore={{ errorMessage: "test", messages: { web_HPRM: "CM" } }}
			/>
		);

		expect(wrapper.find("p.ms-Dialog-title").text()).toMatch("CM");
		expect(wrapper.find("div.trim-error-message").text()).toMatch("test");
	});

	it("clears error message", function() {
		let resetCalled = false;
		const mockAppStore = {
			errorMessage: "test",
			messages: { web_HPRM: "CM" },
			resetError: function() {
				resetCalled = true;
			},
		};

		const wrapper = mount(<ErrorDisplay appStore={mockAppStore} />);

		wrapper
			.find("button")
			.props()
			.onClick(null);

		expect(resetCalled).toBeTruthy();
	});
});
