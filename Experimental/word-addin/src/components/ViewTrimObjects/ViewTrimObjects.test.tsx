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
import { Link } from "office-ui-fabric-react";
import { exists } from "fs";

describe("View Trim Objects", function() {
	let resolveRecords;
	let recordQuery: ISearchParameters;
	let searchResults = [];
	beforeEach(() => {
		resolveRecords = undefined;
		recordQuery = undefined;
	});

	let appStore = new AppStoreOutlook(null, null);
	let mockTrimConnector = new TrimConnector();

	mockTrimConnector.search = function<T extends ITrimMainObject>(
		options: ISearchParameters
	): Promise<ISearchResults<T>> {
		recordQuery = options;

		return new Promise(function(resolve) {
			resolve({
				results: searchResults,
				hasMoreItems: false,
			});
		});
	}.bind(mockTrimConnector);
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

	it("creates a list of Records base on a search", (done) => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		setTimeout(() => {
			try {
				expect(wrapper.find("li").length).toEqual(2);
				expect(recordQuery.q).toEqual("unkUri:1,2");
				expect(recordQuery.properties).toEqual("ToolTip,RecordMessageId");
				expect(wrapper.state().itemNotYetFiled).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("item has been filed", (done) => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		searchResults = [
			{ Uri: 1, NameString: "Document", ToolTip: "Doc" } as IRecord,
			{
				Uri: 2,
				NameString: "Document 5",
				ToolTip: "Doc 5",
				MessageId: { Value: "test" },
			} as IRecord,
		];

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		setTimeout(() => {
			try {
				expect(wrapper.state().itemNotYetFiled).toBeFalsy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("item has not been been filed", (done) => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		searchResults = [
			{
				Uri: 1,
				NameString: "Document",
				ToolTip: "Doc",
				MessageId: { Value: "" },
			} as IRecord,
			{
				Uri: 2,
				NameString: "Document 5",
				ToolTip: "Doc 5",
				MessageId: { Value: "" },
			} as IRecord,
		];

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		setTimeout(() => {
			try {
				expect(wrapper.state().itemNotYetFiled).toBeTruthy();
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("creates a link to view a single Record", (done) => {
		appStore.setDocumentInfo({ Uris: [1, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		setTimeout(() => {
			try {
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
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("selects a Record for Viewing", (done) => {
		appStore.setDocumentInfo({ Uris: [7, 2] });

		const wrapper = shallow<ViewTrimObjects>(
			<ViewTrimObjects
				trimType={BaseObjectTypes.Record}
				appStore={appStore}
				trimConnector={mockTrimConnector}
			/>
		);

		setTimeout(() => {
			try {
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
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
