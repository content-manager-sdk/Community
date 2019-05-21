import * as React from "react";
import { inject, observer } from "mobx-react";
import DetailsView from "./DetailsView";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { ITrimConnector, ICommandDef } from "src/trim-coms/trim-connector";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandIds } from "../trim-coms/trim-command-ids";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import { IWordConnector } from "src/office-coms/word-connector";

export class ExistingRecord extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	},
	{ menuMessage: string }
> {
	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	}) {
		super(props);

		this.state = { menuMessage: "" };
	}

	private _onActionclickClick = (
		evt: React.MouseEvent<HTMLElement>,
		item: IContextualMenuItem
	) => {
		const { trimConnector, wordConnector, appStore } = this.props;
		if (item.key === "Properties") {
			open(`https://localhost/cm?uri=${appStore.documentInfo.Uri}`, "_blank");
		} else {
			const me = this;
			wordConnector!.saveDocument().then(() => {
				const runAction = (fileName: string) => {
					trimConnector!
						.runAction(
							item.key as CommandIds,
							appStore!.RecordUri,
							fileName,
							wordConnector!.getWebUrl()
						)
						.then((data) => {
							appStore.setDocumentInfo(data);
							me.setState({
								menuMessage: `Action completed successfuly '${item.text}'.`,
							});
							setTimeout(function() {
								me._dismissMessage();
							}, 3000);
						});
				};
				console.log("11111111111111111");
				if (item.key === "RecCheckIn") {
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
					text: commandDef.Tooltip,
					onClick: this._onActionclickClick,
					disabled: !commandDef.IsEnabled,
				};
			}
		);

		const { menuMessage } = this.state;
		return (
			<React.Fragment>
				<DefaultButton
					className="trim-action-button"
					primary
					split={true}
					text={appStore.messages.web_Actions}
					menuProps={{
						items: menuItems,
					}}
				/>
				{menuMessage && (
					<MessageBar onDismiss={this._dismissMessage}>
						{menuMessage}
					</MessageBar>
				)}
				<DetailsView />
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(ExistingRecord)
);
