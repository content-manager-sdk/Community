import * as React from "react";
import { inject, observer } from "mobx-react";

import { IconButton } from "office-ui-fabric-react/lib/Button";
import {
	ITrimConnector,
	ICommandDef,
	ITrimMainObject,
} from "src/trim-coms/trim-connector";
import {
	IContextualMenuItem,
	ContextualMenuItemType,
} from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandIds } from "../../trim-coms/trim-command-ids";

import { IWordConnector } from "../../office-coms/word-connector";

export class ObjectContextMenu extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		record: ITrimMainObject;
	},
	{ menuMessage: string }
> {
	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		record: ITrimMainObject;
	}) {
		super(props);

		this.state = { menuMessage: "" };
	}

	private _onActionclickClick = (
		evt: React.MouseEvent<HTMLElement>,
		item: IContextualMenuItem
	) => {
		const { trimConnector, wordConnector, appStore, record } = this.props;
		if (item.key === "pasteLink") {
			const url = appStore.getWebClientUrl(record.Uri);
			wordConnector!.insertLink(record.NameString!, url);
		} else if (item.key === "pasteNumber") {
			wordConnector!.insertText(record.NameString!);
		} else if (item.key === "pasteTitle") {
			wordConnector!.insertText(record.ToolTip!);
		} else if (item.key === "Properties") {
			appStore.openInCM(appStore.documentInfo.Uri);
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
							appStore.setDocumentInfo(data);
							me.setState({
								menuMessage: `Action completed successfully '${item.text}'.`,
							});
							setTimeout(function() {
								me._dismissMessage();
							}, 3000);
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
	};

	private _dismissMessage = () => {
		this.setState({ menuMessage: "" });
	};

	public render() {
		const { appStore } = this.props;
		const menuItems = appStore.documentInfo.CommandDefs.map(
			(commandDef: ICommandDef) => {
				return {
					key: commandDef.CommandId,
					text:
						commandDef.CommandId === "Properties"
							? appStore.messages.web_GoToCM
							: commandDef.Tooltip,
					onClick: this._onActionclickClick,
					disabled: !commandDef.IsEnabled,
				};
			}
		);

		menuItems.unshift(
			{
				key: "paste",
				text: appStore.messages.web_Paste,
				subMenuProps: {
					items: [
						{
							key: "pasteTitle",
							text: appStore.messages.web_Paste_Title,
							onClick: this._onActionclickClick,
						},
						{
							key: "pasteNumber",
							text: appStore.messages.web_Paste_Number,
							onClick: this._onActionclickClick,
						},
						{
							key: "pasteLink",
							text: appStore.messages.web_Paste_Link,
							onClick: this._onActionclickClick,
						},
					],
				},
			},
			{ itemType: ContextualMenuItemType.Divider }
		);

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
