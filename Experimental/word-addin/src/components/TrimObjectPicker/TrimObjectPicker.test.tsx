import * as React from "react";
import { mount, shallow } from "enzyme";
import { initializeIcons } from "@uifabric/icons";

import { TrimObjectPicker } from "./TrimObjectPicker";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { FocusTrapZone } from "office-ui-fabric-react/lib/FocusTrapZone";

import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import {
	TrimConnector,
	ITrimMainObject,
	ISearchResults,
	ISearchParamaters,
} from "../../trim-coms/trim-connector";
import { Provider } from "mobx-react";

initializeIcons();

describe("TrimObjectPicker", function() {
	let trimConnector = new TrimConnector();

	const doSearch = function<T extends ITrimMainObject>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		return new Promise(function(resolve) {
			resolve({
				results: [{ Uri: 1, NameString: "test" } as T],
				hasMoreItems: false,
			});
		});
	};

	trimConnector.search = doSearch.bind(trimConnector);

	const mountDatePicker = (props: any) => {
		const wrapper = mount(
			<Provider trimConnector={undefined}>
				<TrimObjectPicker {...props} trimType={BaseObjectTypes.Record} />
			</Provider>
		);
		return wrapper.find(TrimObjectPicker);
	};

	it("should not open ObjectPicker when disabled, no label", () => {
		const wrapper = mountDatePicker({ disabled: true });

		wrapper.find("i").simulate("click");

		expect(wrapper.state("isObjectPickerShown")).toBe(false);
	});

	it("should not open DatePicker when disabled, with label", () => {
		const wrapper = mountDatePicker({ disabled: true, label: "label" });

		wrapper.find("i").simulate("click");
		expect(wrapper.state("isObjectPickerShown")).toBe(false);
	});

	it("should open DatePicker ", () => {
		const wrapper = mountDatePicker({ label: "label" });

		wrapper.find("i").simulate("click");
		expect(wrapper.state("isObjectPickerShown")).toBe(true);
	});

	it("should close DatePicker ", () => {
		expect.assertions(1);
		const wrapper = mountDatePicker({ label: "label" });

		wrapper.find("i").simulate("click");
		wrapper.find("i").simulate("click");
		expect(wrapper.find(TrimObjectPicker).state("isObjectPickerShown")).toBe(
			false
		);
	});

	describe("props passed through", () => {
		const wrapper = shallow(
			<TrimObjectPicker
				disabled
				label="test"
				trimType={BaseObjectTypes.Record}
			/>
		);
		const textField = wrapper.find(TextField);

		it("renders disabled", () => {
			expect(textField.props().disabled).toBe(true);
		});

		it("renders label", () => {
			expect(textField.props().label).toBe("test");
		});
	});

	describe("show UI", () => {
		const wrapper = shallow(
			<TrimObjectPicker label="test" trimType={BaseObjectTypes.Record} />
		);
		wrapper.setState({ isObjectPickerShown: true });
		const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" });

		it("includes a Callout", () => {
			expect.assertions(1);
			expect(callout.length).toEqual(1);
		});

		it("includes a FocusTrapZone", () => {
			expect.assertions(2);
			expect(callout.find(FocusTrapZone).length).toEqual(1);
			expect(
				callout.find(FocusTrapZone).props().isClickableOutsideFocusTrap
			).toBe(true);
		});

		it("includes a trim object list", () => {
			expect.assertions(1);
			expect(callout.find(TrimObjectSearchList).length).toEqual(1);
		});
	});

	describe("show no UI", () => {
		const wrapper = shallow(
			<TrimObjectPicker
				label="test"
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
			/>
		);
		wrapper.setState({ isObjectPickerShown: false });

		it("includes a Callout", () => {
			expect.assertions(1);
			expect(wrapper.find({ id: "Trim-ObjectPicker-Callout" }).length).toEqual(
				0
			);
		});
	});

	describe("dismiss UI", () => {
		const wrapper = shallow(
			<TrimObjectPicker
				label="test"
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
			/>
		);
		wrapper.setState({ isObjectPickerShown: true });
		const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" }).at(0);
		callout.simulate("dismiss");

		it("no longer shows UI", () => {
			expect(wrapper.state("isObjectPickerShown")).toBe(false);
		});
	});
});
