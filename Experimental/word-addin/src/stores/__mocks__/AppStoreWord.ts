import { ITrimConnector } from "../../trim-coms/trim-connector";
import { IWordUrl } from "../../office-coms/office-connector";
import { observable } from "mobx";
import { IAppStore } from "../AppStoreBase";

export class AppStoreWord implements IAppStore {
	UserProfile?: import("../AppStoreBase").IUserProfile | undefined;
	errorMessage?: string | undefined;
	messages: import("../../trim-coms/trim-messages").TrimMessages;
	fetchBaseSettingFromTrim: any;
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
	setDocumentInfo(
		documentInfo: import("../../trim-coms/trim-connector").IDriveInformation
	): void {
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
