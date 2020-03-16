import { OfficeConnector, IOfficeConnector } from "../office-connector";
import { ITrimConnector } from "../../trim-coms/trim-connector";
import { IAppStore } from "../../stores/AppStoreBase";
import { IGetRecordUriResponse } from "../word-connector";

export interface IOutlookFolder {
	id: string;
	displayName: string;
}

(global as any).mockObject = {};

export class OutlookConnector extends OfficeConnector
	implements IOfficeConnector {
	isSaved(): Promise<boolean> {
		return Promise.resolve(true);
	}
	_customProps: Office.CustomProperties;

	public initialize(trimConnector: ITrimConnector, appStore: IAppStore): void {}

	getRecordUri(): number {
		return 0;
	}
	public getWebUrl(): Promise<string> {
		return new Promise<string>(function(resolve) {
			resolve("");
		});
	}

	getUri(): Promise<IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}
	setUri(uri: number): Promise<IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}
	insertText(textToInsert: string): void {
		throw new Error("Method not implemented.");
	}
	insertLink(textToInsert: string, url: string): void {
		throw new Error("Method not implemented.");
	}

	getFolders(autoCreateCaption: string): Promise<IOutlookFolder[]> {
		return new Promise<IOutlookFolder[]>((resolve, reject) => {
			resolve([{ id: "cm_auto", displayName: "auto" }]);
		});
	}
	setAutoOpen(
		autoOpen: boolean,
		recordUrn?: string,
		subjectPrefix?: string
	): Promise<void> {
		return new Promise<void>((resolve) => {
			resolve();
		});
	}
	getAutoOpen(): boolean {
		return false;
	}
	saveDocument(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	getDocumentData(writeSlice: any): Promise<string> {
		throw new Error("Method not implemented.");
	}
	setUrnOnFolder(folderId: string, changeKey: string, urn: string): void {
		(global as any).mockObject.setUrnOnFolderId = folderId;
	}

	getFolderChangeKey(folderId: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			resolve("");
		});
	}
}
