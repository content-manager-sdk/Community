import AppStoreBase from "./AppStoreBase";

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
}

export default AppStoreOutlook;
