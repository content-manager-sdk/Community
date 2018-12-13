//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { DetailsView } from "./DetailsView";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { IObjectDetails } from "../trim-coms/trim-connector";
import { Label } from "office-ui-fabric-react/lib/Label";

describe("Details View", function() {
	beforeEach(() => {
		insertedText = "";
	});

	let insertedText = "";
	const mockWordConnector = {
		insertText(textToInsert: string): void {
			insertedText = textToInsert;
		},
	};
	const mockTrimConnector = {
		getObjectDetails(
			trimType: BaseObjectTypes,
			uri: number
		): Promise<IObjectDetails> {
			return new Promise(function(resolve) {
				resolve({
					results: [
						{
							Uri: 5,
							RecordTitle: { StringValue: "my record" },
						},
					],
					propertiesAndFields: [{ Id: "RecordTitle", Caption: "Title" }],
				});
			});
		},
	};

	const wrapper = shallow<DetailsView>(
		<DetailsView
			appStore={{ RecordUri: 0, Id: "my id" }}
			trimConnector={mockTrimConnector}
			wordConnector={mockWordConnector}
		/>
	);

	it("root element found", function(this: any) {
		expect(wrapper.find("div.details-view").exists()).toBeTruthy();
	});

	it("child element found", function(this: any) {
		expect(wrapper.find("div.details-item").exists()).toBeTruthy();
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
				.childAt(0)
				.text()
		).toEqual("Title");

		expect(
			wrapper
				.find("div.details-item")
				.children("span")
				.text()
		).toEqual("my record");
	});

	it("displays an icon to insert the text", function(this: any) {
		expect(
			wrapper
				.find("div.details-item")
				.children("i")
				.exists()
		).toBeTruthy();

		wrapper
			.find("div.details-item")
			.children("i")
			.props()
			.onClick(null);

		expect(insertedText).toEqual("my record");
	});
});
