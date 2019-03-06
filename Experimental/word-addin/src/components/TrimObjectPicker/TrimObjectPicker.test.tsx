(global as any).config = { BASE_URL: "" };
import * as React from "react";
import { mount, shallow, ShallowWrapper } from "enzyme";
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
	ISearchOptions,
} from "../../trim-coms/trim-connector";
import { Provider } from "mobx-react";

initializeIcons();

describe("TrimObjectPicker", function() {
	let startPoint = "Containers";
	let _searchStartPointRecord = "";
	let _searchStartPointLocation = "";
	let _searchStartPointDefault = "";
	let _contentsInReverseDateOrder = false;
	let trimConnector = new TrimConnector();

	trimConnector.credentialsResolver = (callback) => {};

	const doSearch = function<T extends ITrimMainObject>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		return new Promise(function(resolve) {
			resolve({
				results: [{ Uri: 1, NameString: "test", Icon: {} } as T],
				hasMoreItems: false,
			});
		});
	};

	const getSearchOptions = function(): Promise<ISearchOptions> {
		return new Promise(function(resolve) {
			resolve({
				StartPointForContainers: startPoint,
				StartPointForLocations: _searchStartPointLocation,
				StartPointRecordDefault: _searchStartPointRecord,
				StartPointDefault: _searchStartPointDefault,
				IncludeAlternateWhenShowingFolderContents: true,
				ContentsInReverseDateOrder: _contentsInReverseDateOrder,
			});
		});
	};

	trimConnector.search = doSearch.bind(trimConnector);
	trimConnector.getSearchOptions = getSearchOptions.bind(trimConnector);

	const mountObjectPicker = (props: any) => {
		const wrapper = mount(
			<Provider trimConnector={trimConnector}>
				<TrimObjectPicker
					{...props}
					trimType={BaseObjectTypes.Record}
					trimConnector={trimConnector}
				/>
			</Provider>
		);
		return wrapper.find(TrimObjectPicker);
	};

	it("should not open ObjectPicker when disabled, no label", () => {
		const wrapper = mountObjectPicker({ disabled: true });

		wrapper
			.find("i")
			.last()
			.simulate("click");

		expect(wrapper.state("isObjectPickerShown")).toBe(false);
	});

	it("should not open Object Picker when disabled, with label", () => {
		const wrapper = mountObjectPicker({ disabled: true, label: "label" });

		wrapper
			.find("i")
			.last()
			.simulate("click");
		expect(wrapper.state("isObjectPickerShown")).toBe(false);
	});

	it("should open Object Picker ", () => {
		const wrapper = mountObjectPicker({ label: "label" });

		wrapper
			.find("i")
			.last()
			.simulate("click");
		expect(wrapper.state("isObjectPickerShown")).toBe(true);
	});

	[
		{ text: "test", expected: true },
		{ text: "12", expected: false },
		{ text: "1", expected: false },
		{ text: "123", expected: true },
	].forEach((spec) => {
		it(`should open Object Picker when text entered ${spec.text} - ${
			spec.expected
		}`, () => {
			const wrapper = mountObjectPicker({ label: "label" });
			wrapper
				.find(TextField)
				.find("input")
				.simulate("change", { target: { value: spec.text } });

			expect.assertions(2);

			expect(wrapper.state("isObjectPickerShown")).toBe(spec.expected);
			expect(wrapper.state("searchStartPoint")).toEqual(spec.text);
		});
	});

	it("should close Object Picker", async (done) => {
		expect.assertions(1);
		const wrapper = mountObjectPicker({ label: "label" });

		wrapper
			.find("i")
			.last()
			.simulate("click");
		wrapper
			.find("i")
			.last()
			.simulate("click");

		setImmediate(() => {
			expect(wrapper.find(TrimObjectPicker).state("isObjectPickerShown")).toBe(
				false
			);

			done();
		});
	});

	it("should set advanced search when icon clicked", () => {
		const wrapper = mountObjectPicker({ disabled: true, label: "label" });

		wrapper
			.find("button")
			.first()
			.simulate("click");

		expect(wrapper.state("advancedSearch")).toBe(true);
	});

	it("should de-select advanced search when icon clicked twice", () => {
		const wrapper = mountObjectPicker({ disabled: true, label: "label" });

		wrapper
			.find("button")
			.first()
			.simulate("click");

		wrapper
			.find("button")
			.first()
			.simulate("click");

		expect(wrapper.state("advancedSearch")).toBe(false);
	});

	describe("props passed through", () => {
		const wrapper = shallow(
			<TrimObjectPicker
				disabled
				label="test"
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
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
		const makeWrapper = (
			searchStartPointContainer: string = "",
			searchStartPointLocation: string = "All",
			searchStartPointRecord: string = "FavRecords",
			searchStartPointDefault = "Search",
			propertyName = "RecordContainer",
			trimType = BaseObjectTypes.Record,
			contentsInReverseDateOrder = false
		) => {
			startPoint = searchStartPointContainer || startPoint;
			_searchStartPointLocation = searchStartPointLocation;
			_searchStartPointRecord = searchStartPointRecord;
			_searchStartPointDefault = searchStartPointDefault;
			_contentsInReverseDateOrder = contentsInReverseDateOrder;
			const wrapper = shallow<TrimObjectPicker>(
				<TrimObjectPicker
					label="test"
					trimType={trimType}
					trimConnector={trimConnector}
					propertyName={propertyName}
				/>
			);
			wrapper.setState({
				isObjectPickerShown: true,
			});

			return wrapper;
		};
		let wrapper: ShallowWrapper;

		beforeEach(() => {
			wrapper = shallow(
				<TrimObjectPicker
					label="test"
					trimType={BaseObjectTypes.Record}
					trimConnector={trimConnector}
					purpose={1}
					purposeExtra={345}
				/>
			);
			wrapper.setState({
				isObjectPickerShown: true,
			});
		});

		it("includes a Callout", () => {
			const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" });
			expect.assertions(1);
			expect(callout.length).toEqual(1);
		});

		it("includes a FocusTrapZone", () => {
			const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" });
			expect.assertions(2);
			expect(callout.find(FocusTrapZone).length).toEqual(1);
			expect(
				callout.find(FocusTrapZone).props().isClickableOutsideFocusTrap
			).toBe(true);
		});

		it("includes a trim object list", () => {
			expect.assertions(1);
			const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" });
			expect(callout.find(TrimObjectSearchList).length).toEqual(1);
		});

		it("passes purpose to list", () => {
			expect.assertions(1);
			expect(wrapper.find(TrimObjectSearchList).props().purpose).toEqual(1);
		});

		it("passes purpose extra to list", () => {
			expect.assertions(1);
			expect(wrapper.find(TrimObjectSearchList).props().purposeExtra).toEqual(
				345
			);
		});

		it("passes IncludeAlternate to list", () => {
			expect.assertions(1);
			expect(
				wrapper.find(TrimObjectSearchList).props()
					.includeAlternateWhenShowingFolderContents
			).toBeTruthy();
		});

		it("adds an item to the selected list", async (done) => {
			expect.assertions(1);

			setTimeout(() => {
				const list = wrapper.find(TrimObjectSearchList);

				list.props().onTrimObjectSelected!({
					Uri: 1,
				});

				expect(wrapper.state("selectedItems")).toEqual([{ Uri: 1 }]);
				done();
			});
		});

		[
			{
				LocationStart: "All",
				PropName: "LocationTest",
				TrimType: BaseObjectTypes.Location,
				Expected: "unkAll",
			},
			{
				LocationStart: "Favorite",
				PropName: "LocationTest",
				TrimType: BaseObjectTypes.Location,
				Expected: "unkFavorite",
			},
			{
				LocationStart: "Search",
				PropName: "LocationTest",
				TrimType: BaseObjectTypes.Location,
				Expected: "unkFavorite",
			},
			{
				ContainerStart: "Worktray",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recWorkTray",
			},
			{
				ContainerStart: "ClassBrowser",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				ContainerStart: "RecentDocs",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyDocuments",
			},
			{
				ContainerStart: "Offline",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				ContainerStart: "Search",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				ContainerStart: "FavRecords",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				ContainerStart: "Containers",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyContainers",
			},
			{
				ContainerStart: "Due",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recDueTray",
			},
			{
				ContainerStart: "In",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recInTray",
			},
			{
				ContainerStart: "DueOrIn",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recDueOrInTray",
			},
			{
				ContainerStart: "Templates",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyTemplates",
			},
			{
				ContainerStart: "ContentBlocks",
				PropName: "RecordContainer",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyContent",
			},

			{
				RecordStart: "Worktray",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recWorkTray",
			},
			{
				RecordStart: "ClassBrowser",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				RecordStart: "RecentDocs",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyDocuments",
			},
			{
				RecordStart: "Offline",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				RecordStart: "Search",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				RecordStart: "FavRecords",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "unkFavorite",
			},
			{
				RecordStart: "Containers",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyContainers",
			},
			{
				RecordStart: "Due",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recDueTray",
			},
			{
				RecordStart: "In",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recInTray",
			},
			{
				RecordStart: "DueOrIn",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recDueOrInTray",
			},
			{
				RecordStart: "Templates",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyTemplates",
			},
			{
				RecordStart: "ContentBlocks",
				PropName: "RecordRelatedRecord",
				TrimType: BaseObjectTypes.Record,
				Expected: "recMyContent",
			},

			{
				DefaultStart: "All",
				PropName: "RecordRecordType",
				TrimType: BaseObjectTypes.RecordType,
				Expected: "unkAll",
			},
			{
				DefaultStart: "Favorites",
				PropName: "RecordRecordType",
				TrimType: BaseObjectTypes.RecordType,
				Expected: "unkFavorite",
			},
			{
				DefaultStart: "Search",
				PropName: "RecordRecordType",
				TrimType: BaseObjectTypes.RecordType,
				Expected: "unkFavorite",
			},
		].forEach((val, index) => {
			const {
				RecordStart,
				ContainerStart,
				LocationStart,
				DefaultStart,
				PropName,
				TrimType,
				Expected,
			} = val;

			it(`passes the default query to the list - ${TrimType} ${Expected}`, async (done) => {
				expect.assertions(1);
				const wrapper2 = makeWrapper(
					ContainerStart,
					LocationStart,
					RecordStart,
					DefaultStart,
					PropName,
					TrimType
				);

				setTimeout(() => {
					const list = wrapper2.find(TrimObjectSearchList);

					expect(list.props().q).toEqual(Expected);
					done();
				});
			});
		});

		it(`passes the 'content sort' to the list`, async (done) => {
			expect.assertions(1);
			const wrapper2 = makeWrapper(
				"",
				"",
				"Templates",
				"",
				"RecordRelatedRecord",
				BaseObjectTypes.Record,
				true
			);

			setTimeout(() => {
				const list = wrapper2.find(TrimObjectSearchList);

				expect(list.props().contentsInReverseDateOrder).toBeTruthy();
				done();
			});
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
		wrapper.setState({ isObjectPickerShown: true, searchStartPoint: "all" });
		const callout = wrapper.find({ id: "Trim-ObjectPicker-Callout" }).at(0);
		callout.simulate("dismiss");

		it("no longer shows UI", () => {
			expect(wrapper.state("isObjectPickerShown")).toBe(false);
		});
	});
});
