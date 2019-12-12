import BootStrap from "./BootStrap";
import { IAppStore } from "../../stores/AppStoreBase";
import { IOfficeConnector } from "../../office-coms/office-connector";
import WordConnector from "../../office-coms/word-connector";
import AppStoreWord from "../../stores/AppStoreWord";

export class BootStrapWord extends BootStrap {
	private appStore: IAppStore;
	protected getAppStore(): IAppStore {
		if (!this.appStore) {
			this.appStore = new AppStoreWord(
				this.getTrimConnector(),
				this.getOfficeConnector()
			);
		}
		return this.appStore;
	}

	private officeConnector: IOfficeConnector;
	protected getOfficeConnector(): IOfficeConnector {
		if (!this.officeConnector) {
			this.officeConnector = new WordConnector();
		}
		return this.officeConnector;
	}
}

export default BootStrapWord;
