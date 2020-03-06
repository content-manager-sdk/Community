import AppStoreBase from "./AppStoreBase";
import { OutlookConnector } from "src/office-coms/OutlookConnector";

export class AppStoreOutlook extends AppStoreBase {
	public isEmail(): boolean {
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
		try {
			return (
				this.documentInfo.Uris.length <
				(this.wordConnector as OutlookConnector).getAttachments().length
			);
		} catch {
			return false;
		}
	}
}

export default AppStoreOutlook;
