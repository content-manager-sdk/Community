import * as React from "react";
import IAppStore from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import { ErrorDisplay } from "./ErrorDisplay";
import MainApp from "./MainApp";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import { TrimSearchDialog } from "./TrimSearchDialog/TrimSearchDialog";
import BaseObjectTypes from "src/trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "src/trim-coms/trim-connector";

interface IProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
}

export class BootStrap extends React.Component<IProps, { dialogName: string }> {
	constructor(props: IProps) {
		super(props);

		const url: URL = new URL(window.location.href);

		this.state = { dialogName: url.pathname };
	}

	componentDidMount() {
		const { appStore } = this.props;
		Office.initialize = function(reason) {
			appStore!.fetchBaseSettingFromTrim();
		};
	}
	// private _onChange = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
	// 	const { wordConnector } = this.props;
	// 	wordConnector!.setAutoOpen(checked);
	// 	//console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
	// };
	public render() {
		const { appStore, trimConnector } = this.props;

		if (appStore!.status === "ERROR") {
			return <ErrorDisplay Message={appStore!.errorMessage} />;
		} else if (appStore!.status !== "STARTING") {
			if (this.state.dialogName === "/searchdialog") {
				return (
					<TrimSearchDialog
						trimType={BaseObjectTypes.Record}
						trimConnector={trimConnector}
						startPoint="RecentDocs"
					/>
				);
			} else {
				return <MainApp className="trim-main" />;
			}
		} else {
			return <h1>{appStore!.status}</h1>; // <Samples />;
		}
	}
}

export default inject("appStore", "trimConnector")(observer(BootStrap));
