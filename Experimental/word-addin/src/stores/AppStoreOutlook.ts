import AppStoreBase from "./AppStoreBase";
import { action } from "mobx";

export class AppStoreOutlook extends AppStoreBase {
	protected isEmail(): boolean {
		return true;
	}

	@action.bound
	public setFileName = (fileName: string) => {};

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
}

export default AppStoreOutlook;
