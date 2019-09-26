import * as React from "react";
import { inject, observer } from "mobx-react";
import DetailsView from "./DetailsView";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { ITrimConnector, ICommandDef } from "src/trim-coms/trim-connector";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandIds } from "../trim-coms/trim-command-ids";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import { IWordConnector } from "../office-coms/word-connector";
import {
	Pivot,
	PivotItem,
	PivotLinkFormat,
	PivotLinkSize,
} from "office-ui-fabric-react/lib/Pivot";
import LinkComposer from "./LinkComposer/LinkComposer";
import ContextList from "./ContextList/ContextList";

export class ExistingRecord extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		className?: string;
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
			appStore.openInCM(appStore.documentInfo.Uri);
		} else {
			appStore.setStatus("STARTING");
			const me = this;
			wordConnector!.saveDocument().then(() => {
				const runAction = (fileName: string) => {
					trimConnector!
						.runAction(
							item.key as CommandIds,
							appStore!.RecordUri,
							fileName,
							appStore!.WebUrl
						)
						.then((data) => {
							appStore.setDocumentInfo(data);
							me.setState({
								menuMessage: `Action completed successfuly '${item.text}'.`,
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
		const { appStore, className } = this.props;
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
			<div className={className}>
				<Pivot
					linkFormat={PivotLinkFormat.tabs}
					linkSize={PivotLinkSize.normal}
				>
					<PivotItem headerText="Properties" key={1}>
						<hr />
						<div>
							<IconButton
								className="trim-action-button"
								primary
								split={true}
								iconProps={{ iconName: "CollapseMenu" }}
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
						</div>
					</PivotItem>
					<PivotItem headerText="Context" key={2}>
						<hr />
						<ContextList />
					</PivotItem>
				</Pivot>
			</div>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(ExistingRecord)
);
