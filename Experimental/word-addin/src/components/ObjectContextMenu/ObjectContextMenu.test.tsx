//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ObjectContextMenu } from "./ObjectContextMenu";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import TrimConnector, {
	IDriveInformation,
	IObjectDetails,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";
import { CommandIds } from "../../trim-coms/trim-command-ids";
import {
	ContextualMenuItemType,
	IContextualMenuProps,
	IContextualMenuItem,
} from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandBar } from "office-ui-fabric-react";

describe("Object Context Menu", () => {
	let checkinUri = 0;
	let favUri = 0;
	let finalizeUri = 0;
	let updatedDocumentInfo;
	let insertedText = "";
	let insertedUrl = "";
	let testError = "";
	let testUri = 0;
	let setForOptionsSet = "";
	let completedCommand = "";
	const returnedDocumentInfo = {
		Id: "test-id",
		Uri: 5,
		CommandDefs: [],
	};

	const makeWrapper = (
		menuItemsEnabled: boolean = true,
		isInList: boolean = false
	) => {
		return shallow<ObjectContextMenu>(
			<ObjectContextMenu
				isInList={isInList}
				onCommandComplete={(key: string) => {
					completedCommand = key;
				}}
				appStore={{
					setError: function(message: any) {
						testError = message;
					},
					setErrorMessage: function(message) {
						testError = message;
					},
					setDocumentInfo: (documentInfo) => {
						updatedDocumentInfo = documentInfo;
					},
					openInCM: function(uri: number) {
						testUri = uri;
					},
					setStatus: (status: string) => {},
					RecordUri: 7,
					Id: "my id",
					messages: {
						web_Actions: "Actions",
						web_Paste: "Paste",
						web_Please_Select: "Please select",
					},
					getWebClientUrl: (uri: number) => {
						return "link?uri=" + uri;
					},

					documentInfo: {
						Enums: {
							RecordRelationshipType: [{ Id: "Related", Caption: "Related" }],
						},
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
							{
								CommandId: "Properties",
								MenuEntryString: "Properties",
								Tooltip: "Properties",
								StatusBarMessage: "Properties",
								IsEnabled: menuItemsEnabled,
							},
						],
					},
				}}
				trimConnector={trimConnector}
				wordConnector={mockWordConnector}
				record={{
					Uri: 7,
					ToolTip: "test title",
					NameString: "REC_1",
				}}
			/>
		);
	};

	beforeEach(() => {
		checkinUri = 0;
		favUri = 0;
		finalizeUri = 0;
		updatedDocumentInfo = null;
		insertedText = "";
		insertedUrl = "";
		testError = "";
		testUri = 0;
		setForOptionsSet = "";
		completedCommand = "";
	});

	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	trimConnector.getObjectDefinitions = function() {
		return new Promise((resolve) => {
			resolve([{ Id: "Record", Caption: "Record" }]);
		});
	}.bind(trimConnector);

	trimConnector.getGlobalUserOptions = function(forOptionsSet) {
		setForOptionsSet = forOptionsSet;

		return new Promise((resolve) => {
			resolve();
		});
	}.bind(trimConnector);

	trimConnector.runAction = function(
		commandId: CommandIds,
		uri: number
	): Promise<IDriveInformation> {
		if (commandId === CommandIds.AddToFavorites) {
			favUri = uri;
		} else if (commandId === CommandIds.RecCheckIn) {
			checkinUri = uri;
		} else {
			finalizeUri = uri;
		}
		return new Promise(function(resolve) {
			resolve(returnedDocumentInfo);
		});
	}.bind(trimConnector);

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
		insertText(textToInsert) {
			insertedText = textToInsert;
		},
		insertLink(text, url) {
			insertedText = text;
			insertedUrl = url;
		},
	};

	const findMenuItem = (
		wrapper: shallow<ObjectContextMenu>,
		getFirstItem?: boolean
	): IContextualMenuItem => {
		return wrapper.find(CommandBar).props().farItems[getFirstItem ? 0 : 2];
	};

	const findMenu = (
		wrapper: shallow<ObjectContextMenu>,
		getFirstItem?: boolean
	): IContextualMenuProps => {
		return findMenuItem(wrapper, getFirstItem).subMenuProps;
	};

	it("contains an action button", function(this: any) {
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

	it("contains paste and split", function(this: any) {
		expect.assertions(3);
		const wrapper = makeWrapper();

		expect(findMenu(wrapper).items[0].key).toEqual("paste");
		expect(findMenu(wrapper).items[0].text).toEqual("Paste");
		expect(findMenu(wrapper).items[1].itemType).toEqual(
			ContextualMenuItemType.Divider
		);
	});

	it("contain add relationship", function(this: any) {
		expect.assertions(1);
		const wrapper = makeWrapper(true, true);

		expect(
			findMenu(wrapper, true).items.find((menuItem) => {
				return menuItem.key === "addRelationshipto";
			})
		).toBeTruthy();
	});

	it("not contain add relationship", function(this: any) {
		expect.assertions(1);
		const wrapper = makeWrapper(true, false);

		expect(
			findMenu(wrapper).items.find((menuItem) => {
				return menuItem.key === "addRelationshipto";
			})
		).toBeUndefined();
	});

	it("error when record not selected", (done) => {
		const wrapper = makeWrapper(true, false);
		wrapper.setProps({ record: { Uri: 0 } });

		const menuItem = findMenu(wrapper)
			.items.find((mp) => {
				return mp.key === "paste";
			})
			.subMenuProps.items.find((sm) => {
				return sm.key === "pasteTitle";
			});
		menuItem.onClick(null, menuItem);
		setImmediate(() => {
			try {
				expect(testError).toEqual("bob_needSelectedRow");
				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("error on create relationship when record not selected", (done) => {
		const wrapper = makeWrapper(true, true);

		wrapper.setProps({ record: { Uri: 0 } });

		const menuItem = findMenu(wrapper, true).items.find((mi) => {
			return mi.key === "addRelationshipto";
		}).subMenuProps.items[0];

		menuItem.onClick(null, menuItem);
		setImmediate(() => {
			try {
				expect(testError).toEqual("bob_needSelectedRow");
				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls insert text when paste clicked", (done) => {
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

		setImmediate(() => {
			try {
				expect(insertedText).toEqual("test title");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls insert text when paste number", (done) => {
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

		setImmediate(() => {
			try {
				expect(insertedText).toEqual("REC_1");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls insert link when paste clicked", (done) => {
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

		setImmediate(() => {
			try {
				expect(insertedText).toEqual("REC_1");
				expect(insertedUrl).toEqual("link?uri=7");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls favorite when checkin button clicked (from list)", async (done) => {
		const wrapper = makeWrapper(true, true);
		wrapper.setProps({
			record: {
				Uri: 8,
				CommandDefs: [
					{
						IsEnabled: true,
						CommandId: "AddToFavorites",
						Tooltip: "Add To Favorites",
						MenuItemType: "MenuItemCommand",
					},
				],
			},
		});
		expect.assertions(3);
		const menuItem = findMenu(wrapper, true).items.find((mp) => {
			return mp.key === "AddToFavorites";
		});

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(favUri).toEqual(8);
				expect(checkinUri).toEqual(0);
				expect(finalizeUri).toEqual(0);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls checkin when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "RecCheckIn";
		});

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

	it("calls get global when get global button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "getGlobalProperties";
		});

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(setForOptionsSet).toEqual("ViewPane");
				expect(completedCommand).toEqual("getGlobalProperties");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("calls finalize when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "RecDocFinal";
		});

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
			findMenu(wrapper).items.find((mp) => {
				return mp.key === "RecDocFinal";
			}).disabled
		).toBeTruthy();
	});

	it("save button disabled when command disabled", () => {
		const wrapper = makeWrapper(false);
		expect.assertions(1);

		expect(findMenuItem(wrapper, true).disabled).toBeTruthy();
	});

	it("save button not disabled when command disabled", () => {
		const wrapper = makeWrapper();
		expect.assertions(1);

		expect(findMenuItem(wrapper, true).disabled).toBeFalsy();
	});

	it("sets the state after an action", (done) => {
		const wrapper = makeWrapper();

		expect.assertions(1);
		const menuItem = findMenu(wrapper).items.find((mp) => {
			return mp.key === "RecDocFinal";
		});

		menuItem.onClick(null, menuItem);

		setImmediate(() => {
			try {
				expect(wrapper.state().commandDefs).toEqual(
					returnedDocumentInfo.CommandDefs
				);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("opens in CM", (done) => {
		const wrapper = makeWrapper();

		setImmediate(() => {
			try {
				const menuItem = findMenu(wrapper).items.find((mi) => {
					return mi.key === "Properties";
				});

				menuItem.onClick(null, menuItem);

				expect(testUri).toEqual(7);
				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("document related commands not shown(from list)", async (done) => {
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

		setImmediate(() => {
			try {
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

				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
