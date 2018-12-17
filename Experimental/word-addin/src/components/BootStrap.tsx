import * as React from "react";
import IAppStore from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import { ErrorDisplay } from "./ErrorDisplay";
import MainApp from "./MainApp";

@inject("appStore")
@observer
export class BootStrap extends React.Component<{ appStore?: IAppStore }, any> {
	componentDidMount() {
		const { appStore } = this.props;
		appStore!.fetchBaseSettingFromTrim();
	}
	public render() {
		const { appStore } = this.props;

		if (appStore!.status === "ERROR") {
			return <ErrorDisplay Message={appStore!.errorMessage} />;
		} else if (appStore!.status !== "STARTING") {
			return <MainApp />;
		}
		{
			return null;
		}
	}
}

export default BootStrap;
