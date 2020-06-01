import BootStrap from "./BootStrap";
import { IAppStore } from "../../stores/AppStoreBase";
import AppStoreWebDrawer from "../../stores/AppStoreWebDrawer";

import * as React from "react";

import { IOfficeConnector } from "src/office-coms/office-connector";
import NoOfficeConnector from "src/office-coms/noOffice-connector";
import TrimSearchGrid from "../TrimSearchGrid/TrimSearchGrid";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

export class BootStrapWebDrawer extends BootStrap<{}> {
	private appStore: IAppStore;
	protected getAppStore(): IAppStore {
		if (!this.appStore) {
			this.appStore = new AppStoreWebDrawer(this.getTrimConnector(), undefined);
		}
		return this.appStore;
	}

	private officeConnector: IOfficeConnector;
	protected getOfficeConnector(): IOfficeConnector {
		if (!this.officeConnector) {
			this.officeConnector = new NoOfficeConnector();
		}
		return this.officeConnector;
	}

	componentDidMount() {
		const appStore = this.getAppStore();
		//	const wordConnector = this.getOfficeConnector();
		const trimConnector = this.getTrimConnector();

		const { dialogName } = this.state;

		appStore.fetchBaseSettingFromTrim(dialogName === "searchdialog");
		this.setState({ ready: true });

		window.onbeforeunload = () => {
			trimConnector.clearCache();
		};
	}

	renderBody(appStore: IAppStore) {
		const { ready } = this.state;
		const trimConnector = this.getTrimConnector();

		return ready ? (
			<TrimSearchGrid
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
				appStore={appStore}
			/>
		) : null;
	}
}

export default BootStrapWebDrawer;
