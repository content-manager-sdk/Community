import * as React from "react";
import { Provider /* inject, observer  */ } from "mobx-react";
import TrimConnector from "../../trim-coms/trim-connector";

import AppStoreOutlook from "../../stores/AppStoreOutlook";

import { OutlookConnector } from "src/office-coms/OutlookConnector";
import CheckinStyles from "../CheckinStyles/CheckinStyles";
import { getQueryStringValue } from "../../utils/getQueryStringValue";

interface IBootStrapCheckinStylesState {
	ready: boolean;
}

export class BootStrapCheckinStyles extends React.Component<
	{ forServerProcessing: boolean },
	IBootStrapCheckinStylesState
> {
	trimConnector = new TrimConnector();
	outlookConnector = new OutlookConnector();
	appStore = new AppStoreOutlook(this.trimConnector, this.outlookConnector);

	constructor(props: { forServerProcessing: boolean }) {
		super(props);

		this.state = {
			ready: false,
		};

		Office.initialize = (reason) => {
			let getAccessToken: Promise<string>;

			this.trimConnector.credentialsResolver = (callback) => {
				const accessToken = getQueryStringValue("accessToken");
				if (!getAccessToken) {
					getAccessToken = this.outlookConnector!.getAccessToken();
				}

				if (accessToken) {
					callback(accessToken, "");
				} else {
					getAccessToken
						.then((token) => callback(token, ""))
						.catch(function(error) {
							callback("", error.message);
						});
				}
			};
			this.setState({ ready: true });
			this.appStore.fetchBaseSettingFromTrim(false);

			this.outlookConnector.initialize(this.trimConnector!, this.appStore!);
		};
	}

	componentDidMount() {
		//	const { appStore, trimConnector, wordConnector } = this.props;

		window.onbeforeunload = () => {
			this.trimConnector!.clearCache();
		};
	}

	public render() {
		const { ready } = this.state;
		const { forServerProcessing } = this.props;

		return (
			<Provider
				appStore={this.appStore}
				trimConnector={this.trimConnector}
				wordConnector={this.outlookConnector}
			>
				<React.Fragment>
					{ready && <CheckinStyles forServerProcessing={forServerProcessing} />}
				</React.Fragment>
			</Provider>
		);
	}
}

export default BootStrapCheckinStyles;
