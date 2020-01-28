//import * as enzyme from "enzyme";
import * as React from "react";
import { mount } from "enzyme";
import { ViewTrimObject } from "./ViewTrimObject";
import DetailsView from "../DetailsView";
import {
	IDriveInformation,
	IObjectDetails,
	IPropertyOrFieldDef,
} from "../../trim-coms/trim-connector";
import { CommandIds } from "../../trim-coms/trim-command-ids";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { ObjectContextMenu } from "../ObjectContextMenu/ObjectContextMenu";
import { Provider } from "mobx-react";

describe("ViewTrimObject", () => {
	let checkinUri = 0;
	let finalizeUri = 0;
	let updatedDocumentInfo;
	let editCalled = false;

	beforeEach(() => {
		editCalled = false;
	});

	const returnedDocumentInfo = {
		Id: "test-id",
		Uri: 5,
		CommandDefs: [],
	};

	const makeWrapper = (menuItemsEnabled = true) => {
		const appStore = {
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
		};

		return mount(
			<Provider
				appStore={appStore}
				trimConnector={mockTrimConnector}
				wordConnector={mockWordConnector}
			>
				<ViewTrimObject
					appStore={appStore}
					trimConnector={mockTrimConnector}
					wordConnector={mockWordConnector}
					onEdit={() => {
						editCalled = true;
					}}
					recordUri={1}
				/>
			</Provider>
		).find(ViewTrimObject);
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
		getViewPanePropertyDefs(
			trimType: BaseObjectTypes,
			uri: number
		): Promise<IPropertyOrFieldDef[]> {
			return new Promise(function(resolve) {
				resolve([]);
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

	it("fires the onEdit event", () => {
		const wrapper = makeWrapper();

		const menu = wrapper.find(ObjectContextMenu);
		menu.props().onCommandComplete("edit");

		expect(editCalled).toBeTruthy();
	});
});
