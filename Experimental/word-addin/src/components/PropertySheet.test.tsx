import * as React from "react";
import { shallow, mount, ReactWrapper } from "enzyme";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import TrimObjectPicker from "./TrimObjectPicker/TrimObjectPicker";
import {
	PropertySheet,
	IPropertySheetState,
	IPropertySheetProps,
} from "./PropertySheet";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import { Provider } from "mobx-react";
import { PivotItem, Pivot } from "office-ui-fabric-react/lib/Pivot";
import { CommandButton } from "office-ui-fabric-react/lib/Button";
import {
	ISearchOptions,
	IDatabase,
	IEnumDetails,
} from "../trim-coms/trim-connector";
import { ReactNode } from "react";
import { SpinButton } from "office-ui-fabric-react/lib/SpinButton";
import TrimNumberField from "./TrimNumberField/TrimNumberField";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import { ComboBox } from "office-ui-fabric-react";

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

	it("creates pages", () => {
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				defaultRecordTitle="test title"
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
								},
							],
						},
						{
							Type: "Normal",
							Caption: "Extra",

							PageItems: [{}],
						},
					],
				}}
			/>
		);

		expect(wrapperWithForm.find(PivotItem).length).toEqual(2);
	});

	it("does not create special pages", () => {
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				defaultRecordTitle="test title"
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
								},
							],
						},
						{
							Type: "Notes",
							Caption: "Notes",
							CaptionsAbove: false,
							HighlightMandatory: false,
							Mandatory: false,
							NotesStyle: 2,
							PageItems: [],
							ChildType: "Unknown",
						},
					],
				}}
			/>
		);

		expect(wrapperWithForm.find(PivotItem).length).toEqual(1);
	});

	it("displays a text field with label", () => {
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				defaultRecordTitle="test title"
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
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

	it("fires the onChange event when a text field loads with a value", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
									Value: "abc",
								},
							],
						},
					],
				}}
			/>
		);

		expect(onChangeForm).toEqual({ RecordTypedTitle: "abc" });
	});

	it("fires the onChange event when a text field changes", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
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

	it("fires the onChange event when a checkbox loads with a value", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "Boolean",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
									Value: true,
								},
							],
						},
					],
				}}
			/>
		);

		expect(onChangeForm).toEqual({ RecordTypedTitle: true });
	});

	it("fires the onChange event when checkbox field changes", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "Boolean",
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
			.find(Checkbox)
			.props()
			.onChange(null, true);

		expect(onChangeForm).toEqual({ RecordTypedTitle: true });
	});

	let enumOnChangeForm;
	const getEnumWrapper = () => {
		return shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					enumOnChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "Enum",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
									Value: "Electronic",
									EnumName: "MediaTypes",
									EnumItems: [
										{
											Caption: "Unknown",
											Name: "Unknown",
										},
										{
											Caption: "Paper",
											Name: "Paper",
										},
										{
											Caption: "Electronic Document",
											Name: "Electronic",
										},
									],
								},
							],
						},
					],
				}}
			/>
		);
	};

	it("fires the onChange event when an enum loads with a value", () => {
		enumOnChangeForm = {};

		const wrapperWithForm = getEnumWrapper();

		expect(enumOnChangeForm).toEqual({ RecordTypedTitle: "Electronic" });
	});

	it("fires the onChange event when an enum field changes", () => {
		enumOnChangeForm = {};
		const wrapperWithForm = getEnumWrapper();

		wrapperWithForm
			.find(ComboBox)
			.props()
			.onChange(null, { key: "Paper", text: "Paper Caption" });

		expect(enumOnChangeForm).toEqual({ RecordTypedTitle: "Paper" });
	});

	[
		{
			format: "Number",
		},
		{
			format: "BigNumber",
		},
		{
			format: "Currency",
		},
		{
			format: "Decimal",
		},
	].forEach((item) => {
		it(`fires the onChange event when a ${item.format} field loads with a value`, () => {
			let onChangeFields;
			const wrapperWithForm = shallow<PropertySheet>(
				<PropertySheet
					onChange={function(newForm, newFields) {
						onChangeFields = newFields;
					}}
					formDefinition={{
						Pages: [
							{
								Caption: "General",
								Type: "Normal",
								PageItems: [
									{
										Format: item.format,
										Name: "Speed",
										Caption: "Title (Free Text Part)",
										Value: 345,
										Type: "Field",
									},
								],
							},
						],
					}}
				/>
			);

			expect(onChangeFields).toEqual({ Speed: 345 });
		});

		it(`fires the onChange event when a ${item.format} field changes`, () => {
			let onChangeForm;
			const wrapperWithForm = shallow<PropertySheet>(
				<PropertySheet
					onChange={function(newForm) {
						onChangeForm = newForm;
					}}
					formDefinition={{
						Pages: [
							{
								Caption: "General",
								Type: "Normal",
								PageItems: [
									{
										Format: item.format,
										Name: "Speed",
										Caption: "Title (Free Text Part)",
									},
								],
							},
						],
					}}
				/>
			);

			wrapperWithForm
				.find(TrimNumberField)
				.props()
				.onChange(89);

			expect(onChangeForm).toEqual({ Speed: 89 });
		});
	});
	it("fires the onChange event when a date picker changes", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "Datetime",
									Name: "RecordDateCreated",
									Caption: "a date",
									Value: {
										DateTime: "2018-12-14T15:37:06.0000000+11:00",
									},
								},
							],
						},
					],
				}}
			/>
		);

		expect(onChangeForm).toEqual({
			RecordDateCreated: new Date(
				"2018-12-14T15:37:06.0000000+11:00"
			).toISOString(),
		});

		const testDate = new Date();
		wrapperWithForm
			.find(DatePicker)
			.props()
			.onSelectDate(testDate);

		expect(onChangeForm).toEqual({ RecordDateCreated: testDate.toISOString() });
	});

	describe("Date properties", () => {
		const wrapper = shallow<PropertySheet>(
			<PropertySheet
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
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
		let onChangeForm;
		const wrapper = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "Object",
									Name: "RecordContainer",
									Caption: "Container",
									ObjectType: "Record",
									EditPurpose: 1,
									EditPurposeExtra: 9000000500,
									Value: {
										TrimType: "LookupItem",
										NameString: "High",

										Uri: 1,
									},
								},
							],
						},
					],
				}}
			/>
		);

		it("adds a TrimObjectPicker to the property sheet", () => {
			const objectPicker = wrapper.find(TrimObjectPicker).at(0);
			expect.assertions(6);
			expect(objectPicker.exists()).toBeTruthy();

			expect(objectPicker.props().label).toEqual("Container");
			expect(objectPicker.props().trimType).toEqual(BaseObjectTypes.Record);
			expect(objectPicker.props().propertyName).toEqual("RecordContainer");
			expect(objectPicker.props().purpose).toEqual(1);
			expect(objectPicker.props().purposeExtra).toEqual(9000000500);
		});

		it("fires the onChange event when an object picker loads", () => {
			expect(onChangeForm).toEqual({ RecordContainer: 1 });
		});

		it("fires the onChange event when an object picker changes", () => {
			const testObject = { Uri: 2, NameString: "test" };

			wrapper
				.find(TrimObjectPicker)
				.props()
				.onTrimObjectSelected(testObject);

			expect(onChangeForm).toEqual({ RecordContainer: testObject.Uri });
		});
	});

	describe("LookupSet", () => {
		let onChangeForm;
		const wrapper = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "String",
									Name: "Something_Field",
									Caption: "Something",
									LookupSetUri: 9000000004,
									ObjectType: "Unknpown",
								},
							],
						},
					],
				}}
			/>
		);

		it("adds a TrimObjectPicker to the property sheet", () => {
			const objectPicker = wrapper.find(TrimObjectPicker).at(0);
			expect.assertions(4);
			expect(objectPicker.exists()).toBeTruthy();

			expect(objectPicker.props().label).toEqual("Something");
			expect(objectPicker.props().trimType).toEqual(BaseObjectTypes.LookupItem);
			expect(objectPicker.props().filter).toEqual("lkiSet:9000000004");
		});

		it("fires the onChange event when an object picker changes", () => {
			const testObject = { Uri: 2, NameString: "test" };

			wrapper
				.find(TrimObjectPicker)
				.props()
				.onTrimObjectSelected(testObject);

			expect(onChangeForm).toEqual({ Something_Field: "test" });
		});
	});

	it("fires the onChange event when a text field changes", () => {
		let onChangeForm;
		const wrapperWithForm = shallow<PropertySheet>(
			<PropertySheet
				onChange={function(newForm) {
					onChangeForm = newForm;
				}}
				formDefinition={{
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
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
});

describe("Property Sheet - retain values when switching in Pivot", function() {
	const makeWrapper = (format: string, lookupSetUri: number) => {
		return mount<PropertySheet>(
			<Provider
				trimConnector={{
					getSearchOptions(): Promise<ISearchOptions> {
						return new Promise(function(resolve, reject) {});
					},
					getDatabaseProperties(): Promise<IDatabase> {
						return new Promise(function(resolve, reject) {});
					},
					getEnum(enumId: string): Promise<IEnumDetails[]> {
						return new Promise(function(resolve, reject) {
							resolve([
								{
									Caption: "Unknown",
									Name: "Unknown",
								},
								{
									Caption: "Paper",
									Name: "Paper",
								},
								{
									Caption: "Electronic Document",

									Name: "Electronic",
								},
							]);
						});
					},
				}}
			>
				<PropertySheet
					defaultRecordTitle="test title"
					formDefinition={{
						Pages: [
							{
								Caption: "General",
								Type: "Normal",
								PageItems: [
									{
										Format: format,
										Name: "RecordTypedTitle",
										Caption: "Title (Free Text Part)",
										LookupSetUri: lookupSetUri,
									},
								],
							},
							{
								Type: "Normal",
								Caption: "Extra",

								PageItems: [{}],
							},
						],
					}}
				/>
			</Provider>
		);
	};

	const doPivot = (
		wrapper: ReactWrapper<
			Readonly<IPropertySheetProps> & Readonly<{ children?: ReactNode }>,
			Readonly<IPropertySheetState>,
			PropertySheet
		>
	) => {
		wrapper
			.find(Pivot)
			.find(CommandButton)
			.last()
			.simulate("click");
		wrapper
			.find(Pivot)
			.find(CommandButton)
			.first()
			.simulate("click");
	};

	[
		{
			format: "Object",
			selectObject: (wrapper: any) => {
				wrapper
					.find(TrimObjectPicker)
					.props()
					.onTrimObjectSelected({ Uri: 7878 });
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(TrimObjectPicker).props().value).toEqual([
					{
						Uri: 7878,
					},
				]);
			},
		},
		{
			format: "String",
			selectObject: (wrapper: any) => {
				wrapper
					.find(TextField)
					.props()
					.onChange(null, "aaa");
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(".ms-TextField-field").props().value).toEqual(
					"aaa"
				);
			},
		},
		{
			lookupSetUri: 1,
			format: "String",
			selectObject: (wrapper: any) => {
				wrapper
					.find(TrimObjectPicker)
					.props()
					.onTrimObjectSelected({ Uri: 0, NameString: "item1" });
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(TrimObjectPicker).props().value).toEqual([
					{ Uri: 0, NameString: "item1" },
				]);
			},
		},
		{
			format: "Number",
			selectObject: (wrapper: any) => {
				wrapper
					.find(TrimNumberField)
					.props()
					.onChange(34);
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(".ms-spinButton-input").props().value).toEqual(34);
			},
		},
		{
			format: "Currency",
			selectObject: (wrapper: any) => {
				wrapper
					.find(TrimNumberField)
					.props()
					.onChange(34);
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(".ms-spinButton-input").props().value).toEqual(34);
			},
		},
		{
			format: "Boolean",
			selectObject: (wrapper: any) => {
				wrapper
					.find(Checkbox)
					.props()
					.onChange(null, true);
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(Checkbox).props().defaultChecked).toEqual(true);
			},
		},
		{
			format: "Datetime",
			selectObject: (wrapper: any) => {
				wrapper
					.find(DatePicker)
					.props()
					.onSelectDate(new Date(2010, 1, 1));
			},
			expect: (wrapper: any) => {
				expect(wrapper.find(DatePicker).props().value).toEqual(
					new Date(2010, 1, 1)
				);
			},
		},
	].forEach((item) => {
		it(`${item.format} Field`, (done) => {
			const wrapper = makeWrapper(item.format, item.lookupSetUri || 0);

			setTimeout(() => {
				try {
					item.selectObject(wrapper);

					doPivot(wrapper);
					item.expect(wrapper);
					done();
				} catch (e) {
					done.fail(e);
				}
			});
		});
	});
});
