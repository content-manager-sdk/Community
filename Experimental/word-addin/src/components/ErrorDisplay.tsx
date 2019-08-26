import * as React from "react";
import "./ErrorDisplay.css";
import { initializeIcons } from "@uifabric/icons";

import { inject, observer } from "mobx-react";
import {
	Icon,
	DefaultButton,
	Dialog,
	DialogFooter,
	DialogType,
} from "office-ui-fabric-react";

initializeIcons();

export class ErrorDisplay extends React.Component<{ appStore?: any }, any> {
	private _closeDialog = (): void => {
		const { appStore } = this.props;

		appStore!.resetError();
		// 	this.setState({ hideDialog: true });
	};

	public render() {
		const { appStore } = this.props;

		return (
			<Dialog
				hidden={false}
				onDismiss={this._closeDialog}
				dialogContentProps={{
					type: DialogType.normal,
					title: appStore!.messages.web_HPRM,
				}}
				modalProps={{
					isBlocking: true,
					styles: { main: { maxWidth: 450 } },
				}}
			>
				<div>
					<div className="ms-Grid" dir="ltr">
						<div className="ms-Grid-row">
							<div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">
								<Icon iconName="Error" className="trim-error" />
							</div>
							<div className="trim-error-message ms-Grid-col ms-sm11 ms-md11 ms-lg11">
								{appStore!.errorMessage}
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<DefaultButton onClick={this._closeDialog} text="OK" />
				</DialogFooter>
			</Dialog>
		);
	}
}
export default inject("appStore")(observer(ErrorDisplay));
