import * as enzyme from "enzyme";
import * as React from "react";
import MainApp from "./MainApp";

it("renders the correct text when no enthusiasm level is given", () => {
  const hello = enzyme.shallow(<MainApp />);
  expect(hello.find("div").exists());
});

it("renders the correct text when no enthusiasm level is given", () => {
  const hello = enzyme.shallow(<MainApp />);
  expect(hello.find("div").text()).toEqual("hello");
});
