//import "../../node_modules/@microsoft/office-js/dist/office.js";
//import {Word} from "../../node_modules/@microsoft/office-js/dist/word-15.js";
import { WordConnector } from "./word-connector";
//import "../../node_modules/@microsoft/office-js/dist/office.js";

// (function() {
//   Office.initialize = function() {
//     // If you need to initialize something you can do so here.
//     //  loadProps();
//   };
// })();

//let wordjs = "../../node_modules/@microsoft/office-js/dist/word-15.js";

let Mock_Action = "";
let uriProp = { key: "", value: "" };
export namespace Word {
  export const run = function(callback) {
    return callback({
      document: {
        properties: {
          customProperties: {
            getItem: function(itemName) {
              uriProp.key = itemName;
              return uriProp;
            }
          }
        }
      },
      load: function() {},
      sync: function() {
        if (Mock_Action == "ERROR_IN_SYNC") {
          throw new Error("big error");
        } else if (Mock_Action == "URI_NULL") {
          uriProp.value = null;
        } else if (Mock_Action == "URI_0") {
          uriProp.value = "0";
        } else {
          uriProp.value = "1";
        }
        return new Promise(function(resolve, reject) {
          if (Mock_Action == "URI_ERROR") {
            reject("an error");
          } else if (Mock_Action == "URI_ERROR_WITH_MESSAGE_PROP") {
            reject({ message: "an error" });
          } else {
            resolve();
          }
        });
      }
    });
  };
}
(<any>global).Word = Word;

// export namespace Office {
//   export const initialize = function() {};
// }
// (<any>global).Office = Office;

describe("word apis", () => {
  const wordConnector = new WordConnector();

  test("the default is not OK", () => {
    Mock_Action = "URI_NULL";
    expect.assertions(1);
    return wordConnector.getUri().then(data => {
      expect(data.found).toBeFalsy();
    });
  });

  test("the record Uri == 1", () => {
    Mock_Action = "URI_0";
    expect.assertions(2);
    return wordConnector.getUri().then(data => {
      expect(data.found).toBeFalsy();
      expect(data.uri).toEqual(0);
    });
  });

  test("the record Uri == 1", () => {
    Mock_Action = "URI_1";
    expect.assertions(2);
    return wordConnector.getUri().then(data => {
      expect(data.found).toBeTruthy();
      expect(data.uri).toEqual(1);
    });
  });

  test("Error on get Uri", () => {
    Mock_Action = "URI_ERROR";
    expect.assertions(2);
    return wordConnector.getUri().then(data => {
      expect(data.found).toBeFalsy();
      expect(data.message).toEqual("");
    });
  });

  test("Error on get Uri, with message in message property", () => {
    Mock_Action = "URI_ERROR_WITH_MESSAGE_PROP";
    expect.assertions(2);
    return wordConnector.getUri().then(data => {
      expect(data.found).toBeFalsy();
      expect(data.message).toEqual("");
    });
  });

  test("Error in sync, probably not able to find custom prop", () => {
    Mock_Action = "ERROR_IN_SYNC";
    expect.assertions(2);
    return wordConnector.getUri().catch(data => {
      expect(data.found).toBeFalsy();
      expect(data.message).toEqual("big error");
    });
  });
});
//   jest.mock("../../node_modules/@microsoft/office-js/dist/word-15.js", () => {
//     return {
//       run: jest.fn()
//     };
//   });

//   jest.mock("../../node_modules/@microsoft/office-js/dist/office.js", () => {
//     return {
//       initialize: jest.fn()
//     };
//   });

//const MockObject = require("../../node_modules/@microsoft/office-js/dist/word-15.js");

/* describe("mock function", () => {
    // jest.mock("../../node_modules/@microsoft/office-js/dist/word-15.js", () => {
    //   return {
    //     run: jest.fn()
    //   };
    // });
    // it("should create mock", () => {
    //   expect(jest.isMockFunction(MockObject.run)).toBeTruthy();
    // });

    // it("should return mock values", () => {
    //   jest.mock<Word.RequestContext>(wordjs, () => {
    //     return {
    //       run: jest.fn()
    //     };
    //   });

    //   return getUri().then(data => {
    //     expect(data.ok).toBeFalsy();
    //   });
    // });
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

    // jest.mock(wordjs, () => {
    //   return {
    //     run: jest.fn()
    //   };
    // });

    it("should return mock values", () => {
      console.log("rrrrrrrrrrrrrrrrrrrrrrr");

      return getUri().then(data => {
        console.log(data);
        expect(data.ok).toBeTruthy();
      });
    });
  });*/
//});
