import * as React from "react";
import { shallow, mount } from "enzyme";
import { SearchBar } from "./SearchBar";
import { ComboBox, TextField } from "office-ui-fabric-react";

import {
	TrimConnector,
	ISearchClauseOrFieldDef,
} from "../../trim-coms/trim-connector";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { doesNotReject } from "assert";

describe("Search Bar", function() {
	beforeEach(() => {
		jest.useRealTimers();
		latestClause = "anyWord";
	});

	let testUri = 0;
	let testError = "";
	let latestClause = "";
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
						InternalName: "",
						Caption: "",
						ToolTip: "",
						MethodGroup: "",
						IsBlocked: false,
					},
				},
				{
					Caption: "All",
					ClauseName: "all",
					MethodGroup: "Text",
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

	it("do content search", (done) => {
		let testValue = "";
		const doChange = function(newValue) {
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
		setTimeout(() => {
			try {
				wrapper
					.find(ComboBox)
					.first()
					.props()
					.onChange(null, { key: "content", text: "" }, 1, null);

				jest.useFakeTimers();
				wrapper.instance().autocompleteSearchDebounced("test");

				jest.runOnlyPendingTimers();
				expect(testValue).toEqual("content:test");

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
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

	it("gets goto clause from TrimConnector", (done) => {
		const wrapper = shallow<SearchBar>(
			<SearchBar
				appStore={mockAppStore}
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				includeShortCuts={true}
			/>
		);

		setTimeout(() => {
			const combo = wrapper.find(ComboBox).first();

			expect(combo.props().options[0]).toEqual({ key: "goto", text: "Show" });

			expect.assertions(1);
			done();
		});
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

				expect(combo.props().options[2].key).toEqual("content");
				expect(combo.props().options[2].text).toEqual("Content");
				expect(combo.props().options[2].data.MethodGroup).toEqual("Text");

				expect.assertions(3);
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

	it("do 'all' search", (done) => {
		let testValue = "";
		const doChange = function(newValue) {
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
		setTimeout(() => {
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

			try {
				expect(testValue).toEqual("all");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("clears the search on content search", (done) => {
		let testValue = "xxx";
		const doChange = function(newValue) {
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
		setTimeout(() => {
			wrapper
				.find(ComboBox)
				.first()
				.props()
				.onChange(null, { key: "content", text: "" }, 1, null);

			try {
				expect(testValue).toEqual("");
				expect(wrapper.state().searchType).toEqual("content");

				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
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

	it("show text field when no shortcuts", (done) => {
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
				expect(wrapper.find(TextField).exists()).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("show correct clause when no shortcuts", (done) => {
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
				const combo = wrapper.find(ComboBox).last();

				expect(combo.props().selectedKey).toEqual("anyWord");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("show correct clause when no shortcuts and no latest clause", (done) => {
		latestClause = global.undefined;

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
				const combo = wrapper.find(ComboBox).last();

				expect(combo.props().selectedKey).toEqual("content");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
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
