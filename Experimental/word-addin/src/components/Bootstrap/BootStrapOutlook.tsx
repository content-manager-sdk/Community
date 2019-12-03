import * as React from "react";
import { Provider /* inject, observer  */ } from "mobx-react";
import TrimConnector from "../../trim-coms/trim-connector";
import BootStrap from "./BootStrap";

import { OutlookConnector } from "../../office-coms/OutlookConnector";
import AppStoreOutlook from "../../stores/AppStoreOutlook";

export class BootStrapOutlook extends React.Component<{}, {}> {
	public render() {
		const outlookConnector = new OutlookConnector();
		const trimConnector = new TrimConnector();
		const appStore = new AppStoreOutlook(trimConnector, outlookConnector);

		return (
			<Provider
				appStore={appStore}
				trimConnector={trimConnector}
				wordConnector={outlookConnector}
			>
				<BootStrap />
			</Provider>
		);
	}
}

export default BootStrapOutlook;
