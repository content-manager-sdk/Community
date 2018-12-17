//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { TrimObjectSearchList } from "./TrimObjectSearchList";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import { TrimConnector, ITrimMainObject } from "../../trim-coms/trim-connector";
import { List } from "office-ui-fabric-react/lib/List";

describe("Trim object search list", function() {
	beforeEach(() => {});

	let trimConnector = new TrimConnector();

	const doSearch = function<T extends ITrimMainObject>(
		trimType: BaseObjectTypes,
		q: string,
		purpose: number = 0
	): Promise<T[]> {
		return new Promise(function(resolve) {
			resolve([{ Uri: 1, NameString: "test" } as T]);
		});
	};

	trimConnector.search = doSearch.bind(trimConnector);

	const wrapper = shallow<TrimObjectSearchList>(
		<TrimObjectSearchList
			trimConnector={trimConnector}
			trimType={BaseObjectTypes.Record}
		/>
	);

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
});
