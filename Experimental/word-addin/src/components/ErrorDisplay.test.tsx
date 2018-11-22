//import * as enzyme from "enzyme";
import * as React from "react";
import { mount } from "enzyme";
import ErrorDisplay from "./ErrorDisplay";

describe("ErrorDisplay", function() {
  it("shows product name", function(this: any) {
    const wrapper = mount(<ErrorDisplay Message="test" />);

    expect(wrapper.find("div.error-header").text()).toMatch("Error");
    expect(wrapper.find("div.error-body").text()).toMatch("test");
    //expect(wrapper.find("ErrorDisplay"));
    //  expect(wrapper.find("div"));
  });
});
