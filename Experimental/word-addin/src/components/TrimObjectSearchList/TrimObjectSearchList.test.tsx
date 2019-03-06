(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { TrimObjectSearchList } from "./TrimObjectSearchList";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import {
	TrimConnector,
	ITrimMainObject,
	ISearchParamaters,
	ISearchResults,
	ISearchClauseDef,
	IClassification,
} from "../../trim-coms/trim-connector";
import { List } from "office-ui-fabric-react/lib/List";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import { Breadcrumb } from "office-ui-fabric-react/lib/Breadcrumb";

describe("Trim object search list", function() {
	let testPurpose = 0;
	let testPurposeExtra = 0;
	let testTrimType = BaseObjectTypes.Location;
	let testQ = "";
	let wrapper: any;
	let testStart = 0;
	let testObject: ITrimMainObject;
	let hasMore = true;
	let includeAlternateWhenShowingFolderContents = false;
	let testSortBy = "";

	beforeEach(() => {
		testPurpose = 0;
		testPurposeExtra = 0;
		testTrimType = BaseObjectTypes.Location;
		testQ = "";
		testStart = 0;
		testObject = { Uri: 0, NameString: "", PossiblyHasSubordinates: false };
		hasMore = true;

		wrapper = makeWrapper();
	});
	const makeWrapper = (query = `all`, advancedSearch = false): any => {
		return shallow<TrimObjectSearchList>(
			<TrimObjectSearchList
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				purpose={5}
				purposeExtra={789}
				q={query}
				onTrimObjectSelected={(trimObject) => {
					testObject = trimObject!;
				}}
				includeAlternateWhenShowingFolderContents={
					includeAlternateWhenShowingFolderContents
				}
				contentsInReverseDateOrder={true}
				advancedSearch={advancedSearch}
			/>
		);
	};

	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	const doSearch = function<T extends IClassification>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		testPurpose = options.purpose;
		testPurposeExtra = Number(options.purposeExtra);
		testTrimType = options.trimType;
		testQ = options.q;
		testStart = options.start!;
		testSortBy = options.sortBy!;

		return new Promise(function(resolve) {
			resolve({
				results: [
					{
						Uri: 1,
						NameString: "test",
						Name: { Value: "test" },
						Icon: { Id: "test", FileType: "" },
					} as T,
				],
				hasMoreItems: hasMore,
			});
		});
	};

	const doClauseDefs = function(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]> {
		return new Promise(function(resolve) {
			resolve([
				{
					InternalName: "unkFavorite",
					Caption: "",
					ToolTip: "fav",
					Id: "Favorite",
				},
				{
					InternalName: "recMyContainers",
					Caption: "My Containers",
					ToolTip: "My Containers tooltip",
					Id: "RecordMyContainers",
				},
			]);
		});
	};

	trimConnector.search = doSearch.bind(trimConnector);
	trimConnector.getSearchClauseDefinitions = doClauseDefs.bind(trimConnector);

	it("list element found", () => {
		expect(wrapper.find(List).exists()).toBeTruthy();
	});

	it("contains the starting list", () => {
		expect(
			wrapper
				.find(List)
				.at(0)
				.props().items!.length
		).toBe(1);
	});

	it("sends the correct parameters", () => {
		expect(testTrimType).toBe(BaseObjectTypes.Record);
		expect(testPurpose).toBe(5);
		expect(testPurposeExtra).toBe(789);
		expect(testQ).toBe("all");
		expect(testSortBy).toBeFalsy();
	});

	it("sends the correct search query from short cuts", () => {
		const shortCut = wrapper.find("div.trim-search-shortcuts li");

		expect(shortCut.at(0)).toBeTruthy();

		shortCut.at(0).simulate("click");

		expect(testQ).toBe("recMyContainers");
		expect(testSortBy).toBeFalsy();
	});

	it("clears the list when a new search run", () => {
		const shortCut = wrapper.find("li");

		shortCut.at(0).simulate("click");

		expect(
			wrapper
				.find(List)
				.at(0)
				.props().items!.length
		).toBe(1);
	});

	it("clears the ancestors when a new search run", () => {
		const shortCut = wrapper.find("li");
		wrapper.setState({ ancestors: [{ Uri: 3, NameString: "test" }] });

		shortCut.at(0).simulate("click");

		expect(wrapper.state("ancestors")).toEqual([]);
	});

	it("loads a second page on scroll down", async (done) => {
		const listContainer = wrapper.find("div.trim-list-container");

		listContainer
			.at(0)
			.simulate("scroll", { currentTarget: { scrollTop: 10 } });

		wrapper.instance()._onRenderCell({ Icon: {} }, 0);

		expect.assertions(2);
		expect(testStart).toBe(2);

		setImmediate(() => {
			expect(wrapper.instance().state.items!.length).toBe(2);
			done();
		});
	});

	it("does not load a third page when there is no more", async (done) => {
		hasMore = false;
		const listContainer = wrapper.find("div.trim-list-container");

		listContainer
			.at(0)
			.simulate("scroll", { currentTarget: { scrollTop: 10 } });

		wrapper.instance()._onRenderCell({ Icon: {} }, 0);
		wrapper.instance()._onRenderCell({ Icon: {} }, 1);

		expect.assertions(2);

		expect(testStart).toBe(2);

		setImmediate(() => {
			expect(wrapper.instance().state.items!.length).toBe(2);
			done();
		});
	});

	it("event fires when row clicked", () => {
		wrapper.find(List).simulate("click", {
			preventDefault: function() {},
			nativeEvent: {
				target: {
					parentElement: {
						getAttribute: function() {
							return "1";
						},
					},
				},
			},
		});

		expect.assertions(1);

		expect(testObject.Uri).toBe(1);
	});

	const getWrapper = function(
		spec = {
			trimType: BaseObjectTypes.Record,
			includeAlt: false,
			contentsInReverseDateOrder: false,
		}
	) {
		return shallow<TrimObjectSearchList>(
			<TrimObjectSearchList
				trimConnector={trimConnector}
				trimType={spec.trimType}
				purpose={5}
				purposeExtra={789}
				q="all"
				onTrimObjectSelected={(trimObject) => {
					testObject = trimObject!;
				}}
				includeAlternateWhenShowingFolderContents={spec.includeAlt}
				contentsInReverseDateOrder={spec.contentsInReverseDateOrder}
			/>
		);
	};

	const clickNavigateOnListItem = function(wrapper: ShallowWrapper) {
		wrapper.find(List).simulate("click", {
			preventDefault: function() {},
			nativeEvent: {
				target: {
					classList: {
						contains: () => {
							return true;
						},
					},
					parentElement: {
						getAttribute: function() {
							return "1";
						},
					},
				},
			},
		});
	};

	[
		{
			includeAlt: false,
			expected: "recContainer:1",
			trimType: BaseObjectTypes.Record,
		},
		{
			includeAlt: true,
			expected: "recContainerEx:1",
			trimType: BaseObjectTypes.Record,
		},
		{
			includeAlt: true,
			expected: "plnParent:1",
			trimType: BaseObjectTypes.Classification,
		},
		{
			includeAlt: true,
			expected: "locMembers:1",
			trimType: BaseObjectTypes.Location,
		},
		{
			includeAlt: false,
			expected: "recContainer:1",
			trimType: BaseObjectTypes.Record,
		},
	].forEach((s) => {
		it(`search event fires when navigate clicked ${
			s.includeAlt
		}`, async (done) => {
			const spec = { ...s, contentsInReverseDateOrder: false };
			const wrapper = getWrapper(spec);

			setTimeout(() => {
				clickNavigateOnListItem(wrapper);

				expect.assertions(1);

				expect(testQ).toBe(spec.expected);
				done();
			});
		});
	});

	it(`searches by registered date in reverse order`, async (done) => {
		const wrapper = getWrapper({
			includeAlt: false,
			trimType: BaseObjectTypes.Record,
			contentsInReverseDateOrder: true,
		});

		setTimeout(() => {
			clickNavigateOnListItem(wrapper);

			expect.assertions(1);

			expect(testSortBy).toBe("recRegisteredOn-");
			done();
		});
	});

	it(`sets the ancestor when a container expanded`, async (done) => {
		const wrapper = getWrapper();

		setTimeout(() => {
			clickNavigateOnListItem(wrapper);

			expect.assertions(3);

			expect(wrapper.state("ancestors")[0].Uri).toEqual(1);

			const breadcrumb = wrapper.find(Breadcrumb);

			expect(breadcrumb.length).toBe(1);
			expect(breadcrumb.props().items.length).toBe(1);
			done();
		});
	});

	it(`does a new search when breadcrumb clicked`, async (done) => {
		const wrapper = getWrapper();
		wrapper.setState({
			ancestors: [{ Uri: 2, NameString: "test" }],
			items: [{ Uri: 1, NameString: "test" }, { Uri: 2, NameString: "test 2" }],
		});

		setTimeout(() => {
			testQ = "";

			expect.assertions(1);

			const breadcrumb = wrapper.find(Breadcrumb);
			breadcrumb
				.props()
				.items[0].onClick({ preventDefault: function() {} }, { key: "2" });

			expect(testQ).toEqual("recContainer:2");
			done();
		});
	});

	it(`remove child from breadcrumb when parent clicked`, async (done) => {
		const wrapper = getWrapper();
		wrapper.setState({
			ancestors: [
				{ Uri: 1, NameString: "test" },
				{ Uri: 2, NameString: "test 2" },
			],
			items: [{ Uri: 1, NameString: "test" }, { Uri: 2, NameString: "test 2" }],
		});

		setTimeout(() => {
			expect.assertions(1);

			const breadcrumb = wrapper.find(Breadcrumb);
			breadcrumb
				.props()
				.items[0].onClick({ preventDefault: function() {} }, { key: "1" });

			expect(wrapper.state("ancestors")).toEqual([
				{ Uri: 1, NameString: "test" },
			]);
			done();
		});
	});

	it("Tool tip set", () => {
		const tt = wrapper.find(TooltipHost);

		expect.assertions(1);

		expect(
			tt
				.at(0)
				.props()
				.tooltipProps.onRenderContent()
		).toEqual(
			<div>
				<div className="ms-fontWeight-semibold">My Containers</div>
				<div>My Containers tooltip</div>
			</div>
		);
	});

	it(`uses the advanced search`, () => {
		const list = makeWrapper(`test`, true);

		const newProps = { ...list.props(), q: `test2` };

		setTimeout(() => {
			list.instance().componentDidUpdate(newProps);

			expect(testQ).toEqual(`recAnyWord: test`);
		});
	});
});
