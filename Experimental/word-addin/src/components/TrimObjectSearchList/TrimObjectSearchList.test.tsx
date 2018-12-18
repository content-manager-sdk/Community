//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { TrimObjectSearchList } from "./TrimObjectSearchList";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import {
	TrimConnector,
	ITrimMainObject,
	ISearchParamaters,
	ISearchResults,
} from "../../trim-coms/trim-connector";
import { List } from "office-ui-fabric-react/lib/List";

describe("Trim object search list", function() {
	let testPurpose = 0;
	let testTrimType = BaseObjectTypes.Location;
	let testQ = "";
	let wrapper: any;

	beforeEach(() => {
		testPurpose = 0;
		testTrimType = BaseObjectTypes.Location;
		testQ = "";

		wrapper = shallow<TrimObjectSearchList>(
			<TrimObjectSearchList
				trimConnector={trimConnector}
				trimType={BaseObjectTypes.Record}
				purpose={5}
				q="all"
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

		return new Promise(function(resolve) {
			resolve({
				results: [{ Uri: 1, NameString: "test" } as T],
				hasMoreItems: false,
			});
		});
	};

	trimConnector.search = doSearch.bind(trimConnector);

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
});
