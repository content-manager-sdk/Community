//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ExistingRecord } from "./ExistingRecord";
import DetailsView from "./DetailsView";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { ICommandDef, IDriveInformation } from "../trim-coms/trim-connector";
import { CommandIds } from "../trim-coms/trim-command-ids";

describe("Existing Record", () => {
	let checkinUri = 0;
	let finalizeUri = 0;
	let updatedDocumentInfo;
	const returnedDocumentInfo = {
		Id: "test-id",
		Uri: 5,
		CommandDefs: [],
	};

	const makeWrapper = (menuItemsEnabled = true) => {
		return shallow<ExistingRecord>(
			<ExistingRecord
				appStore={{
					setDocumentInfo: (documentInfo) => {
						updatedDocumentInfo = documentInfo;
					},
					setStatus: (status: string) => {},
					RecordUri: 7,
					Id: "my id",
					messages: {
						web_Actions: "Actions",
					},
					documentInfo: {
						CommandDefs: [
							{
								CommandId: "RecCheckIn",
								MenuEntryString: "checkin",
								Tooltip: "Checkin",
								StatusBarMessage: "Checkin",
								IsEnabled: menuItemsEnabled,
							},
							{
								CommandId: "RecDocFinal",
								MenuEntryString: "Final",
								Tooltip: "Make Final",
								StatusBarMessage: "Make Final",
								IsEnabled: menuItemsEnabled,
							},
						],
					},
				}}
				trimConnector={mockTrimConnector}
				wordConnector={mockWordConnector}
			/>
		);
	};

	beforeEach(() => {
		checkinUri = 0;
		finalizeUri = 0;
		updatedDocumentInfo = null;
	});

	const mockTrimConnector = {
		runAction(commandId: CommandIds, uri: number): Promise<IDriveInformation> {
			if (commandId === CommandIds.RecCheckIn) {
				checkinUri = uri;
			} else {
				finalizeUri = uri;
			}
			return new Promise(function(resolve) {
				resolve(returnedDocumentInfo);
			});
		},
	};

	const mockWordConnector = {
		saveDocument(): Promise<void> {
			return new Promise(function(resolve) {
				resolve();
			});
		},
		getDocumentData(writeSlice: any): Promise<string> {
			return new Promise(function(resolve) {
				resolve("test");
			});
		},
		getWebUrl() {
			return "test-url";
		},
	};

	it("contains a property details element", () => {
		expect(
			makeWrapper()
				.find(DetailsView)
				.exists()
		).toBeTruthy();
	});

	it("contains an action button", function(this: any) {
		expect.assertions(9);
		const wrapper = makeWrapper();
		expect(wrapper.find(IconButton).exists()).toBeTruthy();
		expect(wrapper.find(IconButton).props().menuProps.items.length).toEqual(2);
		expect(wrapper.find(IconButton).props().menuProps.items[0].text).toEqual(
			"Checkin"
		);
		expect(wrapper.find(IconButton).props().menuProps.items[1].text).toEqual(
			"Make Final"
		);

		expect(
			wrapper.find(IconButton).props().menuProps.items[1].disabled
		).toBeFalsy();

		expect(wrapper.find(IconButton).props().split).toBeTruthy();
		expect(wrapper.find(IconButton).props().primary).toBeTruthy();
		expect(wrapper.find(IconButton).props().text).toBeUndefined();
		expect(wrapper.find(IconButton).props().iconProps).toEqual({
			iconName: "CollapseMenu",
		});
	});

	it("calls checkin when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper.find(IconButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(checkinUri).toEqual(7);
				expect(finalizeUri).toEqual(0);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls finalize when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper.find(IconButton).props().menuProps.items[1];

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(checkinUri).toEqual(0);
				expect(finalizeUri).toEqual(7);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("disables Make Final when Record is already finalised", () => {
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			wrapper.find(IconButton).props().menuProps.items[1].disabled
		).toBeTruthy();
	});

	it("sets the documentInfo on state after an action", (done) => {
		const wrapper = makeWrapper();

		expect.assertions(1);
		const menuItem = wrapper.find(IconButton).props().menuProps.items[1];

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(updatedDocumentInfo).toEqual(returnedDocumentInfo);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
