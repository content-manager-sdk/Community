//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import MainApp from "./MainApp";
import NewRecord from "./NewRecord";
import ExistingRecord from "./ExistingRecord";

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
    const wrapper = shallow(
      <MainApp.wrappedComponent appStore={{ RecordUri: 0 }} />
    );

    expect(wrapper.find(NewRecord).exists()).toBeTruthy();
  });

  it("Shows Exising Record component when no Record Uri found", function(this: any) {
    const wrapper = shallow(
      <MainApp.wrappedComponent appStore={{ RecordUri: 1 }} />
    );

    expect(wrapper.find(ExistingRecord).exists()).toBeTruthy();
  });
});
