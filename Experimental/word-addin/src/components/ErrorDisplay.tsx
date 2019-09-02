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
import { TeachingBubble } from "office-ui-fabric-react/lib/TeachingBubble";

initializeIcons();

export class ErrorDisplay extends React.Component<
	{ appStore?: any },
	{ isDetailVisble: boolean }
> {
	constructor(props: {}) {
		super(props);

		this._onDismiss = this._onDismiss.bind(this);
		this._onShow = this._onShow.bind(this);

		this.state = { isDetailVisble: false };
	}

	private _menuButtonElement: HTMLElement;

	private _closeDialog = (): void => {
		const { appStore } = this.props;

		appStore!.resetError();
		// 	this.setState({ hideDialog: true });
	};

	private _onShow(ev: any): void {
		this.setState({
			isDetailVisble: true,
		});
	}

	private _onDismiss(ev: any): void {
		this.setState({
			isDetailVisble: false,
		});
	}

	public render() {
		const { appStore } = this.props;
		const { isDetailVisble } = this.state;

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
						<div className="ms-Grid-row">
							{isDetailVisble && (
								<TeachingBubble
									targetElement={this._menuButtonElement}
									headline="Error Details"
								>
									{JSON.stringify(appStore!.errorBody, null, "\t")}
								</TeachingBubble>
							)}
						</div>
					</div>
				</div>

				<DialogFooter>
					{appStore!.errorBody && (
						<span
							className="ms-TeachingBubbleBasicExample-buttonArea"
							ref={(menuButton) => (this._menuButtonElement = menuButton!)}
						>
							<DefaultButton
								onClick={isDetailVisble ? this._onDismiss : this._onShow}
								text="Details"
							/>
						</span>
					)}
					<DefaultButton onClick={this._closeDialog} text="OK" />
				</DialogFooter>
			</Dialog>
		);
	}
}
export default inject("appStore")(observer(ErrorDisplay));
