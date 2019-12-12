import BootStrap from "./BootStrap";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import AppStoreOutlook from "../../stores/AppStoreOutlook";
import { IOfficeConnector } from "src/office-coms/office-connector";
import { IAppStore } from "src/stores/AppStoreBase";
import * as React from "react";
import { Provider } from "mobx-react";

export class BootStrapOutlookLinks extends BootStrap {
	private appStore: IAppStore;
	protected getAppStore(): IAppStore {
		if (!this.appStore) {
			this.appStore = new AppStoreOutlook(
				this.getTrimConnector(),
				this.getOfficeConnector()
			);
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
				<div>test</div>
			</Provider>
		);
	}
}

export default BootStrapOutlookLinks;
