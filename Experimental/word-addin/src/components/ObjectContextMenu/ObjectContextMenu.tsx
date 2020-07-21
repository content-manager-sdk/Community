import * as React from "react";
import { inject, observer } from "mobx-react";

import {
	ITrimConnector,
	ICommandDef,
	ITrimMainObject,
	IEnumDetails,
} from "src/trim-coms/trim-connector";
import {
	IContextualMenuItem,
	ContextualMenuItemType,
} from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandIds } from "../../trim-coms/trim-command-ids";

import { IOfficeConnector } from "../../office-coms/office-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { CommandBar } from "office-ui-fabric-react";

interface IContextMenuProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	record: ITrimMainObject;
	isInList: boolean;
	onCommandComplete?: (commandKey: string) => void;
	trimType: BaseObjectTypes;
	showCloseIcon?: boolean;
	pageTitle?: string;
	showViewPane?: boolean;
}

interface IContextMenuState {
	menuMessage: string;
	items: IContextualMenuItem[];
}

export class ObjectContextMenu extends React.Component<
	IContextMenuProps,
	IContextMenuState
> {
	constructor(props: IContextMenuProps) {
		super(props);

		if (!this.props.isInList) {
			this.state = {
				menuMessage: "",
				items: [],
			};
		} else {
			this.state = { menuMessage: "", items: [] };
		}
	}

	async componentDidMount() {
		this.loadMenu();
	}

	async componentDidUpdate(
		prevProps: IContextMenuProps,
		prevState: IContextMenuState
	) {
		const { record } = this.props;

		if (record && record.Uri > 0) {
			const prevUri = prevProps.record ? prevProps.record.Uri : 0;
			if (
				(record && prevUri != record.Uri) ||
				prevProps.showViewPane !== this.props.showViewPane
			) {
				this.loadMenu();
			}
		}
	}

	private async updateIsEnabled(menuItems: ICommandDef[]) {
		const { record, trimConnector, trimType } = this.props;

		if (record && record.Uri > 0) {
			const enabledCommandIds = await trimConnector!.getEnabledCommandIds(
				trimType,
				record.Uri
			);

			menuItems.forEach((menuItem) => {
				menuItem.IsEnabled = (enabledCommandIds || []).includes(
					menuItem.CommandId
				);
			});
		}
	}

	private async loadMenu(
		prevProps?: IContextMenuProps,
		prevState?: IContextMenuState
	) {
		const { trimConnector, trimType } = this.props;

		const menuItems = await trimConnector!.getMenuItemsForList(trimType);
		//if (record) {
		await this.updateIsEnabled(menuItems);
		//}
		this.getFarItems(menuItems);
	}

	private callCommandComplete(key: string): void {
		const { onCommandComplete } = this.props;

		if (onCommandComplete) {
			onCommandComplete(key);
		}
	}

	private _onActionClick = (
		evt: React.MouseEvent<HTMLElement>,
		item: IContextualMenuItem
	) => {
		const {
			trimConnector,
			wordConnector,
			appStore,
			record,
			isInList,
			trimType,
		} = this.props;

		if (record.Uri < 1 && item.key !== "New") {
			trimConnector!
				.getObjectCaption(BaseObjectTypes.Record)
				.then((caption) => {
					appStore.setErrorMessage(
						"bob_needSelectedRow",
						caption.toLowerCase()
					);
				});
		} else {
			if (item.key === "FileMore") {
				appStore!.clearUris();
				this.callCommandComplete(item.key);
			} else if (item.key === "pasteLink") {
				const url = appStore.getWebClientUrl(record.Uri);
				wordConnector!.insertLink(record.NameString!, url);
				this.callCommandComplete(item.key);
			} else if (item.key === "pasteNumber") {
				wordConnector!.insertText(record.NameString!);
				this.callCommandComplete(item.key);
			} else if (item.key === "pasteTitle") {
				wordConnector!.insertText(record.ToolTip!);
				this.callCommandComplete(item.key);
			} else if (item.key === "Properties") {
				if (!isInList) {
					appStore.openInCM(record.Uri);
				}
				this.callCommandComplete(item.key);
			} else if (item.key === "getGlobalProperties") {
				appStore.setSpinning(true);

				trimConnector!.setGlobalUserOptions("ViewPane").then((data) => {
					this.callCommandComplete(item.key);
					appStore.setSpinning(false);
				});
			} else if (item.data && item.data.NeedsAnObject) {
				appStore.setSpinning(true);
				const me = this;
				wordConnector!.saveDocument().then(() => {
					const runAction = (fileName: string) => {
						trimConnector!
							.runAction(
								item.key as CommandIds,
								record.Uri,
								fileName,
								appStore!.WebUrl,
								trimType
							)
							.then(async (data) => {
								me.setState(
									{
										menuMessage: `Action completed successfully '${item.text}'.`,
									},
									() => {
										this.loadMenu();
									}
								);
								setTimeout(function () {
									me._dismissMessage();
								}, 3000);
								this.callCommandComplete(item.key);
								appStore.setSpinning(false);
							});
					};

					if (item.key === CommandIds.RecCheckIn) {
						wordConnector!
							.getDocumentData((data: number[], fileName: string) => {
								return trimConnector!.writeFileSlice(
									data,
									fileName,
									wordConnector!.getExtension()
								);
							})
							.then((fileName) => {
								runAction(fileName);
							})
							.catch((e) => {
								appStore.setError(e);
							});
					} else {
						runAction("");
					}
				});
			} else {
				this.callCommandComplete(item.key);
			}
		}
	};

	private _dismissMessage = () => {
		this.setState({ menuMessage: "" });
	};

	private async _makeRelationshipMenu() {
		const { trimConnector, record, appStore } = this.props;
		const relationshipEnums: IEnumDetails[] = await trimConnector!.getEnum(
			"RecordRelationshipType"
		);

		return {
			key: "addRelationshipto",
			text: appStore.messages.web_Add_Relationship,
			title: appStore.messages.web_Add_RelationshipTitle,
			subMenuProps: {
				items: relationshipEnums.map((rel: IEnumDetails) => {
					return {
						key: rel.Name,
						text: rel.Caption,
						onClick: () => {
							if (record.Uri < 1) {
								trimConnector!
									.getObjectCaption(BaseObjectTypes.Record)
									.then((caption) => {
										appStore.setErrorMessage(
											"bob_needSelectedRow",
											caption.toLowerCase()
										);
									});
							} else {
								appStore.setSpinning(true);
								trimConnector!
									.createRelationship(appStore.RecordUri, record.Uri, rel.Name)
									.then(() => {
										appStore.setSpinning(false);
									})
									.catch((error) => {
										appStore.setError(error);
									});
							}
						},
					};
				}),
			},
		};
	}

	private isSaveCommand(key: string): boolean {
		return ["RecCheckIn", "RecDocFinal"].includes(key);
	}

	getMenuItemLabel(commandDef: ICommandDef): string {
		const { appStore, trimType } = this.props;
		const lbl = {
			"Record-Properties": appStore.messages.web_GoToCM,
			"CheckinPlace-New": appStore.messages.web_NewLinkedFolder,
		}[`${trimType}-${commandDef.CommandId}`];

		return lbl || commandDef.Tooltip;
	}

	getFarItems = async (commandDefs: ICommandDef[]): Promise<void> => {
		const {
			appStore,
			isInList,
			record,
			trimType,
			showCloseIcon,
			showViewPane,
		} = this.props;

		let checkinMenuItem: IContextualMenuItem | undefined;

		if (!record) {
			this.setState({ items: [] });
			return Promise.resolve();
		}

		const menuItems = (commandDefs || [])
			.filter((commandDef: ICommandDef) => {
				if (!isInList) {
					if (appStore.isEmail() && commandDef.CommandId === "RecCheckIn") {
						return false;
					}
					return true;
				}

				return !this.isSaveCommand(commandDef.CommandId);
			})
			.map<IContextualMenuItem>((commandDef: ICommandDef) => {
				const menuItem = {
					key: commandDef.CommandId,
					text: this.getMenuItemLabel(commandDef),
					onClick: this._onActionClick,
					disabled: !commandDef.IsEnabled,
					data: commandDef,
				};

				if (commandDef.CommandId === "RecCheckIn") {
					checkinMenuItem = menuItem;
				}
				return menuItem;
			});

		if (trimType === BaseObjectTypes.Record && appStore.isOffice()) {
			menuItems.unshift(
				{
					key: "paste",
					text: appStore.messages.web_Paste,
					subMenuProps: {
						items: [
							{
								key: "pasteTitle",
								text: appStore.messages.web_Paste_Title,
								onClick: this._onActionClick,
							},
							{
								key: "pasteNumber",
								text: appStore.messages.web_Paste_Number,
								onClick: this._onActionClick,
							},
							{
								key: "pasteLink",
								text: appStore.messages.web_Paste_Link,
								onClick: this._onActionClick,
							},
						],
					},
				},
				{ key: "divider_1", itemType: ContextualMenuItemType.Divider }
			);
		}

		if (isInList) {
			if (trimType === BaseObjectTypes.Record) {
				const items = await this._makeRelationshipMenu();
				menuItems.push(items);
			}
		} else if (appStore.isOffice() || appStore.isEmail()) {
			const checkinItem = menuItems.find((mi) => mi.key === "RecCheckIn");

			const msgText = record.ExternalEditingComplete
				? appStore.messages.web_disableCheckinOnClose
				: appStore.messages.web_checkinOnClose;
			if (checkinItem) {
				let checkinDelete = { ...checkinItem };
				checkinDelete.key = record.ExternalEditingComplete
					? CommandIds.RecUndoCheckInDelete
					: CommandIds.RecCheckInDelete;
				checkinDelete.text = msgText;
				menuItems.splice(menuItems.indexOf(checkinItem) + 1, 0, checkinDelete);
			}

			menuItems.push({
				key: "getGlobalProperties",
				text: appStore.messages.web_Get_Global_View_Pane,
				onClick: this._onActionClick,
			});

			if (!isInList) {
				menuItems.push({
					key: "edit",
					text: appStore.messages.web_EditTrimObject,
					onClick: this._onActionClick,
					data: {},
				});

				if (appStore!.moreToFile()) {
					menuItems.push({
						key: "FileMore",
						text: appStore!.messages.web_fileMore,
						onClick: this._onActionClick,
					});
				}
			}
		}

		const items: IContextualMenuItem[] = [];

		if (appStore.isWebApp()) {
			items.push({
				key: "viewpane",
				iconProps: {
					iconName: showViewPane ? "ClosePane" : "OpenPane",
				},
				iconOnly: true,
				onClick: this._onActionClick,
			});
		}

		if (!isInList && appStore.isOffice()) {
			if (checkinMenuItem) {
				checkinMenuItem.iconProps = { iconName: "Save" };
				checkinMenuItem.iconOnly = true;
				items.push(checkinMenuItem);

				items.push({
					iconProps: {
						iconName: record.ExternalEditingComplete ? "OpenFile" : "FileBug",
					},
					key: record.ExternalEditingComplete
						? CommandIds.RecUndoCheckInDelete
						: CommandIds.RecCheckInDelete,
					name: record.ExternalEditingComplete
						? appStore.messages.web_disableCheckinOnClose
						: appStore.messages.web_checkinOnClose,
					iconOnly: true,
					data: { NeedsAnObject: true },
					disabled: checkinMenuItem.disabled,
					onClick: this._onActionClick,
				});
			}
		}

		if (trimType === BaseObjectTypes.CheckinPlace) {
			items.push({
				iconProps: {
					iconName: "NewFolder",
				},
				key: "New",
				name: appStore.messages.web_NewLinkedFolder,
				iconOnly: true,
				onClick: this._onActionClick,
				data: { NeedsAnObject: false },
			});
		}
		items.push({
			key: "moreActions",
			name: appStore!.messages.web_Menu,
			iconOnly: true,
			subMenuProps: { items: menuItems },
		});

		if (showCloseIcon) {
			items.push({
				key: "close",
				name: appStore!.messages.web_Close,
				iconOnly: true,
				iconProps: {
					iconName: "Cancel",
				},
				onClick: this._onActionClick,
			});
		}

		this.setState({ items });

		return Promise.resolve();
	};

	private renderTitle(item: any): React.ReactNode {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
			>
				<div className="ms-fontWeight-semibold">{item.text}</div>
			</div>
		);
	}

	public render() {
		const { items } = this.state;
		const { pageTitle } = this.props;

		const titleItems = [];

		if (pageTitle) {
			titleItems.push({
				key: "title",
				text: pageTitle,
				onRender: this.renderTitle,
			});
		}
		//this.loadMenu();
		return <CommandBar items={titleItems} farItems={items} />;
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(ObjectContextMenu));
