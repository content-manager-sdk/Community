/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { shallow } from "enzyme";
//import { AppStore } from "../stores/AppStore";
//import MainApp from "./MainApp";

Enzyme.configure({
  adapter: new Adapter()
});

describe("Hello, Enzyme!", () => {
  it("renders", () => {
    const wrapper = shallow(
      <div>
        <h1>Hello, Enzyme!</h1>
      </div>
    );
    expect(wrapper.find("h1").html()).toMatch(/Hello, Enzyme/);
  });

  it("renders snapshots, too", () => {
    const wrapper = shallow(
      <div>
        <h1>Hello, Enzyme!</h1>
      </div>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

// describe("AppStore", function() {
//   beforeEach(function() {
//     this.appStore = { status: "ERROR" };
//   });

//   it("shows error component", function() {
//     const wrapper = shallow(<MainApp appStore={this.appStore} />);

//     //expect(wrapper.find("ErrorDisplay"));
//     expect(wrapper.find("div"));
//   });
// });

// it("should contain two table columns", () => {
//   const row = shallow(<MainApp />);
//   const columns = row.find(div);
//   expect(columns).to.have.length.of(1);
// });
