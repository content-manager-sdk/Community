import * as React from "react";
import IAppStore from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import { ErrorDisplay } from "./ErrorDisplay";
import MainApp from "./MainApp";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import { TrimSearchDialog } from "./TrimSearchDialog/TrimSearchDialog";
import { BaseObjectTypes } from "../../src/trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "src/trim-coms/trim-connector";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

interface IProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
}

export class BootStrap extends React.Component<IProps, { dialogName: string }> {
	constructor(props: IProps) {
		super(props);
		//functionfile
		if (window.location.search.indexOf("searchdialog") > -1) {
			this.state = { dialogName: "/searchdialog" };
		} else {
			this.state = { dialogName: "" };
		}
	}

	componentDidMount() {
		const { appStore } = this.props;
		const { dialogName } = this.state;
		Office.initialize = function(reason) {
			appStore!.fetchBaseSettingFromTrim(dialogName === "/searchdialog");
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
		} else if (this.state.dialogName === "/searchdialog") {
			return (
				<TrimSearchDialog
					trimType={BaseObjectTypes.Record}
					trimConnector={trimConnector}
					startPoint="RecentDocs"
				/>
			);
		} else if (appStore!.status !== "STARTING") {
			return <MainApp className="trim-main" />;
		} else if (appStore!.status === "STARTING") {
			return <Spinner size={SpinnerSize.large} />;
		} else {
			return <h1>{appStore!.status}</h1>; // <Samples />;
		}
	}
}

export default inject("appStore", "trimConnector")(observer(BootStrap));
