import * as React from "react";
//import { IAppStore } from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import ErrorDisplay from "./ErrorDisplay";
import MainApp from "./MainApp";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import { TrimSearchDialog } from "./TrimSearchDialog/TrimSearchDialog";
import { BaseObjectTypes } from "../../src/trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "src/trim-coms/trim-connector";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { IAppStore } from "src/stores/AppStore";

interface IProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
}

export class BootStrap extends React.Component<
	IProps,
	{ dialogName: string; filter: string }
> {
	constructor(props: IProps) {
		super(props);

		let filter = "";
		try {
			const params = new URLSearchParams(window.location.search);
			filter = params.get("filter") || "";
		} catch {
			// I only have this try/catch to make the tests work
		}

		if (window.location.search.indexOf("searchdialog") > -1) {
			this.state = { dialogName: "/searchdialog", filter: filter };
		} else {
			this.state = { dialogName: "", filter: filter };
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

		return (
			<div>
				{appStore!.status === "ERROR" && <ErrorDisplay />}

				{this.state.dialogName === "/searchdialog" ? (
					<TrimSearchDialog
						trimType={BaseObjectTypes.Record}
						trimConnector={trimConnector}
						startPoint="RecentDocs"
						appStore={appStore}
						filterSearch={this.state.filter}
					/>
				) : (
					<React.Fragment>
						{appStore!.status === "STARTING" && (
							<Spinner size={SpinnerSize.large} />
						)}
						<MainApp className="trim-main" />
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(BootStrap));
