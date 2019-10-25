import * as React from "react";
import { inject, observer } from "mobx-react";

import { IconButton } from "office-ui-fabric-react/lib/Button";
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

import { IWordConnector } from "../../office-coms/word-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

interface IContextMenuProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IWordConnector;
	record: ITrimMainObject;
	isInList: boolean;
	onCommandComplete?: (commandKey: string) => void;
}

export class ObjectContextMenu extends React.Component<
	IContextMenuProps,
	{ menuMessage: string; commandDefs: ICommandDef[] }
> {
	constructor(props: IContextMenuProps) {
		super(props);

		if (!this.props.isInList) {
			this.state = {
				menuMessage: "",
				commandDefs: props.appStore!.documentInfo.CommandDefs,
			};
		} else {
			this.state = { menuMessage: "", commandDefs: [] };
		}
	}

	componentDidUpdate(prevProps: IContextMenuProps) {
		const { isInList, record } = this.props;

		if (isInList) {
			if (prevProps.record.Uri != record.Uri) {
				this.setState({ commandDefs: record.CommandDefs! });
			}
		}
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
		const { trimConnector, wordConnector, appStore, record } = this.props;
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
			if (item.key === "pasteLink") {
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
				appStore.openInCM(record.Uri);
				this.callCommandComplete(item.key);
			} else if (item.key === "getGlobalProperties") {
				appStore.setStatus("STARTING");

				trimConnector!.getGlobalUserOptions("ViewPane").then((data) => {
					this.callCommandComplete(item.key);
					appStore.setStatus("WAITING");
				});
			} else {
				appStore.setStatus("STARTING");
				const me = this;
				wordConnector!.saveDocument().then(() => {
					const runAction = (fileName: string) => {
						trimConnector!
							.runAction(
								item.key as CommandIds,
								record.Uri,
								fileName,
								appStore!.WebUrl
							)
							.then((data) => {
								me.setState({
									menuMessage: `Action completed successfully '${item.text}'.`,
									commandDefs: data.CommandDefs,
								});
								setTimeout(function() {
									me._dismissMessage();
								}, 3000);
								this.callCommandComplete(item.key);
								appStore.setStatus("WAITING");
							});
					};

					if (item.key === CommandIds.RecCheckIn) {
						wordConnector!
							.getDocumentData((data: number[], fileName: string) => {
								return trimConnector!.writeFileSlice(data, fileName);
							})
							.then((fileName) => {
								runAction(fileName);
							});
					} else {
						runAction("");
					}
				});
			}
		}
	};

	private _dismissMessage = () => {
		this.setState({ menuMessage: "" });
	};

	private _makeRelationshipMenu() {
		const { trimConnector, record, appStore } = this.props;

		return {
			key: "addRelationshipto",
			text: appStore.messages.web_Add_Relationship,
			title: appStore.messages.web_Add_RelationshipTitle,
			subMenuProps: {
				items: appStore.documentInfo.Enums.RecordRelationshipType.map(
					(rel: IEnumDetails) => {
						return {
							key: rel.Id,
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
									appStore.setStatus("STARTING");
									trimConnector!
										.createRelationship(appStore.RecordUri, record.Uri, rel.Id)
										.then(() => {
											appStore.setStatus("WAITING");
										})
										.catch((error) => {
											appStore.setError(error);
										});
								}
							},
						};
					}
				),
			},
		};
	}

	public render() {
		const { appStore, isInList } = this.props;
		const { commandDefs } = this.state;

		const menuItems = (commandDefs || [])
			.filter((commandDef: ICommandDef) => {
				if (!isInList) {
					return true;
				}

				return !["RecCheckIn", "RecDocFinal"].includes(commandDef.CommandId);
			})
			.map<IContextualMenuItem>((commandDef: ICommandDef) => {
				return {
					key: commandDef.CommandId,
					text:
						commandDef.CommandId === "Properties"
							? appStore.messages.web_GoToCM
							: commandDef.Tooltip,
					onClick: this._onActionClick,
					disabled: !commandDef.IsEnabled,
				};
			});

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

		if (isInList) {
			menuItems.push(this._makeRelationshipMenu());
		} else {
			const checkinItem = menuItems.find((mi) => mi.key === "RecCheckIn");
			if (checkinItem) {
				let checkinDelete = { ...checkinItem };
				checkinDelete.key = "RecCheckInDelete";
				checkinDelete.text = "Check in and delete on close";
				menuItems.splice(menuItems.indexOf(checkinItem) + 1, 0, checkinDelete);
			}
			menuItems.push({
				key: "getGlobalProperties",
				text: appStore.messages.web_Get_Global_View_Pane,
				onClick: this._onActionClick,
			});
		}

		return (
			<IconButton
				className="trim-action-button"
				primary
				split={true}
				iconProps={{ iconName: "GlobalNavButton" }}
				menuProps={{
					items: menuItems,
				}}
			/>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(ObjectContextMenu)
);
