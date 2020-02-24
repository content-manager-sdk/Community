//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { EditTrimObject } from "./EditTrimObject";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import PropertySheet from "../PropertySheet";
import { ITrimMainObject } from "../../trim-coms/trim-connector";
import { PrimaryButton } from "office-ui-fabric-react";
import flushPromises = require("flush-promises");

describe("EditTrimObject", () => {
	let savedProperties = null;

	beforeEach(() => {
		savedProperties = null;
	});

	const pageItemsWithTitle = {
		Pages: [
			{
				Caption: "General",
				Type: "Normal",
				PageItems: [
					{
						Format: "String",
						Name: "RecordTypedTitle",
						Caption: "Title (Free Text Part)",
					},
				],
			},
		],
	};

	const mockTrimConnector = {
		getPropertySheetForObject(
			trimType: BaseObjectTypes,
			uri: number
		): Promise<any> {
			return new Promise(function(resolve) {
				resolve(pageItemsWithTitle);
			});
		},
		saveToTrim(
			trimType: BaseObjectTypes,
			properties: any,
			fields: any = null
		): Promise<ITrimMainObject> {
			return new Promise(function(resolve) {
				savedProperties = properties;
				resolve({ Uri: 88 });
			});
		},
	};

	it("sets the formDefinition on load", async () => {
		const wrapper = shallow<EditTrimObject>(
			<EditTrimObject trimConnector={mockTrimConnector}></EditTrimObject>
		);

		await flushPromises();
		expect(wrapper.state().formDefinition).toEqual(pageItemsWithTitle);
	});

	it("saves the trim object", async () => {
		const wrapper = shallow<EditTrimObject>(
			<EditTrimObject
				recordUri={787}
				trimConnector={mockTrimConnector}
				appStore={{ setSpinning: function() {} }}
			></EditTrimObject>
		);

		const button = wrapper.find("form");
		button.simulate("submit");

		await flushPromises();
		expect(savedProperties).toEqual({ Uri: 787 });
	});

	it("fires on save", async () => {
		let saveCalled = false;
		const wrapper = shallow<EditTrimObject>(
			<EditTrimObject
				recordUri={787}
				trimConnector={mockTrimConnector}
				onSave={() => {
					saveCalled = true;
				}}
				appStore={{ setSpinning: function() {} }}
			></EditTrimObject>
		);

		const button = wrapper.find("form");
		button.simulate("submit");

		await flushPromises();

		expect(saveCalled).toBeTruthy();
	});
});
