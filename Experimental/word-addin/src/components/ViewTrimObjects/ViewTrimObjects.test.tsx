//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import AppStoreOutlook from "../../stores/AppStoreOutlook";
import { ViewTrimObjects } from "./ViewTrimObjects";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import ViewTrimObject from "../ViewTrimObject/ViewTrimObject";
import TrimConnector, {
	ISearchParameters,
	ITrimMainObject,
	ISearchResults,
	IRecord,
} from "../../trim-coms/trim-connector";
import { Link, PrimaryButton } from "office-ui-fabric-react";
import { exists } from "fs";
import flushPromises = require("flush-promises");
import EditTrimObject from "../EditTrimObject/EditTrimObject";

describe("View Trim Objects", function() {
	let resolveRecords;
	let recordQuery: ISearchParameters;
	let searchResults = [];
	let moreToFile = false;
	let clearUrisCalled = false;
	let fetchFiledCalled = false;
	beforeEach(() => {
		resolveRecords = undefined;
		recordQuery = undefined;
		moreToFile = false;
		clearUrisCalled = false;
		fetchFiledCalled = false;
	});

	let appStore = new AppStoreOutlook(null, null);

	appStore.moreToFile = function() {
		return moreToFile;
	}.bind(appStore);

	appStore.clearUris = function() {
		clearUrisCalled = true;
	}.bind(appStore);

	appStore.fetchFiledRecords = function() {
		fetchFiledCalled = true;
		return new Promise(function(resolve) {
			resolve(searchResults);
		});
	}.bind(appStore);

	let mockTrimConnector = new TrimConnector();

	beforeEach(() => {
		searchResults = [
			{ Uri: 1, NameString: "Document", ToolTip: "Doc" } as ITrimMainObject,
			{ Uri: 2, NameString: "Document 5", ToolTip: "Doc 5" } as ITrimMainObject,
		];
	});
	it("shows the View Object component when there is only one Record", () => {
		appStore.setDocumentInfo({ Uris: [1] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects trimType={BaseObjectTypes.Record} appStore={appStore} />
		);

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
	});

	it("does not show the View Object component when there is more than one Record", () => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		expect(wrapper.find(ViewTrimObject).exists()).toBeFalsy();
	});

	it("creates a list of Records based on a search", async () => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		await flushPromises();
		expect(wrapper.find("li").length).toEqual(2);
		expect(fetchFiledCalled).toBeTruthy();
	});

	it("item has been filed", () => {
		moreToFile = false;
		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		expect(wrapper.find(PrimaryButton).exists()).toBeFalsy();
	});

	it("item has not been been filed", () => {
		moreToFile = true;

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		expect(wrapper.find(PrimaryButton).exists()).toBeTruthy();
	});

	it("calls appstore to clear uris", () => {
		moreToFile = true;

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		wrapper.find(PrimaryButton).simulate("click");
		expect(clearUrisCalled).toBeTruthy();
	});

	it("creates a link to view a single Record", async () => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		await flushPromises();
		expect(
			wrapper
				.find("li")
				.first()
				.find(Link)
				.exists()
		).toBeTruthy();

		expect(
			wrapper
				.find("li")
				.first()
				.find(Link)
				.first()
				.props().children
		).toEqual("Doc");
	});

	it("selects a Record for Viewing", async () => {
		appStore.setDocumentInfo({ Uris: [7, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		moreToFile = true;

		await flushPromises();
		wrapper
			.find("li")
			.at(1)
			.find(Link)
			.props()
			.onClick(null);

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
		expect(
			wrapper
				.find(ViewTrimObject)
				.first()
				.props().recordUri
		).toEqual(2);
	});

	it("Shows View Record component on edit", function() {
		appStore.setDocumentInfo({ Uris: [1] });
		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);
		wrapper.setState({ selectedUri: 1 });
		const viewer = wrapper.find(ViewTrimObject);
		viewer.props().onEdit(1);

		const editor = wrapper.find(EditTrimObject);
		editor.props().onSave();

		expect(wrapper.find(ViewTrimObject).exists()).toBeTruthy();
		expect(wrapper.find(EditTrimObject).exists()).toBeFalsy();
	});

	it("Shows Edit Record component on edit", function(this: any) {
		appStore.setDocumentInfo({ Uris: [1] });
		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);
		wrapper.setState({ selectedUri: 1 });

		const viewer = wrapper.find(ViewTrimObject);
		viewer.props().onEdit(1);

		expect(wrapper.find(ViewTrimObject).exists()).toBeFalsy();
		expect(wrapper.find(EditTrimObject).exists()).toBeTruthy();
	});
});
