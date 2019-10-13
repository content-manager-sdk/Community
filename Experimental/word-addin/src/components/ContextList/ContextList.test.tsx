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

	it("calls search in trim connector", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		wrapper.setState({ selectRecord: { Uri: 3 } });

		const menuItem = wrapper.find(IconButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);

		expect(testUri).toEqual(3);
		expect.assertions(1);
	});

	it("Error when object not select", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		const menuItem = wrapper.find(IconButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);

		expect(testError).toEqual("Please select a Record.");
		expect.assertions(1);
	});

	it("calls paste title", () => {
		const wrapper = shallow<ContextList>(
			<ContextList
				appStore={mockAppStore}
				wordConnector={mockWordConnector}
				trimConnector={trimConnector}
			/>
		);

		wrapper.setState({ selectRecord: { Uri: 3, ToolTip: "a title" } });

		const menuItem = wrapper.find(IconButton).props().menuProps.items[1];

		menuItem.onClick(null, menuItem);

		expect(testText).toEqual("a title");
		expect.assertions(1);
	});

	it("error on context when record not selected", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList
				appStore={mockAppStore}
				wordConnector={mockWordConnector}
				trimConnector={trimConnector}
			/>
		);

		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mi) => {
				return mi.key === "addRelationshipto";
			}).subMenuProps.items[0];
		menuItem.onClick();
		setTimeout(() => {
			try {
				expect(testError).toEqual("bob_needSelectedRow");
				expect.assertions(1);
				done();
			} catch (e) {
				done.fail();
			}
		});
	});
});
