import * as React from "react";
//import { IAppStore } from "../stores/AppStore";
import { observer, Provider } from "mobx-react";
import ErrorDisplay from "../ErrorDisplay";
import MainApp from "../MainApp";
//import { BrowserRouter as Router, Route } from "react-router-dom";
import { TrimSearchDialog } from "../TrimSearchDialog/TrimSearchDialog";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { IAppStore } from "../../stores/AppStoreBase";

import { getQueryStringValue } from "../../utils/getQueryStringValue";
import { IOfficeConnector } from "../../office-coms/office-connector";
import TrimConnector, { ITrimConnector } from "../../trim-coms/trim-connector";

interface IProps {}

export class BootStrap extends React.Component<
	IProps,
	{ dialogName: string; filter: string; insertText: boolean }
> {
	constructor(props: IProps) {
		super(props);

		let filter = "";
		let insertText = false;
		try {
			filter = getQueryStringValue("filter") || "";
			insertText = getQueryStringValue("insert") ? true : false;
		} catch {
			// I only have this try/catch to make the tests work
		}

		if (window.location.search.indexOf("searchdialog") > -1) {
			this.state = {
				dialogName: "/searchdialog",
				filter: filter,
				insertText: insertText,
			};
		} else {
			this.state = { dialogName: "", filter: filter, insertText: false };
		}
	}

	private trimConnector = this.getTrimConnector();

	protected getTrimConnector(): ITrimConnector {
		if (!this.trimConnector) {
			this.trimConnector = new TrimConnector();
		}

		let getAccessToken: Promise<string>;

		this.trimConnector.credentialsResolver = (callback) => {
			const accessToken = getQueryStringValue("accessToken");

			if (accessToken) {
				callback(accessToken, "");
			} else {
				if (!getAccessToken) {
					getAccessToken = this.getOfficeConnector()!.getAccessToken();
				}
				getAccessToken
					.then((token) => callback(token, ""))
					.catch(function(error) {
						callback("", error.message);
					});
			}
		};

		return this.trimConnector;
	}

	protected getAppStore(): IAppStore {
		throw new Error("Method not implemented.");
	}

	protected getOfficeConnector(): IOfficeConnector {
		throw new Error("Method not implemented.");
	}

	componentDidMount() {
		const appStore = this.getAppStore();
		const wordConnector = this.getOfficeConnector();
		const trimConnector = this.getTrimConnector();

		const { dialogName } = this.state;
		Office.initialize = (reason) => {
			appStore.fetchBaseSettingFromTrim(dialogName === "/searchdialog");

			wordConnector.initialize(trimConnector, appStore);
		};

		window.onbeforeunload = () => {
			trimConnector.clearCache();
		};
	}

	public render() {
		const appStore = this.getAppStore();
		const wordConnector = this.getOfficeConnector();
		const trimConnector = this.getTrimConnector();

		return (
			<Provider
				appStore={appStore}
				trimConnector={trimConnector}
				wordConnector={wordConnector}
			>
				<div>
					{appStore.status === "ERROR" && <ErrorDisplay />}

					{this.state.dialogName === "/searchdialog" ? (
						<TrimSearchDialog
							trimType={BaseObjectTypes.Record}
							trimConnector={this.trimConnector}
							startPoint="RecentDocs"
							appStore={appStore}
							filterSearch={this.state.filter}
							insertText={this.state.insertText}
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
			</Provider>
		);
	}
}

export default observer(BootStrap);
