import { OfficeConnector, IOfficeConnector } from "./office-connector";

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

export class NoOfficeConnector extends OfficeConnector
	implements IOfficeConnector {
	public getAccessToken(): Promise<string> {
		return Promise.resolve("");
	}
	getWebUrl(): Promise<string> {
		throw new Error("Method not implemented.");
	}
	getDocumentData(writeSlice: any): Promise<string> {
		throw new Error("Method not implemented.");
	}
	getRecordUri(): number {
		return 0;
	}

	setAutoOpen(autoOpen: boolean): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getAutoOpen(): boolean {
		throw new Error("Method not implemented.");
	}

	public insertText(textToInsert: string): void {
		throw new Error("Method not implemented.");
	}

	public insertLink(textToInsert: string, url: string): void {
		throw new Error("Method not implemented.");
	}

	public isSaved(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	public saveDocument(): Promise<void> {
		return Promise.resolve();
	}

	public setUri(uri: number): Promise<IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}

	public getUri(): Promise<IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}
}
export default NoOfficeConnector;
