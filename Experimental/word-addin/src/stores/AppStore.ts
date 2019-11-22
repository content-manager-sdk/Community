import AppStoreBase from "./AppStoreBase";

export class AppStore extends AppStoreBase {
	protected getFileName(): Promise<string> {
		return new Promise<string>((resolve) => {
			const tokens = this.WebUrl.split("/");
			resolve(tokens[tokens.length - 1].split(".")[0]);
		});
	}

	protected getFileToSave(): Promise<string> {
		return this.wordConnector!.getDocumentData(
			(data: number[], fileName: string) => {
				return this.trimConnector!.writeFileSlice(data, fileName);
			}
		);
	}
}

export default AppStore;
