import AppStoreBase from "./AppStoreBase";
import { OutlookConnector } from "src/office-coms/OutlookConnector";

export class AppStoreOutlook extends AppStoreBase {
	protected isEmail(): boolean {
		return true;
	}

	protected getFileName(): Promise<string> {
		return new Promise<string>((resolve) => {
			resolve(Office.context.mailbox.item.normalizedSubject);
		});
	}

	protected getFileToSave(): Promise<string> {
		return new Promise<string>((resolve) => {
			resolve(this.documentInfo.EmailPath);
		});
	}

	public moreToFile(): boolean {
		return (
			this.documentInfo.Uris.length <
			(this.wordConnector as OutlookConnector).getAttachments().length
		);
	}
}

export default AppStoreOutlook;
