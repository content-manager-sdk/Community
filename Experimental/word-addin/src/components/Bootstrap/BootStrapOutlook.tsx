import BootStrap from "./BootStrap";

import { OutlookConnector } from "../../office-coms/OutlookConnector";
import AppStoreOutlook from "../../stores/AppStoreOutlook";
import { IOfficeConnector } from "../../office-coms/office-connector";
import { IAppStore } from "../../stores/AppStoreBase";

export class BootStrapOutlook extends BootStrap<{}> {
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
}

export default BootStrapOutlook;
