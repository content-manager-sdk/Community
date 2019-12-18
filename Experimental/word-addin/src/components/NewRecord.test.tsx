(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { mount, shallow } from "enzyme";
import { NewRecord } from "./NewRecord";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { TrimConnector } from "../trim-coms/trim-connector";
import { IRecordType, ITrimMainObject } from "../trim-coms/trim-connector";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "../office-coms/office-connector";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

describe("New Record layout", function() {
	let resolveRecordTypes;
	let testRecordUrn = "";
	let testSubjectPrefix = "";
	let propertySheetTrimType = BaseObjectTypes.Location;
	let wrapper;
	let registerProps = [];
	//let registerPropsForPlace = undefined;
	let registerType = undefined;
	let errorMessage: string = undefined;
	let populatePages = false;

	const pageItemsWithTitle = {
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
	};

	const makeWrapper = (
		trimType: BaseObjectTypes,
		onCreated?: any,
		folderId?: string,
		folderName?: string
	) => {
		const innerWrapper = shallow<NewRecord>(
			<NewRecord
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={trimType}
				onTrimObjectCreated={onCreated}
				folderId={folderId}
				computedCheckinStyleName={folderName}
			/>
		);
		innerWrapper.setState({ formDefinition: { Pages: [] } });

		return innerWrapper;
	};

	beforeEach(() => {
		wrapper = makeWrapper(BaseObjectTypes.Record);
	});

	afterEach(() => {
		testRecordUrn = "";
		testSubjectPrefix = "";
		propertySheetTrimType = BaseObjectTypes.Location;
		registerProps = [];
		registerType = undefined;
		errorMessage = undefined;
		populatePages = false;
	});

	let mockTrimConnector = new TrimConnector();

	mockTrimConnector.registerInTrim = (
		trimType: BaseObjectTypes,
		properties: any,
		fields: any
	) => {
		registerProps.push(properties);

		registerType = trimType;

		return new Promise<ITrimMainObject>(function(resolve) {
			resolve({ Uri: 456 });
		});
	};

	mockTrimConnector.search = () => {
		return new Promise(function(resolve) {
			resolveRecordTypes = resolve;
		});
	};

	mockTrimConnector.getPropertySheet = (trimType: BaseObjectTypes) => {
		propertySheetTrimType = trimType;
		return new Promise(function(resolve) {
			resolve(
				populatePages ? pageItemsWithTitle : { Pages: [{ PageItems: [] }] }
			);
		});
	};

	mockTrimConnector.getDatabaseProperties = () => {
		return new Promise(function(resolve) {
			resolve({
				EmailSubjectPrefix: "CM:",
				CurrencySymbol: "",
			});
		});
	};

	const mockStore = {
		RecordUri: 0,
		RecordProps: {},
		messages: {
			web_Register: "Register",
			web_SelectRecordType: "Select a Record Type",
			web_RecordTypeRequiresForm: "NeedsDataEntryForm",
		},
		documentInfo: { Options: {}, URN: "test_urn" },
		createRecord: (recordUri, recordProps) => {
			mockStore.RecordUri = recordUri;
			mockStore.RecordProps = recordProps;

			return new Promise(function(resolve) {
				resolve();
			});
		},
		FileName: "default title",
		setError: (message: string) => {
			errorMessage = message;
		},
	};

	class MockWordConnector implements IOfficeConnector {
		insertLink(textToInsert: string, url: string): void {
			throw new Error("Method not implemented.");
		}
		saveDocument(): Promise<void> {
			throw new Error("Method not implemented.");
		}
		getDocumentData(writeSlice: any): Promise<string> {
			throw new Error("Method not implemented.");
		}
		setAutoOpen(
			autoOpen: boolean,
			recordUrn: string,
			subjectPrefix: string
		): void {
			testRecordUrn = recordUrn;
			testSubjectPrefix = subjectPrefix;
		}
		getAutoOpen(): boolean {
			throw new Error("Method not implemented.");
		}
		insertText(textToInsert: string): void {
			throw new Error("Method not implemented.");
		}
		getAccessToken(): Promise<string> {
			throw new Error("Method not implemented.");
		}
		setUri(
			uri: number
		): Promise<import("../office-coms/word-connector").IGetRecordUriResponse> {
			throw new Error("Method not implemented.");
		}
		getWebUrl(): Promise<string> {
			throw new Error("Method not implemented.");
		}
		getUri(): Promise<
			import("../office-coms/word-connector").IGetRecordUriResponse
		> {
			throw new Error("Method not implemented.");
		}
	}

	it("contains a Record Type dropdown", async (done) => {
		resolveRecordTypes({
			results: [{ Uri: 1, NameString: "Document" } as IRecordType],
		});

		expect(wrapper.find(Dropdown).exists()).toBeTruthy();
		expect(wrapper.find(Dropdown).props().placeholder).toEqual(
			"Select a Record Type"
		);
		setImmediate(() => {
			expect(
				wrapper
					.update()
					.find(Dropdown)
					.props().options
			).toEqual([{ key: 1, text: "Document" }]);
			done();
		});
	});

	it("contains a button", () => {
		expect(wrapper.find(PrimaryButton).exists()).toBeTruthy();
		expect(
			wrapper
				.find(PrimaryButton)
				.childAt(0)
				.text()
		).toMatch("Register");
	});

	it("Sets the Record Type Uri from on load and onChange", () => {
		const instance = wrapper.instance();
		instance.setRecordTypes([]);

		expect(instance.recordTypeUri).toEqual(0);

		// should be zero after the record types list has been changed
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		instance.setRecordTypes([{ key: 1, text: "Document" }]);

		expect(instance.recordTypeUri).toEqual(0);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 0);

		expect(instance.recordTypeUri).toEqual(1);
	});

	it("persists selected Record Type", () => {
		const instance = wrapper.instance();
		instance.setRecordTypes([]);

		expect(instance.recordTypeUri).toEqual(0);

		// should be zero after the record types list has been changed
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		expect(
			wrapper
				.update()
				.find(Dropdown)
				.props().defaultSelectedKey
		).toEqual(5);
	});

	it("calls create record on button press", () => {
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 0);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		expect(mockStore.RecordUri).toEqual(1);
	});

	it("calls register in TRIM for non Record object", () => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		setTimeout(() => {
			wrapper
				.update()
				.find(PrimaryButton)
				.props()
				.onClick(null);

			expect(registerType).toEqual(BaseObjectTypes.CheckinStyle);
			expect(registerProps[0]).toEqual({ CheckinStyleRecordType: 5 });
		});
	});

	it("create a checkin place for a Check in Style", (done) => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle, () => {}, "123");
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(registerProps[1]).toEqual({
					CheckinPlacePlaceId: "123",
					CheckinPlaceCheckinAs: 456,
					CheckinPlacePlaceType: "MailForServerProcessing",
				});
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls on created event", (done) => {
		let eventCalled = false;

		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle, () => {
			eventCalled = true;
		});
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(eventCalled).toBeTruthy();
			} catch (e) {
				done.fail(e);
			}
			done();
		});
	});

	[
		{ folderId: "123", createPlace: false },
		{ folderId: undefined, createPlace: true },
	].forEach((testData) => {
		it("sends computed fields to Checkin Style", () => {
			const wrapper = makeWrapper(
				BaseObjectTypes.CheckinStyle,
				null,
				testData.folderId
			);
			const instance = wrapper.instance();
			instance.setRecordTypes([
				{ key: 1, text: "Document" },
				{ key: 5, text: "Document 5" },
			]);

			wrapper
				.update()
				.find(Dropdown)
				.props()
				.onChange(null, null, 0);

			const propertySheet = wrapper.find(PropertySheet);
			expect(propertySheet.props().computedProperties).toEqual([
				{
					Name: "CheckinStyleUseForServerMailCapture",
					Value: testData.createPlace,
					Type: "Property",
				},
				{
					Name: "CheckinStyleUseForServerMailFolderType",
					Value: "NormalFolder",
					Type: "Property",
				},
				{ Name: "CheckinStyleRecordType", Value: undefined, Type: "Property" },
			]);
		});
	});

	it("sends updated properties button press", () => {
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		// wrapper
		//   .update()
		//   .find(Dropdown)
		//   .props()
		//   .onChange(null, null, 0);

		wrapper
			.update()
			.find(PropertySheet)
			.props()
			.onChange({ RecordTypedTitle: "test title" });

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		expect(mockStore.RecordProps).toEqual({ RecordTypedTitle: "test title" });
	});

	it("sends record URN to auto open", (done) => {
		const instance = wrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(testRecordUrn).toEqual("test_urn");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("sends the email prefix", (done) => {
		const instance = wrapper.instance();

		instance.setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(testSubjectPrefix).toEqual("CM:");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("displays a property sheet when Record Type is set", (done) => {
		const shallowWrapper = shallow<NewRecord>(
			<NewRecord
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={BaseObjectTypes.Record}
			/>
		);

		const instance = shallowWrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "test" },
			{ key: 2, text: "test" },
		]);
		// no property sheet before recordtype uri sey
		expect(shallowWrapper.find(PropertySheet).exists()).toBeTruthy();

		shallowWrapper
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		setImmediate(() => {
			try {
				// 	//expect(wrapper.find(PropertySheet).exists()).toBeTruthy();
				expect(shallowWrapper.state().formDefinition).toEqual({
					Pages: [{ PageItems: [] }],
				});
				expect(
					shallowWrapper.find(PropertySheet).props().formDefinition
				).toEqual({ Pages: [{ PageItems: [] }] });
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
	it("sends the correct trimType to getPropertysheet", (done) => {
		const shallowWrapper = shallow<NewRecord>(
			<NewRecord
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={BaseObjectTypes.CheckinStyle}
			/>
		);

		const instance = shallowWrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "test" },
			{ key: 2, text: "test" },
		]);

		shallowWrapper
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		setImmediate(() => {
			try {
				expect(propertySheetTrimType).toEqual(BaseObjectTypes.CheckinStyle);

				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("displays a property sheet with default record title", (done) => {
		populatePages = true;

		const shallowWrapper = shallow<NewRecord>(
			<NewRecord
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={BaseObjectTypes.Record}
			/>
		);

		const instance = shallowWrapper.instance();
		instance.setRecordTypes([
			{ key: 1, text: "test" },
			{ key: 2, text: "test" },
		]);

		shallowWrapper
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		setImmediate(() => {
			try {
				// 	//expect(wrapper.find(PropertySheet).exists()).toBeTruthy();

				expect(
					shallowWrapper.find(PropertySheet).props().formDefinition
				).toEqual({
					Pages: [
						{
							Caption: "General",
							Type: "Normal",
							PageItems: [
								{
									Format: "String",
									Name: "RecordTypedTitle",
									Caption: "Title (Free Text Part)",
									Value: "default title",
								},
							],
						},
					],
				});
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("disables form when no folder Id set", () => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		expect(wrapper.find(Dropdown).props().disabled).toBeTruthy();
	});

	it("enables form when  folder Id set", () => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper.setProps({ folderId: "fff" });
		expect(wrapper.find(Dropdown).props().disabled).toBeFalsy();
	});

	[
		{ valid: true, message: undefined },
		{ valid: false, message: "NeedsDataEntryForm" },
	].forEach((testData) => {
		it(`Sets an error if the Record Type requires a data entry form - ${testData.valid} `, (done) => {
			const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

			wrapper.setProps({
				validateRecordType: () => {
					return new Promise<Boolean>(function(resolve) {
						resolve(testData.valid);
					});
				},
			});

			// should be zero after the record types list has been changed
			wrapper.instance().setRecordTypes([
				{ key: 1, text: "Document" },
				{ key: 5, text: "Document 5" },
			]);
			wrapper
				.update()
				.find(Dropdown)
				.props()
				.onChange(null, null, 1);
			setTimeout(() => {
				try {
					expect(errorMessage).toEqual(testData.message);
					done();
				} catch (e) {
					done.fail(e);
				}
			});
		});
	});

	it(`persists the selected Record Type when Record is is validated`, (done) => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper.setProps({
			validateRecordType: () => {
				return new Promise<Boolean>(function(resolve) {
					resolve(true);
				});
			},
		});

		// should be zero after the record types list has been changed
		wrapper.instance().setRecordTypes([
			{ key: 1, text: "Document" },
			{ key: 5, text: "Document 5" },
		]);

		wrapper
			.update()
			.find(Dropdown)
			.props()
			.onChange(null, null, 1);

		setTimeout(() => {
			try {
				expect(
					wrapper
						.update()
						.find(Dropdown)
						.props().defaultSelectedKey
				).toEqual(5);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it(`sends computed props for Check in Style`, () => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			"cm_auto",
			"auto connect"
		);

		const propSheet = wrapper.find(PropertySheet);

		expect(propSheet.props().computedProperties).toEqual(
			expect.arrayContaining([
				{
					Name: "CheckinStyleUseForServerMailCapture",
					Value: false,
					Type: "Property",
				},
				{
					Name: "CheckinStyleUseForServerMailFolderType",
					Value: "NormalFolder",
					Type: "Property",
				},
				{ Name: "CheckinStyleRecordType", Value: undefined, Type: "Property" },
			])
		);

		expect(propSheet.props().computedProperties).not.toEqual(
			expect.arrayContaining([
				{
					Name: "CheckinStyleName",
					Value: "auto connect",
					Type: "Property",
				},
			])
		);
	});

	it(`sends computed props with name for Check in Style`, () => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			"abc",
			"abc label"
		);

		const propSheet = wrapper.find(PropertySheet);

		expect(propSheet.props().computedProperties).toEqual(
			expect.arrayContaining([
				{
					Name: "CheckinStyleUseForServerMailCapture",
					Value: false,
					Type: "Property",
				},
				{
					Name: "CheckinStyleUseForServerMailFolderType",
					Value: "NormalFolder",
					Type: "Property",
				},
				{ Name: "CheckinStyleRecordType", Value: undefined, Type: "Property" },
				{
					Name: "CheckinStyleName",
					Value: "abc label",
					Type: "Property",
				},
			])
		);
	});
});
