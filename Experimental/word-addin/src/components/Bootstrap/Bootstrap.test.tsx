import * as React from "react";
import { shallow } from "enzyme";
import { BootStrapWord } from "./BootStrapWord";
import MainApp from "../MainApp";
import ErrorDisplay from "../ErrorDisplay";

jest.mock("../../stores/AppStoreWord");

describe("BootStrap", function() {
	it("shows error component", function() {
		const wrapper = shallow(<BootStrapWord />);

		expect(wrapper.find(ErrorDisplay).exists()).toBeTruthy();
	});

	it("shows Main component", function() {
		const wrapper = shallow(<BootStrapWord />);

		expect(wrapper.find(MainApp).exists()).toBeTruthy();
	});
});
