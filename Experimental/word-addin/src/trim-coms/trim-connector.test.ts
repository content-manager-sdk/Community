import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
,
import {
  IRecordType,
  SERVICEAPI_BASE_URI,
  TrimConnector,
} from "./trim-connector";

import * as fetchMock from "fetch-mock";

describe("Test fetch from TRIM", () => {
  const trimConnector = new TrimConnector();

  const recordTypeSearchMatch = (url: string, opts: any) => {
    return (
      url.startsWith(SERVICEAPI_BASE_URI + "/RecordType") &&
      url.indexOf("q=all") > -1 &&
      url.indexOf("properties=NameString") > -1 &&
      url.indexOf("purpose=3") > -1
    );
  };

  fetchMock.get(recordTypeSearchMatch, {
	Count: 0,
	MinimumCount: 0,
	HasMoreItems: false,
	PropertiesAndFields: {},
	ResponseStatus: {},
	Results: [
		{
		  NameString: "Document",
		  TrimType: "RecordType",
		  Uri: 1,
		},
	  ],
	TotalResults: 1,
	TrimType: "RecordType",
  });

  fetchMock.get("begin:" + SERVICEAPI_BASE_URI + "/Location/me", {
    Results: [
      {
        LocationFullFormattedName: { Value: "david" },
        TrimType: "Location",
        Uri: 1,
      },
    ],
    PropertiesAndFields: {},
    TotalResults: 1,
    MinimumCount: 0,
    Count: 0,
    HasMoreItems: false,
    TrimType: "Location",
    ResponseStatus: {},
  },{name:"GetMe"});

  fetchMock.get(
    "begin:" + SERVICEAPI_BASE_URI + "/Localisation?MatchMessages=w",
    {
      Messages: { web_HPRM: "Content Manager" },
      ResponseStatus: {},
    },
  );

  fetchMock.get(
    "begin:" +
      SERVICEAPI_BASE_URI +
      "/RecordType/123?properties=dataentryformdefinition",
    {
      Results: [
        {
          TrimType: "RecordType",
          DataEntryFormDefinition: {
            Version: "1",
            SupportsElectronicDocs: true,
            TitlingMethod: "FreeText",
            Pages: [{}],
          },
        },
      ],
    },
  );



  it("Record Types are returned", () => {
    expect.assertions(1);
    return trimConnector
      .search<IRecordType>(BaseObjectTypes.RecordType, "all", 3)
      .then((data) => {
        expect(data[0].NameString).toBe("Document");
      });
  });

  it("the FullFormattedName is david", () => {
    expect.assertions(1);
    return trimConnector.getMe().then((data) => {
      expect(data.FullFormattedName.Value).toBe("david");
    });
  });

  it("does not send a body with a GET", () =>{
    return trimConnector.getMe().then((data) => {
		let calls =	fetchMock.calls("GetMe")


		expect (calls[0][1].body).toBeUndefined();
	  });


  });


  it("Application name is Content Manager", () => {
    expect.assertions(1);
    return trimConnector.getMessages().then((data) => {
      expect(data.web_HPRM).toBe("Content Manager");
    });
  });

  it("Property sheet requested from Record Type", () => {
    expect.assertions(1);
    return trimConnector.getPropertySheet(123).then((data) => {
      expect(data.Pages.length).toBe(1);
    });
  });

  it("Error is handled", () => {
    fetchMock.reset();
    fetchMock.get("*", {
      body: {            
		Count: 0,
		HasMoreItems: false,	
        MinimumCount: 0, 
		PropertiesAndFields: {},
        ResponseStatus: {
		  ErrorCode: "ApplicationException",
		  Errors: [],
          Message: "Unable to find object test",         
		},
		Results: [],
		TotalResults: 0,
		TrimType: "Location",
      },
      status: 500,
    });
    expect.assertions(1);
    // expect(appStore.status).toBe("WAITING");
    return trimConnector.getMe().catch((data) => {
      // expect(appStore.status).toBe("ERROR");
      expect(data.message).toBe("Unable to find object test");
    });
  });

  it("Get messages error is handled", () => {
    fetchMock.reset();
    fetchMock.get("*", {
      body: {
        ResponseStatus: {
			ErrorCode: "ApplicationException",
			Errors: [],
        	Message: "error",
        },
      },
      status: 500,
    });
    expect.assertions(1);

    return trimConnector.getMessages().catch((data) => {
      expect(data.message).toBe("error");
    });
  });

  it("has posted a new Record", () =>{

	fetchMock.post(
		"begin:" + SERVICEAPI_BASE_URI + "/Record",
		{
		  Results:[
			  {
				  Uri:123
				}
		  ],
		},{name:"NewRecord"}
	  );
	
	  return trimConnector.registerInTrim(1, {"RecordTypedTitle":"test"}).then((data) => {

		let calls =	fetchMock.calls("NewRecord")

		expect(calls.length).toBe(1);
		expect (calls[0][1].body).toEqual(JSON.stringify({RecordTypedTitle:"test", RecordRecordType:1}));
	  });

  });
});
