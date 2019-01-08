(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { shallow } from "enzyme";
import { TrimObjectSearchList } from "./TrimObjectSearchList";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import {
	TrimConnector,
	ITrimMainObject,
	ISearchParamaters,
	ISearchResults,
	ISearchClauseDef,
} from "../../trim-coms/trim-connector";
import { List } from "office-ui-fabric-react/lib/List";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";

describe("Trim object search list", function() {
	let testPurpose = 0;
	let testTrimType = BaseObjectTypes.Location;
	let testQ = "";
	let wrapper: any;
	let testStart = 0;
	let testObject: ITrimMainObject;
	let hasMore = true;

	beforeEach(() => {
		testPurpose = 0;
		testTrimType = BaseObjectTypes.Location;
		testQ = "";
		testStart = 0;
		testObject = { Uri: 0, NameString: "" };
		hasMore = true;

		wrapper = shallow<TrimObjectSearchList>(
			<TrimObjectSearchList
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				purpose={5}
				q="all"
				onTrimObjectSelected={(trimObject) => {
					testObject = trimObject!;
				}}
			/>
		);
	});

	let trimConnector = new TrimConnector();

	const doSearch = function<T extends ITrimMainObject>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		testPurpose = options.purpose;
		testTrimType = options.trimType;
		testQ = options.q;
		testStart = options.start!;

		return new Promise(function(resolve) {
			resolve({
				results: [{ Uri: 1, NameString: "test" } as T],
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

	it("list element found", function(this: any) {
		expect(wrapper.find(List).exists()).toBeTruthy();
	});

	it("contains the starting list", function(this: any) {
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
		expect(testQ).toBe("all");
	});

	it("sends the correct search query from short cuts", () => {
		const shortCut = wrapper.find("li");

		expect(shortCut.at(0)).toBeTruthy();

		shortCut.at(0).simulate("click");

		expect(testQ).toBe("recMyContainers");
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

	it("loads a second page on scroll down", async (done) => {
		const listContainer = wrapper.find("div.trim-list-container");

		listContainer
			.at(0)
			.simulate("scroll", { currentTarget: { scrollTop: 10 } });

		wrapper.instance()._onRenderCell({}, 0);

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

		wrapper.instance()._onRenderCell({}, 0);
		wrapper.instance()._onRenderCell({}, 1);

		expect.assertions(2);
		expect(testStart).toBe(2);

		setImmediate(() => {
			expect(wrapper.instance().state.items!.length).toBe(2);
			done();
		});
	});

	it("event fires when row clicked", () => {
		wrapper.find(List).simulate("click", {
			currentTarget: {
				attributes: {
					getNamedItem: function() {
						return "1";
					},
				},
			},
		});

		expect.assertions(1);

		expect(testObject.Uri).toBe(1);
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
});
