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

	[
		{ key: "container", expected: "recContainerEx:[recContainsEx:7]" },
		{ key: "contacts", expected: "recSameContact:7" },
		{ key: "related", expected: "recRelated:7" },
		{ key: "all_related", expected: "recAllRelated:7" },
		{ key: "search_content", expected: "" },
	].forEach((s) => {
		it(`selects new search context for ${s.key}`, () => {
			const wrapper = shallow<ContextList>(
				<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
			);

			wrapper
				.find(ComboBox)
				.last()
				.props()
				.onChange(null, { key: s.key, text: "" }, 1, null);

			const searchList = wrapper.find(TrimObjectSearchList);

			expect(searchList.props().q).toEqual(s.expected);
			expect.assertions(1);
		});
	});

	it("clears the search on content search", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		wrapper
			.find(ComboBox)
			.first()
			.props()
			.onChange(null, { key: "content", text: "" }, 1, null);

		expect(wrapper.state().searchQuery).toEqual("");
		expect(wrapper.state().searchType).toEqual("content");

		const list = wrapper.find(TrimObjectSearchList);

		expect(list.props().q).toEqual("");

		expect.assertions(3);
	});

	it("do content search", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			wrapper
				.find(ComboBox)
				.first()
				.props()
				.onChange(null, { key: "content", text: "" }, 1, null);

			wrapper.setState({ searchQuery: "test" });

			const list = wrapper.find(TrimObjectSearchList);

			expect(list.props().q).toEqual("Content:test");

			expect.assertions(1);
			done();
		});
	});

	it("re-sets the search on selection of 'show'", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			try {
				wrapper
					.find(ComboBox)
					.first()
					.props()
					.onChange(null, { key: "content", text: "" }, 1, null);

				wrapper
					.find(ComboBox)
					.first()
					.props()
					.onChange(null, { key: "goto", text: "" }, 1, null);

				expect(wrapper.state().searchQuery).toEqual(
					"recContainerEx:[recContainsEx:7]"
				);

				expect(wrapper.state().searchType).toEqual("goto");
				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("gets goto clause from TrimConnector", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			const combo = wrapper.find(ComboBox).first();

			expect(combo.props().options[0]).toEqual({ key: "goto", text: "Show" });

			expect.assertions(1);
			done();
		});
	});

	it("gets first header from TrimConnector", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			try {
				const combo = wrapper.find(ComboBox).first();

				expect(combo.props().options[1]).toEqual({
					itemType: 2,
					key: "Text",
					text: "Text",
				});

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("gets content from TrimConnector", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			try {
				const combo = wrapper.find(ComboBox).first();

				expect(combo.props().options[2]).toEqual({
					key: "content",
					text: "Content",
					data: {
						Caption: "Content",
						ClauseName: "content",
						IsFavorite: false,
						IsRecent: false,
						MethodGroup: "Text",
						ParameterFormat: "String",
						SearchParameterFormat: "String",
					},
				});

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
	it("do 'all' search", (done) => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} trimConnector={trimConnector} />
		);

		setTimeout(() => {
			try {
				wrapper
					.find(ComboBox)
					.first()
					.props()
					.onChange(
						null,
						{
							key: "all",
							text: "",
							data: { SearchParameterFormat: "Boolean" },
						},
						1,
						null
					);

				const list = wrapper.find(TrimObjectSearchList);

				expect(list.props().q).toEqual("All");

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
