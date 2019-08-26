import { action, computed, configure, flow, observable } from "mobx";
import { IWordUrl } from "../office-coms/word-connector";
import {
	IDriveInformation,
	ILocation,
	ITrimConnector,
	ITrimMainObject,
} from "../trim-coms/trim-connector";
import TrimMessages from "../trim-coms/trim-messages";

export interface IUserProfile {
	DisplayName: string;
}

export interface IAppStore {
	status: string;
	UserProfile?: IUserProfile;
	errorMessage?: string;
	messages: TrimMessages;
	fetchBaseSettingFromTrim: any;
	resetError(): void;
	setError(message: string): void;
}

export class AppStore implements IAppStore {
	@observable public errorMessage: string;
	@observable public documentInfo: IDriveInformation = {
		Id: "",
		Uri: 0,
		CommandDefs: [],
	};
	@observable public me: ILocation;
	@observable public messages: TrimMessages = new TrimMessages();
	@observable public status: string = "STARTING";
	@observable public WebUrl: string;
	@observable public FileName: string;

	constructor(
		private wordConnector: IWordUrl,
		private trimConnector: ITrimConnector
	) {
		configure({ enforceActions: "observed" });
	}

	// tslint:disable-next-line
	public fetchBaseSettingFromTrim = flow(function*(
		this: AppStore,
		fromDialog: boolean
	) {
		try {
			const response: ILocation = yield this.trimConnector.getMe();
			const messagesResponse: any = yield this.trimConnector.getMessages();

			if (response != null && messagesResponse != null) {
				this.me = response;

				this.messages = messagesResponse;

				// // temporary - need to go in TRIM Messages
				// this.messages.web_Register = "Register in Content Manager";
				// this.messages.web_SelectRecordType = "Select a Record Type";
				// this.messages.web_Actions = "Actions";
				// this.messages.web_Checkin = "Check In";
				// this.messages.web_Finalize = "Make Final";
				// this.messages.bob_sbMe = "Me";
			}

			// not happy with this
			// it fails when we open as a dialog
			// I do not need the dpcumentInfo when opened as a dialog
			// so it would be better not to call at all when opened as a dialog...
			if (!fromDialog) {
				this.WebUrl = yield this.wordConnector.getWebUrl();

				const tokens = this.WebUrl.split("/");

				this.FileName = tokens[tokens.length - 1].split(".")[0];
				this.documentInfo = yield this.trimConnector.getDriveId(this.WebUrl);
			}
			this.status = "WAITING";
			// this.status =
			// 	this.documentInfo.found || !this.documentInfo.message
			// 		? "WAITING"
			// 		: "ERROR";
		} catch (error) {
			this.setError(error.message);
		}
	});

	@computed
	get ApplicationDisplayName() {
		if (this.messages) {
			return this.messages.web_HPRM;
		} else {
			return "";
		}
	}

	@computed
	get UserProfile(): IUserProfile {
		return {
			DisplayName: this.me.FullFormattedName.Value,
		};
	}

	@computed
	get RecordUri(): number {
		if (this.documentInfo != null) {
			return this.documentInfo.Uri;
		}
		return 0;
	}

	@computed
	get DriveId(): string {
		if (this.documentInfo != null) {
			return this.documentInfo.Id;
		}
		return "";
	}

	@action.bound
	setDocumentInfo(documentInfo: IDriveInformation) {
		this.documentInfo = documentInfo;
	}
	// tslint:disable-next-line
	public createRecord = flow(function*(
		this: AppStore,
		recordType: number,
		properties: any
	) {
		try {
			const newRecord: ITrimMainObject = yield this.trimConnector.registerInTrim(
				recordType,
				{
					...properties,
					...{ RecordSpURL: this.documentInfo.Id },
				}
			);

			if (newRecord.Uri > 0) {
				this.documentInfo.Uri = newRecord.Uri;
				this.documentInfo.CommandDefs = newRecord.CommandDefs!;
			}
		} catch (error) {
			this.setError(error.message);
		}
	});

	@action.bound
	public setError = (message: string) => {
		this.errorMessage = message;
		this.status = "ERROR";
	};

	@action.bound
	public resetError = () => {
		this.errorMessage = "";
		this.status = "WAITING";
	};
}

export default AppStore;
