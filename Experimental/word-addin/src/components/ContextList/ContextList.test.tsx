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
} from "../../trim-coms/trim-connector";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";

describe("Context List", function() {
	let testUri = 0;
	let testError = "";
	let testText = "";
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

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
	};

	it("has menu button", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} />
		);

		expect(wrapper.find(IconButton)).toBeTruthy();
	});

	it("calls search in trim connector", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} />
		);

		wrapper.setState({ selectRecord: { Uri: 3 } });

		const menuItem = wrapper.find(IconButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);

		expect(testUri).toEqual(3);
		expect.assertions(1);
	});

	it("Error when object not select", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} />
		);

		const menuItem = wrapper.find(IconButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);

		expect(testError).toEqual("Please select a Record.");
		expect.assertions(1);
	});

	it("calls paste title", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} wordConnector={mockWordConnector} />
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
				<ContextList appStore={mockAppStore} />
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
			<ContextList appStore={mockAppStore} />
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

	it("do content search", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} />
		);

		wrapper
			.find(ComboBox)
			.first()
			.props()
			.onChange(null, { key: "content", text: "" }, 1, null);

		wrapper.setState({ searchQuery: "test" });

		const list = wrapper.find(TrimObjectSearchList);

		expect(list.props().q).toEqual("recContent:test");

		expect.assertions(1);
	});

	it("re-sets the search on selection of 'show'", () => {
		const wrapper = shallow<ContextList>(
			<ContextList appStore={mockAppStore} />
		);

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
	});
});
