import * as React from "react";
import IAppStore from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import { ErrorDisplay } from "./ErrorDisplay";
import MainApp from "./MainApp";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { IWordConnector } from "src/office-coms/word-connector";

export class BootStrap extends React.Component<
	{ appStore?: IAppStore; wordConnector?: IWordConnector },
	any
> {
	componentDidMount() {
		const { appStore } = this.props;
		Office.initialize = function(reason) {
			appStore!.fetchBaseSettingFromTrim();
		};
	}
	private _onChange = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
		const { wordConnector } = this.props;
		wordConnector!.setAutoOpen(checked);
		//console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
	};
	public render() {
		const { appStore, wordConnector } = this.props;

		if (appStore!.status === "ERROR") {
			return <ErrorDisplay Message={appStore!.errorMessage} />;
		} else if (appStore!.status !== "STARTING") {
			return (
				<React.Fragment>
					<MainApp className="trim-main" />

					<div className="trim-footer">
						<Toggle
							defaultChecked={wordConnector!.getAutoOpen()}
							label="Auto open"
							onText="On"
							offText="Off"
							onChange={this._onChange}
						/>
					</div>
				</React.Fragment>
			);
		}
		{
			return null;
		}
	}
}

export default inject("appStore", "wordConnector")(observer(BootStrap));
