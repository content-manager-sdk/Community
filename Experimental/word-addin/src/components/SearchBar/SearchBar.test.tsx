import * as React from "react";
import { shallow, mount } from "enzyme";
import { SearchBar } from "./SearchBar";
import {
	ComboBox,
	TextField,
	SelectableOptionMenuItemType,
} from "office-ui-fabric-react";

import {
	TrimConnector,
	ISearchClauseOrFieldDef,
} from "../../trim-coms/trim-connector";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import flushPromises = require("flush-promises");

describe("Search Bar", function () {
	beforeEach(() => {
		jest.useRealTimers();
		latestClause = "anyWord";
	});

	let testUri = 0;
	let testError = "";
	let latestClause = "";
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	const doClauseDefs = function (
		trimType: BaseObjectTypes
	): Promise<ISearchClauseOrFieldDef[]> {
		return new Promise(function (resolve) {
			resolve([
				{
					ClauseName: "content",
					Caption: "Content",
					MethodGroup: "Text",
					IsRecent: false,
					IsFavorite: false,
					ParameterFormat: "String",
					SearchParameterFormat: "String",
					ClauseDef: {
						Id: "",
						InternalName: "",
						Caption: "",
						ToolTip: "",
						MethodGroup: "",
						IsBlocked: false,
					},
				},
				{
					Caption: "Any Word",
					ClauseName: "anyWord",
					MethodGroup: "Text",
					IsRecent: false,
					IsFavorite: false,
					ParameterFormat: "String",
					SearchParameterFormat: "String",
					ClauseDef: {
						Id: "",
						InternalName: "anyWord",
						Caption: "",
						ToolTip: "",
						MethodGroup: "",
						IsBlocked: false,
					},
				},
				{
					Caption: "All",
					ClauseName: "all",
					MethodGroup: "Other",
					IsRecent: false,
					IsFavorite: true,
					ParameterFormat: "Boolean",
					SearchParameterFormat: "Boolean",
					ClauseDef: {
						Id: "",
						InternalName: "",
						Caption: "",
						ToolTip: "",
						MethodGroup: "",
						IsBlocked: false,
					},
				},

				{
					Caption: "Access Control",
					ClauseName: "acl",
					MethodGroup: "Security",
					IsRecent: false,
					IsFavorite: true,
					ParameterFormat: "Word",
					SearchParameterFormat: "ObjectAndEnum",
					ClauseDef: {
						Id: "Acl",
						InternalName: "unkAcl",
						Caption: "ACL",
						ToolTip: "",
						MethodGroup: "Security",
						IsBlocked: true,
					},
				},
			]);
		});
	};

	const getLatestClause = (trimType: BaseObjectTypes) => {
		return latestClause;
	};

	const setLatestClause = (trimType: BaseObjectTypes, clause: string) => {};

	trimConnector.getSearchClauseOrFieldDefinitions = doClauseDefs.bind(
		trimConnector
	);

	trimConnector.getEnum = function () {
		return Promise.resolve([
			{ Caption: "Name", Name: "Name" },
			{ Caption: "Type", Name: "Type" },
			{ Icon: "UtyWord", Caption: "Text Search", Value: 2, Name: "Text" },
			{
				Icon: "GoForward",
				Caption: "Linked Navigation",

				Name: "Linked",
			},
			{
				Icon: "RecInTray",
				Caption: "Trays and Labels",

				Name: "Tray",
			},
			{
				Icon: "Number",
				Caption: "Reference and Control Numbers",

				Name: "Reference",
			},
			{
				Icon: "LtPpleDoc",
				Caption: "Document Management",

				Name: "Document",
			},
			{ Icon: "RecDates", Caption: "Dates and Times", Value: 7, Name: "Date" },
			{
				Icon: "BobUserDefinedFields",
				Caption: "Additional Fields",

				Name: "Field",
			},
			{
				Icon: "SchSchedule",
				Caption: "Retention and Disposal",

				Name: "Retention",
			},
			{
				Icon: "LocList",
				Caption: "Contacts, People and Places",

				Name: "Location",
			},
			{
				Icon: "WrkWorkflow",
				Caption: "Business Process",

				Name: "Process",
			},
			{
				Icon: "YellowFile",
				Caption: "Records Management",

				Name: "Rm",
			},
			{
				Icon: "BobSecurityLevel",
				Caption: "Security and Audit",
				Name: "Security",
			},
			{
				Icon: "BeigeDoc",
				Caption: "SharePoint Integration",
				Name: "SharePoint",
			},
			{ Icon: "DbpSearchMethod", Caption: "Other", Value: 15, Name: "Other" },
			{ Icon: "NavFavorites", Caption: "Favorites", Name: "Favorite" },
			{
				Icon: "RecRecentDocsTray",
				Caption: "Recently Used Methods",

				Name: "Recent",
			},
			{ Icon: "ClientMatter", Caption: "Client/Matter", Name: "ClientMatter" },
		]);
	}.bind(trimConnector);

	trimConnector.getLatestClause = getLatestClause.bind(trimConnector);
	trimConnector.setLatestClause = setLatestClause.bind(trimConnector);
	const mockWordConnector = {
		insertText(textToInsert: string): void {
			//testText = textToInsert;
		},
	};

	const mockAppStore = {
		fetchBaseSettingFromTrim: null,
		resetError: null,
		messages: {
			web_Please_Select: "Please select a Record.",
			web_show: "Show",
		},
		status: "",
		setError: function (message: any) {
			testError = message;
		},
		openInCM: function (uri: number) {
			testUri = uri;
		},
		RecordUri: 7,
		documentInfo: { Enums: { RecordRelationshipType: [] } },
	};

	it("do content search", async () => {
		let testValue = "";
		const doChange = function (newValue) {
			testValue = newValue;
		};

		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
				onQueryChange={doChange}
			/>
		);

		await flushPromises();

		wrapper
			.find(ComboBox)
			.first()
			.props()
			.onChange(null, { key: "Textcontent", text: "" }, 1, null);

		jest.useFakeTimers();
		wrapper.instance().autocompleteSearchDebounced("test");

		jest.runOnlyPendingTimers();
		expect(testValue).toEqual("content:test");

		expect.assertions(1);
	});

	it("re-sets the search on selection of 'show'", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
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

	it("gets goto clause from TrimConnector", async () => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
		);

		await flushPromises();
		const combo = wrapper.find(ComboBox).first();
		expect(combo.props().options[0]).toEqual({ key: "goto", text: "Show" });
		expect.assertions(1);
	});
	it("gets first header from TrimConnector", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
		);

		setTimeout(() => {
			try {
				const combo = wrapper.find(ComboBox).first();

				expect(combo.props().options[2]).toEqual({
					itemType: 2,
					key: "Favorites",
					text: "Favorites",
				});

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("gets content from TrimConnector", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
		);

		setTimeout(() => {
			try {
				const combo = wrapper.find(ComboBox).first();

				expect(combo.props().options[2].key).toEqual("Favorites");
				expect(combo.props().options[2].text).toEqual("Favorites");
				expect(combo.props().options[2].itemType).toEqual(
					SelectableOptionMenuItemType.Header
				);
				expect(combo.props().options[3].data.MethodGroup).toEqual("Other");

				expect(combo.props().options[3].key).toEqual("Favoritesall");
				expect(combo.props().options[3].text).toEqual("All");

				expect.assertions(6);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("blocked methods not included", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
		);

		setTimeout(() => {
			try {
				const combo = wrapper.find(ComboBox).first();
				let found = false;
				combo.props().options.forEach((option) => {
					if (option.key === "acl") {
						found = true;
					}
				});

				expect(found).toBeFalsy();

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("do 'all' search", async () => {
		let testValue = "";
		const doChange = function (newValue) {
			testValue = newValue;
		};

		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
				onQueryChange={doChange}
			/>
		);
		await flushPromises();
		wrapper
			.find(ComboBox)
			.first()
			.props()
			.onChange(
				null,
				{
					key: "Otherall",
					text: "",
					data: { SearchParameterFormat: "Boolean" },
				},
				1,
				null
			);

		expect(testValue).toEqual("all");
	});

	it("clears the search on content search", async () => {
		let testValue = "xxx";
		const doChange = function (newValue) {
			testValue = newValue;
		};

		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
				onQueryChange={doChange}
			/>
		);

		await flushPromises();

		wrapper
			.find(ComboBox)
			.first()
			.props()
			.onChange(null, { key: "Textcontent", text: "" }, 1, null);

		expect(testValue).toEqual("");
		expect(wrapper.state().searchType).toEqual("Textcontent");

		expect.assertions(2);
	});

	[
		{ key: "container", expected: "recContainerEx:[recContainsEx:7]" },
		{ key: "contacts", expected: "recSameContact:7" },
		{ key: "related", expected: "recRelated:7" },
		{ key: "all_related", expected: "recAllRelated:7" },
		{ key: "search_content", expected: "" },
	].forEach((s) => {
		it(`selects new search context for ${s.key}`, () => {
			const wrapper = shallow<SearchBar>(
				<SearchBar
					appStore={mockAppStore}
					trimConnector={trimConnector}
					trimType={BaseObjectTypes.Record}
					includeShortCuts={true}
				/>
			);

			wrapper
				.find(ComboBox)
				.last()
				.props()
				.onChange(null, { key: s.key, text: "" }, 1, null);
			expect(wrapper.state().searchQuery).toEqual(s.expected);
			expect.assertions(1);
		});
	});

	it("show text field when no shortcuts", async () => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={false}
				startingSearch="anyWord"
			/>
		);

		await flushPromises();
		expect(wrapper.find(TextField).exists()).toBeTruthy();
	});

	it("show correct clause when no shortcuts", async () => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={false}
				startingSearch="anyWord"
			/>
		);

		await flushPromises();
		const combo = wrapper.find(ComboBox).last();

		expect(combo.props().selectedKey).toEqual("TextanyWord");
	});

	it("empty search text when no shortcuts", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={false}
			/>
		);

		setTimeout(() => {
			try {
				expect(wrapper.state().searchQuery).toEqual("");

				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
