(global as any).config = { BASE_URL: "" };

import * as React from "react";
import { shallow } from "enzyme";

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
import WordConnector from "../../office-coms/word-connector";
import AppStoreWord from "../../stores/AppStoreWord";
import flushPromises = require("flush-promises");

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
				appStore={appStore}
				trimConnector={mockTrimConnector}
				wordConnector={mockWordConnector}
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

	beforeEach(() => {
		appStore.setDocumentInfo({
			Uris: [],
			Options: {},
			URN: "test_urn",
			EmailPath: null,
		});
		appStore.setMessages({
			web_Register: "Register",
			web_SelectRecordType: "Select a Record Type",
			web_RecordTypeRequiresForm: "NeedsDataEntryForm",
		});
	});

	afterEach(() => {
		registerProps = [];
		populatePages = false;
		rejectRegister = false;
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

	const mockWordConnector = new WordConnector();

	const appStore = new AppStoreWord(mockTrimConnector, mockWordConnector);
	appStore.createRecord = function(recordUri, recordProps) {
		return new Promise(function(resolve) {
			resolve();
		});
	}.bind(appStore);

	it("contains a Record Type dropdown", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			true
		);
		setImmediate(() => {
			try {
				expect(wrapper.find(ComboBox).props().placeholder).toEqual(
					"Select a Record Type"
				);

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

	it("disables form when no folder Id set", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			true
		);

		setImmediate(() => {
			try {
				expect(wrapper.find(ComboBox).props().disabled).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("does not disable form when no folder Id set and not linked folder", (done) => {
		const wrapper = makeWrapper(
			BaseObjectTypes.CheckinStyle,
			null,
			null,
			null,
			false
		);

		setImmediate(() => {
			try {
				expect(wrapper.find(ComboBox).props().disabled).toBeFalsy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
	it("enables form when  folder Id set", (done) => {
		const wrapper = makeWrapper(BaseObjectTypes.CheckinStyle);

		wrapper.setProps({ folderId: "fff" });

		setImmediate(() => {
			try {
				expect(wrapper.find(ComboBox).props().disabled).toBeFalsy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
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

	it("selects the default Record Type", async () => {
		const wrapper = shallow<RecordTypePicker>(
			<RecordTypePicker
				appStore={appStore}
				trimConnector={mockTrimConnector}
				wordConnector={mockWordConnector}
				trimType={BaseObjectTypes.Record}
				onRecordTypeSelected={(uri) => {
					recordTypeUri = uri;
				}}
				includeCheckinStyles={false}
				defaultRecordType={{ Uri: 5, TrimType: BaseObjectTypes.RecordType }}
			/>
		);
		await flushPromises();
		expect(wrapper.state().recordTypes[1].selected).toBeTruthy();
	});

	it("selects the default Checkin Style", async () => {
		const wrapper = shallow<RecordTypePicker>(
			<RecordTypePicker
				appStore={appStore}
				trimConnector={mockTrimConnector}
				wordConnector={mockWordConnector}
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

		await flushPromises();
		expect(wrapper.state().checkinStyles[0].selected).toBeTruthy();
	});
});
