import { action, computed, configure, observable } from "mobx";
import { IWordUrl } from "../office-coms/word-connector";
import {
	IDriveInformation,
	ILocation,
	ITrimConnector,
	ITrimMainObject,
} from "../trim-coms/trim-connector";
import TrimMessages from "../trim-coms/trim-messages";
import BaseObjectTypes from "src/trim-coms/trim-baseobjecttypes";

const config = (global as any).config;

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
	setErrorMessage(message: string, ...args: string[]): void;
	openInCM(uri: number): void;
	getWebClientUrl(uri: number, containerSearch?: boolean): void;
}

export class AppStore implements IAppStore {
	@observable public errorMessage: string;
	@observable public errorBody: any;
	@observable public documentInfo: IDriveInformation = {
		Id: "",
		Uri: 0,
		CommandDefs: [],
		RecordType: "",
		Options: { DefaultDocumentRecordType: 0 },
		Enums: { RecordRelationshipType: [] },
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

	public fetchBaseSettingFromTrim = (fromDialog: boolean) => {
		const thisthis = this;
		const tc = this.trimConnector;

		this.trimConnector
			.getMe()
			.then(
				function(this: any, me: ILocation) {
					this.setMe(me);
				}.bind(this)
			)
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
							// ensure search details are in cache
							tc.getSearchClauseOrFieldDefinitions(BaseObjectTypes.Record).then(
								() => {}
							);
							thisthis.setDocumentInfo(documentInfo);
							thisthis.setStatus("WAITING");
						})
						.catch(function(error) {
							thisthis.setError(error, "fetch base settings for dialog");
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
	get RecordType(): string {
		if (this.documentInfo != null) {
			return this.documentInfo.RecordType;
		}
		return "";
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

	public createRecord = (recordType: number, properties: any) => {
		this.setStatus("STARTING");
		console.log("hhhhhhhhh");
		return this.wordConnector!.getDocumentData(
			(data: number[], fileName: string) => {
				return this.trimConnector!.writeFileSlice(data, fileName);
			}
		).then((fileName) => {
			return this.trimConnector
				.registerInTrim(
					recordType,
					{
						...properties,
						RecordFilePath: fileName,
					},
					{ DriveID: this.documentInfo.Id }
				)
				.then((newRecord: ITrimMainObject) => {
					if (newRecord.Uri > 0) {
						this.setDocumentInfo({
							Uri: newRecord.Uri,
							CommandDefs: newRecord.CommandDefs!,
							Id: this.documentInfo.Id,
							RecordType: this.documentInfo.RecordType,
							Options: this.documentInfo.Options,
							Enums: this.documentInfo.Enums,
						});
					}
					this.setStatus("WAITING");
				})
				.catch((error) => {
					this.setError(error, "create record");
				});
		});
	};

	public getWebClientUrl(uri: number, containerSearch?: boolean): string {
		let webClientUrl =
			(config.BASE_URL.endsWith("/")
				? config.BASE_URL
				: config.BASE_URL + "/") + config.WEB_CLIENT;

		if (containerSearch) {
			return `${webClientUrl}?q=recContainerEx:[unkUri:${uri}]&t=Record`;
		} else {
			return `${webClientUrl}?uri=${uri}`;
		}
	}

	public openInCM(uri: number): void {
		const url = this.getWebClientUrl(uri);

		open(url, "_blank");
	}

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
		let message;
		if (typeof error === "string" || error instanceof String) {
			message = error;
		} else {
			message = error.message || "no message";
		}

		this.errorMessage = module ? message + " (" + module + ")" : message;

		this.errorBody = error;
		this.status = "ERROR";
	};

	@action.bound
	public setErrorMessage(message: string, ...args: string[]) {
		let errorMessage = this.messages[message];

		for (let counter = 0; counter < args.length; counter++) {
			errorMessage = errorMessage.replace(
				new RegExp("\\{" + counter + "\\}", "g"),
				args[counter]
			);
		}

		this.setError(errorMessage);
	}

	@action.bound
	public resetError = () => {
		this.errorMessage = "";
		this.status = "WAITING";
	};
}

export default AppStore;
