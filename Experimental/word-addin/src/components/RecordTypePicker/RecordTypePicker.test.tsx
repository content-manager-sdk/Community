(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { mount, shallow } from "enzyme";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
	TrimConnector,
	ICheckinPlace,
	ISearchParameters,
	ISearchResults,
} from "../../trim-coms/trim-connector";
import { IRecordType, ITrimMainObject } from "../../trim-coms/trim-connector";
import { IOfficeConnector } from "../../office-coms/office-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { ComboBox } from "office-ui-fabric-react";
import { RecordTypePicker } from "./RecordTypePicker";
import { IGetRecordUriResponse } from "../../office-coms/word-connector";

describe("Record Type Picker", function() {
	let resolveCheckinStyles;
	let registerProps = [];
	let populatePages = false;
	let rejectRegister = false;
	let recordTypeUri = 0;

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
		isLinkedFolder?: boolean,
		includeCheckinStyles?: boolean
	) => {
		const innerWrapper = shallow<RecordTypePicker>(
			<RecordTypePicker
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={trimType}
				onRecordTypeSelected={(uri) => {
					recordTypeUri = uri;
				}}
				folderId={folderId}
				computedCheckinStyleName={folderName}
				isLinkedFolder={isLinkedFolder}
				includeCheckinStyles={includeCheckinStyles}
			/>
		);

		return innerWrapper;
	};

	afterEach(() => {
		registerProps = [];
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
		setUri(uri: number): Promise<IGetRecordUriResponse> {
			throw new Error("Method not implemented.");
		}
		getWebUrl(): Promise<string> {
			throw new Error("Method not implemented.");
		}
		getUri(): Promise<IGetRecordUriResponse> {
			throw new Error("Method not implemented.");
		}
	}

	it("contains a Record Type dropdown", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			true
		);
		expect(wrapper.find(ComboBox).props().placeholder).toEqual(
			"Select a Record Type"
		);
		setImmediate(() => {
			try {
				expect(
					wrapper
						.update()
						.find(ComboBox)
						.props().options
				).toEqual([
					{ key: 1, text: "Document" },
					{ key: 5, text: "Document 5" },
				]);
				done();
			} catch (error) {
				done.fail(error);
			}
		});
	});

	it("disables form when no folder Id set", () => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			true
		);

		expect(wrapper.find(ComboBox).props().disabled).toBeTruthy();
	});

	it("does not disable form when no folder Id set and not linked folder", () => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			false
		);

		expect(wrapper.find(ComboBox).props().disabled).toBeFalsy();
	});
	it("enables form when  folder Id set", () => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper.setProps({ folderId: "fff" });
		expect(wrapper.find(ComboBox).props().disabled).toBeFalsy();
	});

	it("checkin Style List populated", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinPlace,
			undefined,
			undefined,
			undefined,
			undefined,
			true
		);

		resolveCheckinStyles({
			results: [
				{
					Uri: 1,
					CheckinAs: { Uri: 1 },
					NameString: "checkin style 1",
				} as ICheckinPlace,
			],
		});

		setTimeout(() => {
			try {
				expect(wrapper.state().checkinStyles.length).toEqual(1);
				expect(wrapper.state().checkinStyles[0].text).toEqual(
					"checkin style 1"
				);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("selected checkin place", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinPlace,
			undefined,
			undefined,
			undefined,
			undefined,
			true
		);

		resolveCheckinStyles({
			results: [
				{
					Uri: 1,
					CheckinAs: { Uri: 111 },
					NameString: "checkin style 1",
				} as ICheckinPlace,
			],
		});

		wrapper.setState({ checkinUsingStyle: true });

		setTimeout(() => {
			try {
				wrapper
					.update()
					.find(ComboBox)
					.props()
					.onChange(null, null, 0);

				expect(recordTypeUri).toEqual(111);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("selects the default Record Type", (done) => {
		const wrapper = shallow<RecordTypePicker>(
			<RecordTypePicker
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={BaseObjectTypes.Record}
				onRecordTypeSelected={(uri) => {
					recordTypeUri = uri;
				}}
				includeCheckinStyles={false}
				defaultRecordType={{ Uri: 5, TrimType: BaseObjectTypes.RecordType }}
			/>
		);
		setTimeout(() => {
			try {
				expect(wrapper.state().recordTypes[1].selected).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("selects the default Checkin Style", (done) => {
		const wrapper = shallow<RecordTypePicker>(
			<RecordTypePicker
				appStore={mockStore}
				trimConnector={mockTrimConnector}
				wordConnector={new MockWordConnector()}
				trimType={BaseObjectTypes.Record}
				onRecordTypeSelected={(uri) => {
					recordTypeUri = uri;
				}}
				includeCheckinStyles={true}
				defaultRecordType={{ Uri: 1, TrimType: BaseObjectTypes.CheckinStyle }}
			/>
		);

		resolveCheckinStyles({
			results: [
				{
					Uri: 1,
					CheckinAs: { Uri: 1 },
					NameString: "checkin style 1",
				} as ICheckinPlace,
			],
		});

		setTimeout(() => {
			try {
				expect(wrapper.state().checkinStyles[0].selected).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
