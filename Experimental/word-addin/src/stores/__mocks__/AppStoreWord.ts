import {
	ITrimConnector,
	IDriveInformation,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";
import { IWordUrl } from "../../office-coms/office-connector";
import { observable } from "mobx";
import { IAppStore, IUserProfile } from "../AppStoreBase";
import TrimMessages from "src/trim-coms/trim-messages";

export class AppStoreWord implements IAppStore {
	createRecordFromStyle(
		checkinStyle: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject> {
		throw new Error("Method not implemented.");
	}
	createRecord(
		recordType: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject> {
		throw new Error("Method not implemented.");
	}
	public documentInfo: IDriveInformation;
	public FileName: string;
	UserProfile?: IUserProfile | undefined;
	errorMessage?: string | undefined;
	messages: TrimMessages;
	fetchBaseSettingFromTrim: any;
	deferFetchDriveInfo(): void {
		throw new Error("Method not implemented.");
	}
	resetError(): void {
		throw new Error("Method not implemented.");
	}
	setError(error: any, module?: string | undefined): void {
		throw new Error("Method not implemented.");
	}
	setErrorMessage(message: string, ...args: string[]): void {
		throw new Error("Method not implemented.");
	}
	openInCM(uri: number): void {
		throw new Error("Method not implemented.");
	}
	getWebClientUrl(uri: number, containerSearch?: boolean | undefined): void {
		throw new Error("Method not implemented.");
	}
	setDocumentInfo(documentInfo: IDriveInformation): void {
		throw new Error("Method not implemented.");
	}
	setStatus(status: string): void {
		throw new Error("Method not implemented.");
	}
	constructor(
		protected trimConnector: ITrimConnector,
		protected wordConnector?: IWordUrl
	) {}

	@observable public status: string = "ERROR";
}

export default AppStoreWord;
