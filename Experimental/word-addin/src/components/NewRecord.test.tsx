(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { mount, shallow } from "enzyme";
import { NewRecord } from "./NewRecord";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
	TrimConnector,
	ISearchResults,
	ISearchParameters,
} from "../trim-coms/trim-connector";
import { ITrimMainObject } from "../trim-coms/trim-connector";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "../office-coms/office-connector";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

import RecordTypePicker from "../components/RecordTypePicker/RecordTypePicker";

describe("New Record layout", function() {
	let resolveCheckinStyles;
	let testRecordUrn = "";
	let testSubjectPrefix = "";
	let propertySheetTrimType = BaseObjectTypes.Location;
	let wrapper;
	let registerProps = [];
	//let registerPropsForPlace = undefined;
	let registerType1 = undefined;
	let registerType2 = undefined;
	let errorMessage: string = undefined;
	let populatePages = false;
	let rejectRegister = false;

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
		folderName?: string,
		isLinkedFolder?: boolean
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
				isLinkedFolder={isLinkedFolder}
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
		registerType1 = undefined;
		registerType2 = undefined;
		errorMessage = undefined;
		populatePages = false;
		rejectRegister = false;
		mockStore.documentInfo.EmailPath = null;
	});

	let mockTrimConnector = new TrimConnector();

	mockTrimConnector.saveToTrim = (
		trimType: BaseObjectTypes,
		properties: any,
		fields: any
	) => {
		registerProps.push(properties);

		if (registerType1) {
			registerType2 = trimType;
		} else {
			registerType1 = trimType;
		}

		return new Promise<ITrimMainObject>(function(resolve, reject) {
			if (rejectRegister) {
				reject("create error");
			} else {
				resolve({ Uri: 456 });
			}
		});
	};

	const doSearch = function<T extends ITrimMainObject>(
		options: ISearchParameters
	): Promise<ISearchResults<T>> {
		return new Promise(function(resolve) {
			if (options.trimType === BaseObjectTypes.CheckinPlace) {
				resolveCheckinStyles = resolve;
			} else {
				resolve({
					results: [
						{ Uri: 1, NameString: "Document" } as T,
						{ Uri: 5, NameString: "Document 5" } as T,
					],
					hasMoreItems: false,
				});
			}
		});
	};

	mockTrimConnector.search = doSearch.bind(mockTrimConnector);

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
		documentInfo: { Options: {}, URN: "test_urn", EmailPath: null },
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

	it("contains a Record Type dropdown", () => {
		expect(wrapper.find(RecordTypePicker).exists()).toBeTruthy();
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
		//	expect(wrapper.instance.recordTypeUri).toEqual(0);
		wrapper.setProps({
			validateRecordType: null,
		});
		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(1, false);

		expect(wrapper.instance().recordTypeUri).toEqual(1);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

		expect(wrapper.instance().recordTypeUri).toEqual(5);
	});

	it("calls create record on button press", () => {
		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(1, false);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		expect(mockStore.RecordUri).toEqual(1);
	});

	it("calls register in TRIM for non Record object", (done) => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

		wrapper
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });
		setTimeout(() => {
			try {

				expect(registerType1).toEqual(BaseObjectTypes.CheckinStyle);
				expect(registerType2).toEqual(BaseObjectTypes.CheckinPlace);

				expect(registerProps[0]).toEqual({ CheckinStyleRecordType: 5 });
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("sets default record type on picker", () => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);
		wrapper.setProps({
			defaultRecordType: { Uri: 66, TrimType: BaseObjectTypes.RecordType },
		});

		expect(
			wrapper
				.find(RecordTypePicker)
				.first()
				.props().defaultRecordType
		).toEqual({ Uri: 66, TrimType: BaseObjectTypes.RecordType });
	});

	it("sets error on register non Record object", (done) => {
		rejectRegister = true;
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });
		setTimeout(() => {
			try {
				expect(errorMessage).toEqual("create error");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("create a linked folder checkin place for a Check in Style", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			() => {},
			"123",
			null,
			true
		);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

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

	it("create checkin place for a Check in Style", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			() => {},
			null,
			null,
			false
		);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(registerProps[1]).toEqual({
					CheckinPlaceCheckinAs: 456,
					CheckinPlacePlaceType: "MailForClientProcessing",
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

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

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

			wrapper
				.find(RecordTypePicker)
				.first()
				.props()
				.onRecordTypeSelected(1, false);

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

	it("does not call auto open for an attachment", (done) => {
		wrapper.setProps({ bypassUpdateEmailSubject: true });

		wrapper
			.update()
			.find("form")
			.first()
			.simulate("submit", { preventDefault: function() {} });

		setTimeout(() => {
			try {
				expect(testRecordUrn).toBeFalsy();
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

		// no property sheet before recordtype uri sey
		expect(shallowWrapper.find(PropertySheet).exists()).toBeTruthy();

		shallowWrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

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

		shallowWrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);

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

		shallowWrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(5, false);
		setImmediate(() => {
			try {
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

			wrapper
				.find(RecordTypePicker)
				.first()
				.props()
				.onRecordTypeSelected(5, false);

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
