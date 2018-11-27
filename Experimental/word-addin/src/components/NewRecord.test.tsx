import * as React from "react";
import { mount } from "enzyme";
import { NewRecord } from "./NewRecord";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { TrimConnector } from "../trim-coms/trim-connector";
import { IRecordType, ITrimMainObject } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
//let TrimConnector = require("../trim-coms/trim-connector");

describe("New Record layout", function() {
  let resolveRecordTypes;

  let mockTrimConnector = new TrimConnector();
  mockTrimConnector.search = () => {
    return new Promise(function(resolve) {
      resolveRecordTypes = resolve;

      //resolve([{ Uri: 1, NameString: "Document" } as T]);
    });
  };
  /*
  const mockTrimConnector = {
    search<T extends ITrimMainObject>(
      trimType: BaseObjectTypes,
      query: string,
      purpose: number = 0
    ): Promise<T[]> {
      return new Promise(function(resolve) {
        resolveRecordTypes = resolve;

        //resolve([{ Uri: 1, NameString: "Document" } as T]);
      });
    }
  };

  */

  // jest.mock("TrimConnector", () => {
  //   return {
  // 	search: jest.fn((arg1, arg2,arg3) =>{
  // 	resolveReordTypes = resolve;
  //    //   Promise.resolve([{ Uri: 1, NameString: "Document" } as IRecordType])
  // 	 } )
  //   };
  // });
  //let trimConnector = new TrimConnector();

  // trimConnector.search = () =>  {
  // 	return new Promise(function(resolve) {
  // 	  resolveReordTypes = resolve;

  // 	  //resolve([{ Uri: 1, NameString: "Document" } as T]);
  // 	})};

  it("contains a button", () => {
    const wrapper = mount(
      <NewRecord
        appStore={{ messages: { web_Register: "Register" } }}
        trimConnector={mockTrimConnector}
      />
    );

    expect(wrapper.find(PrimaryButton).exists()).toBeTruthy();
    expect(wrapper.find(PrimaryButton).text()).toMatch("Register");
  });

  it("contains a Record Type dropdown", async done => {
    // const ss = mockTrimConnector.search(BaseObjectTypes.RecordType, "all", 3);

    const wrapper = mount<NewRecord>(
      <NewRecord
        appStore={{ messages: { web_Register: "Register" } }}
        trimConnector={mockTrimConnector}
      />
    );

    resolveRecordTypes([{ Uri: 1, NameString: "Document" } as IRecordType]);

    expect(wrapper.find(Dropdown).exists()).toBeTruthy();
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
});
