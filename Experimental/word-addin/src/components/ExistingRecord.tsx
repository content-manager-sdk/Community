import * as React from "react";
import { inject, observer } from "mobx-react";
import DetailsView from "./DetailsView";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { ITrimConnector, ICommandDef } from "src/trim-coms/trim-connector";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import { CommandIds } from "../trim-coms/trim-command-ids";

export class ExistingRecord extends React.Component<
	{ appStore?: any; trimConnector?: ITrimConnector },
	any
> {
	private _onActionclickClick = (
		evt: React.MouseEvent<HTMLElement>,
		item: IContextualMenuItem
	) => {
		const { trimConnector, appStore } = this.props;
		if (item.key === "Properties") {
			open(`https://localhost/cm?uri=${appStore.documentInfo.Uri}`, "_blank");
		} else {
			trimConnector!
				.runAction(item.key as CommandIds, appStore!.RecordUri)
				.then((data) => {
					appStore.setDocumentInfo(data);
				});
		}
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
				<DetailsView />
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(ExistingRecord));
