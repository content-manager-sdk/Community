import * as React from "react";
import { mount } from "enzyme";
import { NewRecord } from "./NewRecord";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { TrimConnector } from "../trim-coms/trim-connector";
import { IRecordType, ITrimMainObject } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";

describe("New Record layout", function() {
  let resolveRecordTypes;

  let mockTrimConnector = new TrimConnector();
  mockTrimConnector.search = () => {
    return new Promise(function(resolve) {
      resolveRecordTypes = resolve;
    });
  };

  const mockStore = {
    RecordUri: 0,
    messages: {
      web_Register: "Register",
      web_SelectRecordType: "Select a Record Type"
    },

    createRecord: recordUri => {
      mockStore.RecordUri = recordUri;
    }
  };

  const wrapper = mount<NewRecord>(
    <NewRecord appStore={mockStore} trimConnector={mockTrimConnector} />
  );

  it("contains a button", () => {
    expect(wrapper.find(PrimaryButton).exists()).toBeTruthy();
    expect(wrapper.find(PrimaryButton).text()).toMatch("Register");
  });

  it("contains a Record Type dropdown", async done => {
    resolveRecordTypes([{ Uri: 1, NameString: "Document" } as IRecordType]);

    expect(wrapper.find(Dropdown).exists()).toBeTruthy();
    expect(wrapper.find(Dropdown).props().placeholder).toEqual(
      "Select a Record Type"
    );
    setImmediate(() => {
      expect(
        wrapper
          .update()
          .find(Dropdown)
          .props().options
      ).toEqual([{ key: 1, text: "Document" }]);
      done();
    });
  });

  it("Sets the Record Uri from on load and onChange", () => {
    //   wrapper
    //   .update()
    //   .find(Dropdown).props().onChange({ type:null, timeStamp:null, target:null, persist:null, isPropagationStopped:null, stopPropagation:null, isDefaultPrevented:null, preventDefault:null, bubbles:false, currentTarget:null, cancelable:false, defaultPrevented:false, eventPhase:null, isTrusted:true, nativeEvent:null});

    const instance = wrapper.instance();
    instance.setRecordTypes([]);

    expect(instance.recordTypeUri).toEqual(0);

    // should be zero after the record types list has been changed
    instance.setRecordTypes([
      { key: 1, text: "Document" },
      { key: 5, text: "Document 5" }
    ]);
    wrapper
      .update()
      .find(Dropdown)
      .props()
      .onChange(null, null, 1);

    instance.setRecordTypes([{ key: 1, text: "Document" }]);

    expect(instance.recordTypeUri).toEqual(0);

    wrapper
      .update()
      .find(Dropdown)
      .props()
      .onChange(null, null, 0);

    expect(instance.recordTypeUri).toEqual(1);
  });

  it("calls create record on button press", () => {
    const instance = wrapper.instance();
    instance.setRecordTypes([
      { key: 1, text: "Document" },
      { key: 5, text: "Document 5" }
    ]);

    wrapper
      .update()
      .find(Dropdown)
      .props()
      .onChange(null, null, 0);

    wrapper
      .update()
      .find(PrimaryButton)
      .props()
      .onClick(null);

    expect(mockStore.RecordUri).toEqual(1);
  });
});
