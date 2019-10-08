import * as React from "react";
import { shallow, mount } from "enzyme";
import { ContextList } from "./ContextList";
import { IconButton, ComboBox } from "office-ui-fabric-react";

import {
	TrimConnector,
	ITrimMainObject,
	ISearchParamaters,
	ISearchResults,
	ISearchClauseDef,
	IObjectDef,
	ISearchClauseOrFieldDef,
} from "../../trim-coms/trim-connector";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { doesNotReject } from "assert";

describe("Context List", function() {
	let testUri = 0;
	let testError = "";
	let testText = "";
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	const doClauseDefs = function(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseOrFieldDef[]> {
		return new Promise(function(resolve) {
			resolve([
				{
					ClauseName: "content",
					Caption: "Content",
					MethodGroup: "Text",
					IsRecent: false,
					IsFavorite: false,
					ParameterFormat: "String",
					SearchParameterFormat: "String",
				},
				{
					Caption: "Any Word",
					ClauseName: "anyWord",
					MethodGroup: "Text",
					IsRecent: false,
					IsFavorite: false,
					ParameterFormat: "String",
					SearchParameterFormat: "String",
				},
				{
					Caption: "All",
					ClauseName: "all",
					MethodGroup: "Text",
					IsRecent: false,
					IsFavorite: true,
					ParameterFormat: "Boolean",
					SearchParameterFormat: "Boolean",
				},
			]);
		});
	};

	trimConnector.getSearchClauseOrFieldDefinitions = doClauseDefs.bind(
		trimConnector
	);

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
		openInCM: function(uri: number) {
			testUri = uri;
		},
		RecordUri: 7,
		documentInfo: { Enums: { RecordRelationshipType: [] } },
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
});
