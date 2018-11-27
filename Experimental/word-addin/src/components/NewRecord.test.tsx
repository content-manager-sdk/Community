import * as React from "react";
import { mount } from "enzyme";
import NewRecord from "./NewRecord";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

// it("Title exists on page", () => {
//   const hello = mount(<MainApp appStore={{ ApplicationDisplayName: "CM" }} />);
//   expect(hello.find("div")).toBe;
// });

describe("New Record layout", function() {
  it("contains a button and a list", function(this: any) {
    const wrapper = mount(
      <NewRecord.wrappedComponent
        appStore={{ messages: { web_Register: "Register" } }}
      />
    );

    expect(wrapper.find(PrimaryButton).exists()).toBeTruthy();
    expect(wrapper.find("PrimaryButton").text()).toMatch("Register");
  });
});
