//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ExistingRecord } from "./ExistingRecord";
import DetailsView from "./DetailsView";
import { IDriveInformation, IObjectDetails } from "../trim-coms/trim-connector";
import { CommandIds } from "../trim-coms/trim-command-ids";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

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
		getObjectDetails(
			trimType: BaseObjectTypes,
			uri: number
		): Promise<IObjectDetails> {
			return new Promise(function(resolve) {
				resolve({ results: [], propertiesAndFields: [] });
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
});
