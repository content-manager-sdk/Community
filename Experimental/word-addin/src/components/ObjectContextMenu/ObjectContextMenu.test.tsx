//import * as enzyme from "enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ObjectContextMenu } from "./ObjectContextMenu";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import {
	IDriveInformation,
	IObjectDetails,
} from "../../trim-coms/trim-connector";
import { CommandIds } from "../../trim-coms/trim-command-ids";
import { ContextualMenuItemType } from "office-ui-fabric-react/lib/ContextualMenu";

describe("Object Context Menu", () => {
	let checkinUri = 0;
	let finalizeUri = 0;
	let updatedDocumentInfo;
	let insertedText = "";
	let insertedUrl = "";
	const returnedDocumentInfo = {
		Id: "test-id",
		Uri: 5,
		CommandDefs: [],
	};

	const makeWrapper = (menuItemsEnabled: boolean = true) => {
		return shallow<ObjectContextMenu>(
			<ObjectContextMenu
				appStore={{
					setDocumentInfo: (documentInfo) => {
						updatedDocumentInfo = documentInfo;
					},
					setStatus: (status: string) => {},
					RecordUri: 7,
					Id: "my id",
					messages: {
						web_Actions: "Actions",
						web_Paste: "Paste",
					},
					getWebClientUrl: (uri: number) => {
						return "link?uri=" + uri;
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
				record={{ Uri: 7, ToolTip: "test title", NameString: "REC_1" }}
			/>
		);
	};

	beforeEach(() => {
		checkinUri = 0;
		finalizeUri = 0;
		updatedDocumentInfo = null;
		insertedText = "";
		insertedUrl = "";
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
		insertText(textToInsert) {
			insertedText = textToInsert;
		},
		insertLink(text, url) {
			insertedText = text;
			insertedUrl = url;
		},
	};

	it("contains an action button", function(this: any) {
		expect.assertions(9);
		const wrapper = makeWrapper();
		expect(wrapper.find(IconButton).exists()).toBeTruthy();
		expect(wrapper.find(IconButton).props().menuProps.items.length).toEqual(4);
		expect(wrapper.find(IconButton).props().menuProps.items[2].text).toEqual(
			"Checkin"
		);

		const makeFinalItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mi) => {
				return mi.key === "RecDocFinal";
			});

		expect(makeFinalItem.text).toEqual("Make Final");

		expect(makeFinalItem.disabled).toBeFalsy();

		expect(wrapper.find(IconButton).props().split).toBeTruthy();
		expect(wrapper.find(IconButton).props().primary).toBeTruthy();
		expect(wrapper.find(IconButton).props().text).toBeUndefined();
		expect(wrapper.find(IconButton).props().iconProps).toEqual({
			iconName: "GlobalNavButton",
		});
	});

	it("contain paste and split", function(this: any) {
		expect.assertions(3);
		const wrapper = makeWrapper();

		expect(wrapper.find(IconButton).props().menuProps.items[0].key).toEqual(
			"paste"
		);
		expect(wrapper.find(IconButton).props().menuProps.items[0].text).toEqual(
			"Paste"
		);
		expect(
			wrapper.find(IconButton).props().menuProps.items[1].itemType
		).toEqual(ContextualMenuItemType.Divider);
	});

	it("calls insert text when paste clicked", (done) => {
		const wrapper = makeWrapper(false);

		expect.assertions(1);
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
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
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
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
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
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

	it("calls checkin when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
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

	it("calls finalize when checkin button clicked", async (done) => {
		const wrapper = makeWrapper();

		expect.assertions(2);
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
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
			wrapper
				.find(IconButton)
				.props()
				.menuProps.items.find((mp) => {
					return mp.key === "RecDocFinal";
				}).disabled
		).toBeTruthy();
	});

	it("sets the documentInfo on state after an action", (done) => {
		const wrapper = makeWrapper();

		expect.assertions(1);
		const menuItem = wrapper
			.find(IconButton)
			.props()
			.menuProps.items.find((mp) => {
				return mp.key === "RecDocFinal";
			});

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
