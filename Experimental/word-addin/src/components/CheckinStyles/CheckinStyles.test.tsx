import * as React from "react";
import { shallow, mount } from "enzyme";
import { CheckinStyles } from "./CheckinStyles";
import { TrimConnector } from "../../trim-coms/trim-connector";
import ContextList from "../ContextList/ContextList";
import NewRecord from "../NewRecord";
import ViewTrimObject from "../ViewTrimObject/ViewTrimObject";
import EditTrimObject from "../EditTrimObject/EditTrimObject";
import OutlookFolderPicker from "../OutlookFolderPicker/OutlookFolderPicker";

jest.mock("../../office-coms/OutlookConnector");

describe("Check in Styles", function() {
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

	it("fire command", () => {
		let firedCommand;
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New", 0);

		expect(wrapper.state().view).toEqual("New");
	});

	it("send computed props to PropertySheet", () => {
		let firedCommand;
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New", 7);

		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it("view object", () => {
		let firedCommand;
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("Properties", 8);

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
		expect(wrapper.find(ViewTrimObject).props().recordUri).toEqual(8);
	});

	it("edit object", () => {
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("Properties", 8);

		wrapper
			.find(ViewTrimObject)
			.props()
			.onEdit();
		expect(wrapper.find(EditTrimObject).exists()).toBeTruthy();
		expect(wrapper.find(EditTrimObject).props().recordUri).toEqual(8);
	});

	it("state re-set after record created", (done) => {
		let firedCommand;
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		wrapper
			.find(NewRecord)
			.props()
			.onTrimObjectCreated({ Uri: 0 });
		setTimeout(() => {
			try {
				expect(wrapper.state().view).toEqual("List");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("Create Linked folder contains OutlookFolderPicker", () => {
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				forServerProcessing={true}
				appStore={mockAppStore}
				trimConnector={trimConnector}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		expect(wrapper.find(OutlookFolderPicker).exists()).toBeTruthy();
	});

	it("Create Check in Style folder does not contain OutlookFolderPicker", () => {
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={false}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		expect(wrapper.find(OutlookFolderPicker).exists()).toBeFalsy();
	});

	it("folder id set enables New Record", () => {
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		wrapper
			.find(OutlookFolderPicker)
			.props()
			.onChange("abc");

		expect(wrapper.find(NewRecord).props().folderId).toEqual("abc");
		expect(wrapper.find(NewRecord).props().isLinkedFolder).toBeTruthy();
	});

	it("isLinked folder not set for client side processing", () => {
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={false}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		expect(wrapper.find(NewRecord).props().isLinkedFolder).toBeFalsy();
	});

	it("does not attempt to link folder for an auto generated linked folder", (done) => {
		(global as any).mockObject.setUrnOnFolderId = "not_set";
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		wrapper.setState({ folderId: "cm_auto" });
		wrapper
			.find(NewRecord)
			.props()
			.onTrimObjectCreated({ Uri: 1 });
		setTimeout(() => {
			try {
				expect((global as any).mockObject.setUrnOnFolderId).toEqual("not_set");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("does not attempt to link folder for an auto generated linked folder", (done) => {
		(global as any).mockObject.setUrnOnFolderId = "not_set";
		const wrapper = shallow<CheckinStyles>(
			<CheckinStyles
				appStore={mockAppStore}
				trimConnector={trimConnector}
				forServerProcessing={true}
			/>
		);

		wrapper
			.find(ContextList)
			.props()
			.onCommand("New");

		wrapper.setState({ folderId: "aaaa" });
		wrapper
			.find(NewRecord)
			.props()
			.onTrimObjectCreated({ Uri: 1 });
		setTimeout(() => {
			try {
				expect((global as any).mockObject.setUrnOnFolderId).toEqual("aaaa");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
