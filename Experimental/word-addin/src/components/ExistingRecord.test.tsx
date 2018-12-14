//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ExistingRecord } from "./ExistingRecord";
import DetailsView from "./DetailsView";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
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

	it("contains a property details element", () => {
		expect(
			makeWrapper()
				.find(DetailsView)
				.exists()
		).toBeTruthy();
	});

	it("contains an action button", function(this: any) {
		expect.assertions(8);
		const wrapper = makeWrapper();
		expect(wrapper.find(DefaultButton).exists()).toBeTruthy();
		expect(wrapper.find(DefaultButton).props().menuProps.items.length).toEqual(
			2
		);
		expect(wrapper.find(DefaultButton).props().menuProps.items[0].text).toEqual(
			"Checkin"
		);
		expect(wrapper.find(DefaultButton).props().menuProps.items[1].text).toEqual(
			"Make Final"
		);

		expect(
			wrapper.find(DefaultButton).props().menuProps.items[1].disabled
		).toBeFalsy();

		expect(wrapper.find(DefaultButton).props().split).toBeTruthy();
		expect(wrapper.find(DefaultButton).props().primary).toBeTruthy();
		expect(wrapper.find(DefaultButton).props().text).toEqual("Actions");
	});

	it("calls checkin when checkin button clicked", () => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper.find(DefaultButton).props().menuProps.items[0];

		menuItem.onClick(null, menuItem);
		expect(checkinUri).toEqual(7);
		expect(finalizeUri).toEqual(0);
	});

	it("calls finalize when checkin button clicked", () => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper.find(DefaultButton).props().menuProps.items[1];

		menuItem.onClick(null, menuItem);

		expect(checkinUri).toEqual(0);
		expect(finalizeUri).toEqual(7);
	});

	it("disables Make Final when Record is already finalised", () => {
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			wrapper.find(DefaultButton).props().menuProps.items[1].disabled
		).toBeTruthy();
	});

	it("sets the documentInfo on state after an action", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(1);
		const menuItem = wrapper.find(DefaultButton).props().menuProps.items[1];

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			expect(updatedDocumentInfo).toEqual(returnedDocumentInfo);
			done();
		});
	});
});
