//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { DetailsView } from "./DetailsView";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import TrimConnector, {
	IObjectDetails,
	SERVICEAPI_BASE_URI,
} from "../trim-coms/trim-connector";
import { Label } from "office-ui-fabric-react/lib/Label";
import { disconnect } from "cluster";
import { ComboBox, DefaultButton, Icon } from "office-ui-fabric-react";

describe("Details View", function() {
	beforeEach(() => {
		insertedText = "";
		insertedUrl = "";
		setUri = 0;
		setProperties = [];
		wrapper.setProps({
			recordDetails: {
				results: [
					{
						Uri: 5,
						RecordTitle: { StringValue: "my record" },
						RecordNumber: { StringValue: "REC_1" },
						RecordAccessControl: { StringValue: "my record" },
						RecordContainer: {
							StringValue: "REC_2 - title",
							Uri: 7,
							RecordNumber: { Value: "REC_2" },
						},
						Fields: { SparkleLevel: { StringValue: "Medium" } },
					},
				],
				propertiesAndFields: [
					{ Id: "RecordTitle", Caption: "Title" },
					{ Id: "RecordNumber", Caption: "Number" },
					{ Id: "RecordContainer", Caption: "Container" },
					{ Id: "RecordAccessControl", Caption: "Acl" },
					{ Id: "SparkleLevel", Caption: "SparkleLevel" },
				],
			},
		});
	});

	let insertedText = "";
	let setUri = 0;
	let setForOptionsSet = "";
	let setProperties = [];
	let insertedUrl = "";

	const mockWordConnector = {
		insertText(textToInsert: string): void {
			insertedText = textToInsert;
		},
		insertLink(textToInsert: string, url: string): void {
			insertedText = textToInsert;
			insertedUrl = url;
		},
	};
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	trimConnector.setViewPaneProperties = function(trimObject, propertyIds) {
		setUri = trimObject.Uri;
		setProperties = propertyIds;
		return new Promise((resolve) => {
			resolve([]);
		});
	}.bind(trimConnector);

	trimConnector.getViewPanePropertyDefs = function(trimType, uri) {
		return new Promise((resolve) => {
			resolve([
				{ Id: "RecordTitle", Caption: "title" },
				{ Id: "AField", Caption: "A Field" },
			]);
		});
	}.bind(trimConnector);

	trimConnector.getObjectDetails = function(trimType, uri) {
		return new Promise((resolve) => {
			resolve({
				results: [
					{
						Uri: 5,
						RecordTitle: { StringValue: "my record" },
						RecordNumber: { StringValue: "my record" },
						RecordAccessControl: { StringValue: "my record" },
						Fields: {
							SparkleLevel: { StringValue: "Medium" },
							AField: { StringValue: "aa" },
						},
					},
				],
			});
		});
	}.bind(trimConnector);

	const wrapper = shallow<DetailsView>(
		<DetailsView
			appStore={{
				getWebClientUrl: function(uri: number, isContainer?: boolean) {
					if (isContainer) {
						return `recContainer:${uri}`;
					} else {
						return uri.toString();
					}
				},
				RecordUri: 0,
				Id: "my id",
				messages: { web_Add: "Add" },
			}}
			trimConnector={trimConnector}
			wordConnector={mockWordConnector}
			recordDetails={{}}
		/>
	);

	it("root element found", (done) => {
		setImmediate(() => {
			expect(wrapper.find("div.details-view").exists()).toBeTruthy();
			done();
		});
	});

	it("child element found", (done) => {
		setImmediate(() => {
			try {
				expect(wrapper.find("div.details-item").exists()).toBeTruthy();
			} catch (e) {
				done.fail(e);
			}
			done();
		});
	});

	it("displays a label and content", function(this: any) {
		expect(
			wrapper
				.find("div.details-item")
				.children(Label)
				.exists()
		).toBeTruthy();

		expect(
			wrapper
				.find("div.details-item")
				.children(Label)
				.first()
				.childAt(0)
				.text()
		).toEqual("Title");

		expect(
			wrapper
				.find("div.details-item")
				.children("span")
				.first()
				.text()
		).toEqual("my record");
	});

	it("displays an icon to remove the property", function(this: any) {
		expect(
			wrapper
				.find("div.details-item")
				.find(Icon)
				.exists()
		).toBeTruthy();

		wrapper
			.findWhere((itemWrapper) => {
				return (
					itemWrapper.hasClass("details-item") &&
					itemWrapper.key() === "RecordTitle"
				);
			})
			.find(Icon)
			.first()
			.props()
			.onClick(null);

		expect(setUri).toEqual(5);
		expect(setProperties).toEqual([
			"RecordNumber",
			"RecordContainer",
			"RecordAccessControl",
			"SparkleLevel",
		]);
	});

	it("displays an icon to paste a link", function(this: any) {
		expect(
			wrapper
				.find("div.details-item")
				.find(Icon)
				.exists()
		).toBeTruthy();

		wrapper
			.findWhere((itemWrapper) => {
				return (
					itemWrapper.hasClass("details-item") &&
					itemWrapper.key() === "RecordNumber"
				);
			})
			.find(Icon)
			.first()
			.props()
			.onClick(null);

		expect(insertedText).toEqual("REC_1");
		expect(insertedUrl).toEqual("5");
	});

	it("displays an icon to paste a container link", function(this: any) {
		expect(
			wrapper
				.findWhere((itemWrapper) => {
					return (
						itemWrapper.hasClass("details-item") &&
						itemWrapper.key() === "RecordContainer"
					);
				})
				.find(Icon)
				.exists()
		).toBeTruthy();

		wrapper
			.findWhere((itemWrapper) => {
				return (
					itemWrapper.hasClass("details-item") &&
					itemWrapper.key() === "RecordContainer"
				);
			})
			.find(Icon)
			.first()
			.props()
			.onClick(null);

		expect(insertedText).toEqual("REC_2");
		expect(insertedUrl).toEqual("recContainer:7");
	});

	it("gets property defs on combo menu open", (done) => {
		let combo = wrapper.find(ComboBox);
		//	combo.props().onMenuOpen();

		setImmediate(() => {
			try {
				combo = wrapper.find(ComboBox);
				// expect(combo.props().options[0].key).toEqual("RecordTitle");
				// expect(combo.props().options[0].text).toEqual("title");
				expect(combo.props().options[0].key).toEqual("AField");
				expect(combo.props().options[0].text).toEqual("A Field");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("adds property to view pane", (done) => {
		let combo = wrapper.find(ComboBox);

		wrapper.setState({
			propertyAndFieldDefinitions: [
				{ Id: "RecordTitle", Caption: "Title" },
				{ Id: "RecordNumber", Caption: "Number" },
				{ Id: "RecordContainer", Caption: "Container" },
				{ Id: "RecordAccessControl", Caption: "Acl" },
				{ Id: "SparkleLevel", Caption: "SparkleLevel" },
				{ Id: "AField", Caption: "" },
			],
			keysToAdd: ["AField"],
		});

		const button = wrapper.find(DefaultButton);
		button.props().onClick(null);

		setImmediate(() => {
			try {
				expect(setUri).toEqual(5);
				expect(setProperties).toEqual([
					"RecordTitle",
					"RecordNumber",
					"RecordContainer",
					"RecordAccessControl",
					"SparkleLevel",
					"AField",
				]);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
