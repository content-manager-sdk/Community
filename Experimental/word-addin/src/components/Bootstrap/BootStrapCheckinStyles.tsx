import * as React from "react";
import BootStrap from "./BootStrap";

import { OutlookConnector } from "../../office-coms/OutlookConnector";
import AppStoreOutlook from "../../stores/AppStoreOutlook";
import { IOfficeConnector } from "../../office-coms/office-connector";
import { IAppStore } from "../../stores/AppStoreBase";
import CheckinStyles from "../CheckinStyles/CheckinStyles";

export class BootStrapCheckinStyles extends BootStrap<{
	forServerProcessing: boolean;
}> {
	private appStore: IAppStore;
	protected getAppStore(): IAppStore {
		if (!this.appStore) {
			this.appStore = new AppStoreOutlook(
				this.getTrimConnector(),
				this.getOfficeConnector()
			);
			this.appStore.deferFetchDriveInfo();
		}
		return this.appStore;
	}

	private officeConnector: IOfficeConnector;
	protected getOfficeConnector(): IOfficeConnector {
		if (!this.officeConnector) {
			this.officeConnector = new OutlookConnector();
		}
		return this.officeConnector;
	}

	renderBody(appStore: IAppStore) {
		const { ready } = this.state;
		const { forServerProcessing } = this.props;
		return ready ? (
			<CheckinStyles forServerProcessing={forServerProcessing} />
		) : null;
	}
}

export default BootStrapCheckinStyles;
