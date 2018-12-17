import * as React from "react";
import { shallow } from "enzyme";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { TrimObjectPicker } from "./TrimObjectPicker/TrimObjectPicker";
import { PropertySheet } from "./PropertySheet";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

describe("Property Sheet", function() {
	it("displays nothing when form definition is null", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet formDefinition={null} />
		);

		expect(wrapper.children()).toHaveLength(0);
	});

	it("displays nothing when form definition is empty", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet formDefinition={{}} />
		);

		expect(wrapper.children()).toHaveLength(0);
	});

	it("displays nothing when form definition has no pages", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet formDefinition={{ Pages: [] }} />
		);

		expect(wrapper.children()).toHaveLength(0);
	});

	it("displays first page heading", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet formDefinition={{ Pages: [{ Caption: "General" }] }} />
		);

		expect(wrapper.find("h1").exists()).toBeTruthy();
		expect(wrapper.find("h1").text()).toEqual("General");
		expect(wrapper.find("h1").props().className).toEqual("ms-font-l");
	});

	it("displays a text field with label", () => {
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				defaultRecordTitle="test title"
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
								},
							],
						},
					],
				}}
			/>
		);

		//  expect(wrapper.find("label").exists()).toBeTruthy();
		//  expect(wrapper.find("label").text()).toEqual("Title (Free Text Part)");
		expect(wrapperWithForm.find(TextField).exists()).toBeTruthy();
		expect(wrapperWithForm.find(TextField).props().label).toEqual(
			"Title (Free Text Part)"
		);
		expect(wrapperWithForm.find(TextField).props().defaultValue).toEqual(
			"test title"
		);
		expect(wrapperWithForm.find(TextField).props().multiline).toBeFalsy();

		// when > 40 characters entered switch to multi-line
		wrapperWithForm
			.find(TextField)
			.props()
			.onChange(null, "01234567890123456789012345678901234567890");
		expect(wrapperWithForm.find(TextField).props().multiline).toBeTruthy();

		wrapperWithForm
			.find(TextField)
			.props()
			.onChange(null, "012345678");
		expect(wrapperWithForm.find(TextField).props().multiline).toBeFalsy();
	});

	it("fires the onChange event when a text field changes", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(ev, newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
								},
							],
						},
					],
				}}
			/>
		);

		wrapperWithForm
			.find(TextField)
			.props()
			.onChange(null, "abc");

		expect(onChangeForm).toEqual({ RecordTypedTitle: "abc" });
	});

	describe("Date properties", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							PageItems: [
								{
									Format: "Datetime",
									Name: "RecordDateCreated",
									Caption: "Date created",
									Value: {
										DateTime: "2018-12-14T15:37:06.0000000+11:00",
									},
								},
								{
									Format: "Datetime",
									Name: "RecordDateDue",
									Caption: "Date due",
									Value: {
										DateTime: "0001-01-01T00:00:00.0000000+11:00",
										IsClear: true,
									},
								},
							],
						},
					],
				}}
			/>
		);

		it("adds a date field to the property sheet", () => {
			expect.assertions(3);
			expect(
				wrapper
					.find(DatePicker)
					.at(0)
					.exists()
			).toBeTruthy();
			expect(
				wrapper
					.find(DatePicker)
					.at(0)
					.props().label
			).toEqual("Date created");

			expect(
				wrapper
					.find(DatePicker)
					.at(0)
					.props().value
			).toBeInstanceOf(Date);
		});

		it("does not set a value when IsClear == true", () => {
			expect.assertions(1);

			expect(
				wrapper
					.find(DatePicker)
					.at(1)
					.props().value
			).toBeFalsy();
		});
	});

	describe("Trim Object Properties", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							PageItems: [
								{
									Format: "Object",
									Name: "RecordContainer",
									Caption: "Container",
									Value: {
										Uri: 1,
									},
									ObjectType: "Record",
								},
							],
						},
					],
				}}
			/>
		);

		it("adds a TrimObjectPicker to the property sheet", () => {
			const objectPicker = wrapper.find(TrimObjectPicker).at(0);
			expect.assertions(3);
			expect(objectPicker.exists()).toBeTruthy();

			expect(objectPicker.props().label).toEqual("Container");
			expect(objectPicker.props().trimType).toEqual(BaseObjectTypes.Record);
		});
	});
});
