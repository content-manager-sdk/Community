import * as React from "react";
import { shallow } from "enzyme";
import { TextField } from "office-ui-fabric-react/lib/TextField";

import { PropertySheet } from "./PropertySheet";

describe("Property Sheet", function() {
  it("displays nothing when form definition is null", () => {
    const wrapper = shallow<PropertySheet>(
      <PropertySheet formDefinition={null} />
    );

    expect(wrapper.children()).toHaveLength(0);
  });

  it("displays nothing when form definition is empty", () => {
    const wrapper = shallow<PropertySheet>(
      <PropertySheet formDefinition={{}} />
    );

    expect(wrapper.children()).toHaveLength(0);
  });

  it("displays nothing when form definition has no pages", () => {
    const wrapper = shallow<PropertySheet>(
      <PropertySheet formDefinition={{ Pages: [] }} />
    );

    expect(wrapper.children()).toHaveLength(0);
  });

  it("displays first page heading", () => {
    const wrapper = shallow<PropertySheet>(
      <PropertySheet formDefinition={{ Pages: [{ Caption: "General" }] }} />
    );

    expect(wrapper.find("h1").exists()).toBeTruthy();
    expect(wrapper.find("h1").text()).toEqual("General");
    expect(wrapper.find("h1").props().className).toEqual("ms-font-l");
  });

  it("displays a text field with label", () => {
    const wrapperWithForm = shallow<PropertySheet>(
      <PropertySheet
        defaultRecordTitle="test title"
        formDefinition={{
          Pages: [
            {
              Caption: "General",
              PageItems: [
                {
                  Format: "String",
                  Name: "RecordTypedTitle",
                  Caption: "Title (Free Text Part)"
                }
              ]
            }
          ]
        }}
      />
    );

    //  expect(wrapper.find("label").exists()).toBeTruthy();
    //  expect(wrapper.find("label").text()).toEqual("Title (Free Text Part)");
    expect(wrapperWithForm.find(TextField).exists()).toBeTruthy();
    expect(wrapperWithForm.find(TextField).props().label).toEqual(
      "Title (Free Text Part)"
    );
    expect(wrapperWithForm.find(TextField).props().defaultValue).toEqual(
      "test title"
    );
    expect(wrapperWithForm.find(TextField).props().multiline).toBeFalsy();

    // when > 40 characters entered switch to multi-line
    wrapperWithForm
      .find(TextField)
      .props()
      .onChange(null, "01234567890123456789012345678901234567890");
    expect(wrapperWithForm.find(TextField).props().multiline).toBeTruthy();

    wrapperWithForm
      .find(TextField)
      .props()
      .onChange(null, "012345678");
    expect(wrapperWithForm.find(TextField).props().multiline).toBeFalsy();
  });

  it("fires the onChange event when a text field changes", () => {
    let onChangeForm;
    const wrapperWithForm = shallow<PropertySheet>(
      <PropertySheet
        onChange={function(ev, newForm) {
          onChangeForm = newForm;
        }}
        formDefinition={{
          Pages: [
            {
              Caption: "General",
              PageItems: [
                {
                  Format: "String",
                  Name: "RecordTypedTitle",
                  Caption: "Title (Free Text Part)"
                }
              ]
            }
          ]
        }}
      />
    );

    wrapperWithForm
      .find(TextField)
      .props()
      .onChange(null, "abc");

    expect(onChangeForm).toEqual({ RecordTypedTitle: "abc" });
  });
});
