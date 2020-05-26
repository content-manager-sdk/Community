//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ObjectContextMenu } from "./ObjectContextMenu";

import TrimConnector, {
	IDriveActionInformation,
	IEnumDetails,
} from "../../trim-coms/trim-connector";
import { CommandIds } from "../../trim-coms/trim-command-ids";
import {
	ContextualMenuItemType,
	IContextualMenuProps,
	IContextualMenuItem,
} from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandBar } from "office-ui-fabric-react";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import AppStoreOutlook from "../../stores/AppStoreOutlook";
import WordConnector from "../../office-coms/word-connector";
import flushPromises = require("flush-promises");

describe("Object Context Menu", () => {
	let checkinUri = 0;
	let undoCheckinUri = 0;
	let favUri = 0;
	let finalizeUri = 0;

	let insertedText = "";
	let insertedUrl = "";
	let testError = "";
	let testUri = 0;
	let setForOptionsSet = "";
	let completedCommand = "";
	let isEmail = false;
	let saveDocumentCalled = false;
	let moreToFile = false;

	const returnedDocumentInfo = {
		Id: "test-id",
		Uris: [5],
		CommandDefs: [],
	};

	let menuItemsEnabled: boolean = true;

	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	trimConnector.getEnum = function () {
		return new Promise<IEnumDetails[]>(function (resolve) {
			resolve([{ Name: "Copy", Caption: "Copy" }]);
		});
	}.bind(trimConnector);

	trimConnector.getObjectDefinitions = function () {
		return new Promise((resolve) => {
			resolve([{ Id: "Record", Caption: "Record" }]);
		});
	}.bind(trimConnector);

	trimConnector.getMenuItemsForList = function (trimType) {
		return new Promise((resolve) => {
			if (trimType === BaseObjectTypes.Record) {
				resolve([
					{
						CommandId: "AddToFavorites",
						Tooltip: "Add To Favorites",
						MenuItemType: "MenuItemCommand",
						NeedsAnObject: true,
						IsEnabled: menuItemsEnabled,
					},
					{
						CommandId: "Properties",
						MenuEntryString: "Properties",
						Tooltip: "Display Properties",
						StatusBarMessage: "Display Properties",
						NeedsAnObject: true,
						IsEnabled: menuItemsEnabled,
					},
					{
						CommandId: "RecDocFinal",
						MenuEntryString: "Final",
						Tooltip: "Make Final",
						StatusBarMessage: "Make Final",
						NeedsAnObject: true,
						IsEnabled: menuItemsEnabled,
					},
					{
						CommandId: "RecCheckIn",
						MenuEntryString: "checkin",
						Tooltip: "Checkin",
						StatusBarMessage: "Checkin",
						IsEnabled: menuItemsEnabled,
						NeedsAnObject: true,
					},
				]);
			} else {
				resolve([
					{
						IsEnabled: true,
						CommandId: "New",
						Tooltip: "new",
						MenuItemType: "MenuItemCommand",
						NeedsAnObject: false,
					},
				]);
			}
		});
	}.bind(trimConnector);

	trimConnector.getEnabledCommandIds = function () {
		return new Promise<string[]>((resolve) => {
			resolve(["AddToFavorites"]);
		});
	}.bind(trimConnector);

	trimConnector.setGlobalUserOptions = function (forOptionsSet) {
		setForOptionsSet = forOptionsSet;

		return new Promise((resolve) => {
			resolve();
		});
	}.bind(trimConnector);

	trimConnector.runAction = function (
		commandId: CommandIds,
		uri: number
	): Promise<IDriveActionInformation> {
		if (commandId === CommandIds.AddToFavorites) {
			favUri = uri;
		} else if (commandId === CommandIds.RecCheckIn) {
			checkinUri = uri;
		} else if (commandId === CommandIds.RecUndoCheckInDelete) {
			undoCheckinUri = uri;
		} else {
			finalizeUri = uri;
		}
		return new Promise(function (resolve) {
			resolve(returnedDocumentInfo);
		});
	}.bind(trimConnector);

	const wordConnector = new WordConnector();
	wordConnector.saveDocument = function (): Promise<void> {
		saveDocumentCalled = true;
		return new Promise(function (resolve) {
			resolve();
		});
	}.bind(wordConnector);

	wordConnector.getDocumentData = function (writeSlice: any): Promise<string> {
		return new Promise(function (resolve) {
			resolve("test");
		});
	}.bind(wordConnector);

	wordConnector.getWebUrl = function () {
		return "test-url";
	}.bind(wordConnector);

	wordConnector.insertText = function (textToInsert) {
		insertedText = textToInsert;
	}.bind(wordConnector);

	wordConnector.insertLink = function (text, url) {
		insertedText = text;
		insertedUrl = url;
	}.bind(wordConnector);

	const appStore = new AppStoreOutlook(trimConnector, wordConnector);

	appStore.isEmail = function () {
		return isEmail;
	}.bind(appStore);
	appStore.moreToFile = function () {
		return moreToFile;
	}.bind(appStore);
	// appStore.setError = function(message: any) {
	// 	testError = message;
	// }.bind(appStore);
	// appStore.setErrorMessage = function(message: any) {
	// 	testError = message;
	// }.bind(appStore);

	appStore.openInCM = function (uri: number) {
		testUri = uri;
	}.bind(appStore);
	appStore.setSpinning = function () {}.bind(appStore);
	appStore.setStatus = function () {}.bind(appStore);
	appStore.getWebClientUrl = function (uri: number) {
		return "link?uri=" + uri;
	}.bind(appStore);

	const makeWrapper = (
		isInList: boolean = false,
		trimType = BaseObjectTypes.Record,
		record = {
			Uri: 7,
			ToolTip: "test title",
			NameString: "REC_1",
			TrimType: trimType,
			EnabledCommandIds: ["Properties,RecDocFinal"],
			ExternalEditingComplete: false,
		}
	) => {
		const wrapper = shallow<ObjectContextMenu>(
			<ObjectContextMenu
				trimType={trimType}
				isInList={isInList}
				onCommandComplete={(key: string) => {
					completedCommand = key;
				}}
				appStore={appStore}
				trimConnector={trimConnector}
				wordConnector={wordConnector}
				record={record}
			/>
		);
		/*
		wrapper.setState({
			commandDefs: [
				{
					CommandId: "RecCheckIn",
					MenuEntryString: "checkin",
					Tooltip: "Checkin",
					StatusBarMessage: "Checkin",
					IsEnabled: menuItemsEnabled,
					NeedsAnObject: true,
				},
				{
					CommandId: "RecDocFinal",
					MenuEntryString: "Final",
					Tooltip: "Make Final",
					StatusBarMessage: "Make Final",
					IsEnabled: menuItemsEnabled,
					NeedsAnObject: true,
				},
				{
					CommandId: "Properties",
					MenuEntryString: "Properties",
					Tooltip: "Properties",
					StatusBarMessage: "Properties",
					IsEnabled: menuItemsEnabled,
					NeedsAnObject: true,
				},
				{
					CommandId: "New",
					MenuEntryString: "new",
					Tooltip: "new",
					StatusBarMessage: "new",
					IsEnabled: menuItemsEnabled,
					NeedsAnObject: false,
				},
			],
		});*/
		return wrapper;
	};

	beforeEach(() => {
		checkinUri = 0;
		favUri = 0;
		finalizeUri = 0;
		insertedText = "";
		insertedUrl = "";
		testError = "";
		testUri = 0;
		setForOptionsSet = "";
		completedCommand = "";
		isEmail = false;
		saveDocumentCalled = false;
		moreToFile = false;
		menuItemsEnabled = true;
		appStore.setDocumentInfo({
			Id: "my id",
			Uris: [7, 9],
		});

		appStore.setMessages({
			web_Actions: "Actions",
			web_Paste: "Paste",
			web_Please_Select: "Please select",
			bob_needSelectedRow: "bob_needSelectedRow",
		});
	});

	const findMenuItem = (
		wrapper: shallow<ObjectContextMenu>,
		getFirstItem?: boolean
	): IContextualMenuItem => {
		const farItems = wrapper.find(CommandBar).props().farItems;
		return farItems[getFirstItem ? 0 : farItems.length - 1];
	};

	const findMenu = (
		wrapper: shallow<ObjectContextMenu>,
		getFirstItem?: boolean
	): IContextualMenuProps => {
		const farItems = wrapper.find(CommandBar).props().farItems;
		const theMenu = farItems.find(function (mi) {
			return mi.key === "moreActions";
		});
		return theMenu.subMenuProps;
	};

	it("contains an action button", function (this: any) {
		expect.assertions(4);
		const wrapper = makeWrapper();
		expect(wrapper.find(CommandBar).exists()).toBeTruthy();
		expect(wrapper.find(CommandBar).props().farItems.length).toEqual(3);

		const makeFinalItem = findMenu(wrapper).items.find((mi) => {
			return mi.key === "RecDocFinal";
		});

		expect(makeFinalItem.text).toEqual("Make Final");
		expect(makeFinalItem.disabled).toBeFalsy();
	});

	it("contains paste and split", function (this: any) {
		expect.assertions(3);
		const wrapper = makeWrapper();

		expect(findMenu(wrapper).items[0].key).toEqual("paste");
		expect(findMenu(wrapper).items[0].text).toEqual("Paste");
		expect(findMenu(wrapper).items[1].itemType).toEqual(
			ContextualMenuItemType.Divider
		);
	});

	it("not contains paste and split for non record", function (this: any) {
		expect.assertions(1);
		const wrapper = makeWrapper(true, true, BaseObjectTypes.CheckinPlace);

		expect(
			findMenu(wrapper, true).items.find((menuItem) => {
				return menuItem.key === "paste";
			})
		).toBeUndefined();
	});

	it("contains add relationship", async () => {
		expect.assertions(1);
		const wrapper = makeWrapper(true, true);

		await flushPromises();
		expect(
			findMenu(wrapper, true).items.find((menuItem) => {
				return menuItem.key === "addRelationshipto";
			})
		).toBeTruthy();
	});

	it("not contain add relationship", function (this: any) {
		expect.assertions(1);
		const wrapper = makeWrapper(true, false);

		expect(
			findMenu(wrapper).items.find((menuItem) => {
				return menuItem.key === "addRelationshipto";
			})
		).toBeUndefined();
	});

	it("not contain add relationship for non Record", function (this: any) {
		expect.assertions(1);
		const wrapper = makeWrapper(true, true, BaseObjectTypes.CheckinPlace);

		expect(
			findMenu(wrapper, true).items.find((menuItem) => {
				return menuItem.key === "addRelationshipto";
			})
		).toBeUndefined();
	});

	it("error when record not selected", async () => {
		const wrapper = makeWrapper(true, false);
		wrapper.setProps({
			record: {
				Uri: 0,
				TrimType: BaseObjectTypes.Record,
				CommandDefs: [
					{
						CommandId: "RecCheckIn",
						MenuEntryString: "checkin",
						Tooltip: "Checkin",
						StatusBarMessage: "Checkin",
						IsEnabled: true,
						NeedsAnObject: true,
					},
				],
			},
		});

		const menuItem = findMenu(wrapper)
			.items.find((mp) => {
				return mp.key === "paste";
			})
			.subMenuProps.items.find((sm) => {
				return sm.key === "pasteTitle";
			});
		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(appStore.errorMessage).toEqual("bob_needSelectedRow");
		expect.assertions(1);
	});

	it("error on create relationship when record not selected", async () => {
		const wrapper = makeWrapper(true, true);

		wrapper.setProps({ record: { Uri: 0, TrimType: BaseObjectTypes.Record } });
		await flushPromises();
		const menuItem = findMenu(wrapper, true).items.find((mi) => {
			return mi.key === "addRelationshipto";
		}).subMenuProps.items[0];

		await flushPromises();
		menuItem.onClick(null, menuItem);
		await flushPromises();
		expect(appStore.errorMessage).toEqual("bob_needSelectedRow");
		expect.assertions(1);
	});

	it("calls insert text when paste clicked", async () => {
		const wrapper = makeWrapper(false);

		expect.assertions(1);
		const menuItem = findMenu(wrapper)
			.items.find((mp) => {
				return mp.key === "paste";
			})
			.subMenuProps.items.find((sm) => {
				return sm.key === "pasteTitle";
			});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(insertedText).toEqual("test title");
	});

	it("fires event when New clicked", async () => {
		const wrapper = makeWrapper(false);

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "New";
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(completedCommand).toEqual("New");
		expect(saveDocumentCalled).toBeFalsy();
	});

	it("calls insert text when paste number", async () => {
		const wrapper = makeWrapper(false);

		expect.assertions(1);
		const menuItem = findMenu(wrapper)
			.items.find((mp) => {
				return mp.key === "paste";
			})
			.subMenuProps.items.find((sm) => {
				return sm.key === "pasteNumber";
			});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(insertedText).toEqual("REC_1");
	});

	it("calls insert link when paste clicked", async () => {
		const wrapper = makeWrapper(false);

		expect.assertions(2);
		const menuItem = findMenu(wrapper)
			.items.find((mp) => {
				return mp.key === "paste";
			})
			.subMenuProps.items.find((sm) => {
				return sm.key === "pasteLink";
			});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(insertedText).toEqual("REC_1");
		expect(insertedUrl).toEqual("link?uri=7");
	});

	it("calls favorite when checkin button clicked (from list)", async () => {
		const wrapper = makeWrapper(true, true);

		expect.assertions(3);
		await flushPromises();
		const menuItem = findMenu(wrapper, true).items.find((mp) => {
			return mp.key === "AddToFavorites";
		});

		menuItem.onClick(null, menuItem);
		await flushPromises();
		expect(favUri).toEqual(7);
		expect(checkinUri).toEqual(0);
		expect(finalizeUri).toEqual(0);
	});

	it("calls checkin when checkin button clicked", async () => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "RecCheckIn";
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(checkinUri).toEqual(7);
		expect(finalizeUri).toEqual(0);
	});

	it("calls undo checkin on delete", async () => {
		const wrapper = makeWrapper(true, false, BaseObjectTypes.Record, {
			Uri: 23,
			ToolTip: "test title",
			NameString: "REC_1",
			TrimType: BaseObjectTypes.Record,
			EnabledCommandIds: ["Properties,RecDocFinal"],
			ExternalEditingComplete: true,
		});

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === CommandIds.RecUndoCheckInDelete;
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(undoCheckinUri).toEqual(23);
		expect(finalizeUri).toEqual(0);
	});

	it("calls get global when get global button clicked", async () => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "getGlobalProperties";
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(setForOptionsSet).toEqual("ViewPane");
		expect(completedCommand).toEqual("getGlobalProperties");
	});

	it("calls edit when edit button clicked", async () => {
		const wrapper = makeWrapper();

		expect.assertions(1);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "edit";
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(completedCommand).toEqual("edit");
	});

	it("calls finalize when checkin button clicked", async () => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		await flushPromises();
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "RecDocFinal";
		});

		menuItem.onClick(null, menuItem);

		await flushPromises();
		expect(checkinUri).toEqual(0);
		expect(finalizeUri).toEqual(7);
	});

	it("disables Make Final when Record is already finalised", () => {
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			findMenu(wrapper).items.find((mp) => {
				return mp.key === "RecDocFinal";
			}).disabled
		).toBeTruthy();
	});

	it("save button hidden for Outlook", () => {
		isEmail = true;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			wrapper
				.find(CommandBar)
				.props()
				.farItems.find((mp) => {
					return mp.key === "RecCheckIn";
				})
		).toBeFalsy();
	});

	it("file more button not available in Outlook when there are no more to file", () => {
		isEmail = true;
		moreToFile = false;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			wrapper
				.find(CommandBar)
				.props()
				.farItems.pop()
				.subMenuProps.items.find((mp) => {
					return mp.key === "FileMore";
				})
		).toBeFalsy();
	});

	it("file more button available in Outlook when there are more to file", () => {
		isEmail = true;
		moreToFile = true;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			findMenu(wrapper).items.find((mp) => {
				return mp.key === "FileMore";
			})
		).toBeTruthy();
	});

	it("save on delete button hidden for Outlook", () => {
		isEmail = true;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			wrapper
				.find(CommandBar)
				.props()
				.farItems.find((mp) => {
					return mp.key === CommandIds.RecCheckInDelete;
				})
		).toBeFalsy();
	});

	it("save menu item hidden for Outlook", () => {
		isEmail = true;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			findMenu(wrapper).items.find((mp) => {
				return mp.key === "RecCheckIn";
			})
		).toBeFalsy();
	});

	it("save on delete menu item hidden for Outlook", () => {
		isEmail = true;
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(
			findMenu(wrapper).items.find((mp) => {
				return mp.key === CommandIds.RecCheckInDelete;
			})
		).toBeFalsy();
	});

	it("save button disabled when command disabled", () => {
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(findMenuItem(wrapper, true).disabled).toBeTruthy();
	});

	it("new button is included", () => {
		const wrapper = makeWrapper(true, true, BaseObjectTypes.CheckinPlace, null);
		const farItems = wrapper.find(CommandBar).props().farItems;

		expect.assertions(1);

		expect(
			farItems.find((mi) => {
				return mi.key === "New";
			})
		).toBeTruthy();
	});
	//const farItems = wrapper.find(CommandBar).props().farItems;
	it("save button not disabled when command disabled", () => {
		const wrapper = makeWrapper();
		expect.assertions(1);

		expect(findMenuItem(wrapper, true).disabled).toBeFalsy();
	});

	it("opens in CM", async () => {
		const wrapper = makeWrapper();

		await flushPromises();
		const menuItem = findMenu(wrapper).items.find((mi) => {
			return mi.key === "Properties";
		});

		menuItem.onClick(null, menuItem);

		expect(testUri).toEqual(7);
		expect.assertions(1);
	});

	it("updates document info when file more called", async () => {
		isEmail = true;
		moreToFile = true;
		const wrapper = makeWrapper(false);

		await flushPromises();
		const menuItem = findMenu(wrapper).items.find((mi) => {
			return mi.key === "FileMore";
		});

		menuItem.onClick(null, menuItem);

		expect(appStore.PreservedUris).toEqual([7, 9]);
		expect.assertions(1);
	});

	it("call new for non Record", async () => {
		const wrapper = makeWrapper(true, BaseObjectTypes.CheckinPlace);

		await flushPromises();
		const menuItem = wrapper
			.find(CommandBar)
			.props()
			.farItems.find((mi) => {
				return mi.key === "New";
			});

		menuItem.onClick(null, menuItem);

		expect(testUri).toEqual(0);
		expect(completedCommand).toEqual("New");
		expect.assertions(2);
	});

	it("document related commands not shown(from list)", async () => {
		const wrapper = makeWrapper(true, true);
		wrapper.setProps({
			record: {
				Uri: 8,
				CommandDefs: [
					{
						IsEnabled: true,
						CommandId: "RecCheckIn",
						Tooltip: "",
						MenuItemType: "MenuItemCommand",
					},
					{
						IsEnabled: true,
						CommandId: "RecDocFinal",
						Tooltip: "",
						MenuItemType: "MenuItemCommand",
					},
				],
			},
		});
		expect.assertions(2);

		await flushPromises();
		expect(
			findMenu(wrapper, true).items.find((mp) => {
				return mp.key === "RecCheckIn";
			})
		).toBeFalsy();

		expect(
			findMenu(wrapper, true).items.find((mp) => {
				return mp.key === "RecDocFinal";
			})
		).toBeFalsy();
	});
});
