import * as React from "react";
import { shallow } from "enzyme";
import { ContextList } from "./ContextList";
import { IconButton } from "office-ui-fabric-react";

import { TrimConnector } from "../../trim-coms/trim-connector";

describe("Context List", function() {
	let testUri = 0;
	let recordUri = 0;
	let testError = "";
	let testText = "";
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	trimConnector.getMessages = function() {
		return { bob_needSelectedRow: "test {0}" };
	}.bind(trimConnector);

	trimConnector.getObjectDefinitions = function() {
		return new Promise((resolve) => {
			resolve([{ Id: "Record", Caption: "Record" }]);
		});
	}.bind(trimConnector);

	const mockWordConnector = {
		insertText(textToInsert: string): void {
			testText = textToInsert;
		},
	};

	const mockAppStore = {
		fetchBaseSettingFromTrim: null,
		resetError: null,
		messages: { web_Please_Select: "Please select a Record." },
		status: "",
		setError: function(message: any) {
			testError = message;
		},
		setErrorMessage: function(message) {
			testError = message;
		},
		openInCM: function(uri: number) {
			testUri = uri;
		},
		RecordUri: recordUri,
		documentInfo: {
			Enums: {
				RecordRelationshipType: [{ Id: "Related", Caption: "Related" }],
			},
		},
	};

	it("has menu button", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		expect(wrapper.find(IconButton)).toBeTruthy();
	});
});
