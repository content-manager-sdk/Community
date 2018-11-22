//import * as enzyme from "enzyme";
import * as React from "react";
import { mount } from "enzyme";
import MainApp from "./MainApp";

// it("Title exists on page", () => {
//   const hello = mount(<MainApp appStore={{ ApplicationDisplayName: "CM" }} />);
//   expect(hello.find("div")).toBe;
// });

describe("MainApp", function() {
  it("shows product name", function(this: any) {
    const wrapper = mount(
      <MainApp appStore={{ ApplicationDisplayName: "CM" }} />
    );

    expect(wrapper.find("div.ms-font-l").text()).toMatch("CM");
    //expect(wrapper.find("ErrorDisplay"));
    //  expect(wrapper.find("div"));
  });
});
