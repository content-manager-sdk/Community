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
	setError(error: any, module?: string): void;
}

export class AppStore implements IAppStore {
	@observable public errorMessage: string;
	@observable public errorBody: any;
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
	public fetchBaseSettingFromTrim = function(
		this: AppStore,
		fromDialog: boolean
	) {
		const thisthis = this;
		const tc = this.trimConnector;

		this.trimConnector
			.getMe()
			.then(function(me) {
				thisthis.setMe(me);
			})
			.then(function() {
				return tc.getMessages();
			})
			.then(function(messages) {
				thisthis.setMessages(messages);
			})
			.then(function() {
				if (!fromDialog) {
					thisthis.wordConnector
						.getWebUrl()
						.then(function(webUrl: string) {
							thisthis.WebUrl = webUrl;
							const tokens = thisthis.WebUrl.split("/");
							thisthis.setFileName(tokens[tokens.length - 1].split(".")[0]);
							return webUrl;
						})
						.then((webUrl: string) => {
							return tc.getDriveId(webUrl);
						})
						.then(function(documentInfo) {
							console.log("hhhhh");
							thisthis.setDocumentInfo(documentInfo);
						})
						.catch(function(error) {
							thisthis.setError(error, "fetch base settings for dialog");
						})
						.finally(() => {
							if (thisthis.status !== "ERROR") {
								thisthis.setStatus("WAITING");
							}
						});
				} else {
					thisthis.setStatus("WAITING");
				}
			})
			.catch(function(error) {
				thisthis.setError(error, "fetch base settings");
			});
	};

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
		this.setStatus("STARTING");
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
			this.setError(error, "create record");
		} finally {
			this.setStatus("WAITING");
		}
	});

	@action.bound
	public setStatus = (status: string) => {
		this.status = status;
	};

	@action.bound
	public setFileName = (fileName: string) => {
		this.FileName = fileName;
	};

	@action.bound
	public setMessages = (messages: TrimMessages) => {
		this.messages = messages;
	};

	@action.bound
	public setMe = (me: ILocation) => {
		this.me = me;
	};

	@action.bound
	public setError = (error: any, module?: string) => {
		const message = error.message || "no message";
		this.errorMessage = module ? message + " (" + module + ")" : message;
		this.errorBody = error;
		this.status = "ERROR";
	};

	@action.bound
	public resetError = () => {
		this.errorMessage = "";
		this.status = "WAITING";
	};
}

export default AppStore;
