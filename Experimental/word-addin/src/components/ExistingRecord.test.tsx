//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ExistingRecord } from "./ExistingRecord";
import DetailsView from "./DetailsView";

describe("Existing Record", function() {
	const wrapper = shallow<ExistingRecord>(
		<ExistingRecord appStore={{ RecordUri: 0, Id: "my id" }} />
	);

	it("contains a property details element", function(this: any) {
		expect(wrapper.find(DetailsView).exists()).toBeTruthy();
	});
});
