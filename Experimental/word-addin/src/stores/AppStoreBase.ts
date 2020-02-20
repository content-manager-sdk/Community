import { action, computed, configure, observable } from "mobx";
import { IWordUrl } from "../office-coms/office-connector";
import {
	IDriveInformation,
	ILocation,
	ITrimConnector,
	ITrimMainObject,
	IDatabase,
} from "../trim-coms/trim-connector";
import TrimMessages from "../trim-coms/trim-messages";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import { OutlookConnector } from "src/office-coms/OutlookConnector";

const config = (global as any).config;

export interface IUserProfile {
	DisplayName: string;
}

export interface IAppStore {
	spinning: Boolean;
	status: string;
	UserProfile?: IUserProfile;
	errorMessage?: string;
	messages: TrimMessages;
	fetchBaseSettingFromTrim: any;
	FileName: string;
	documentInfo: IDriveInformation;
	resetError(): void;
	setError(error: any, module?: string): void;
	setErrorMessage(message: string, ...args: string[]): void;
	openInCM(uri: number): void;
	getWebClientUrl(uri: number, containerSearch?: boolean): void;
	setDocumentInfo(documentInfo: IDriveInformation): void;
	setStatus(status: string): void;
	setSpinning(on: Boolean, label?: string): void;
	deferFetchDriveInfo(): void;
	createRecordFromStyle(
		checkinStyle: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject>;
	createRecord(
		recordType: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject>;
	getSpinningLabel(): string | undefined;
	setFileName(fileName: string): void;
	moreToFile(): boolean;
	isEmail(): boolean;
}

export class AppStoreBase implements IAppStore {
	private _deferFetchDriveInfo = false;
	private spinningLabel: string | undefined;

	@observable public errorMessage: string;
	@observable public errorBody: any;
	@observable public documentInfo: IDriveInformation = {
		Id: "",
		Uris: [],

		Options: { DefaultDocumentRecordType: 0 },
		EmailPath: "",
		URN: "",
	};
	@observable public me: ILocation;
	@observable public messages: TrimMessages = new TrimMessages();
	@observable public status: string = "STARTING";
	@observable public spinning: Boolean;
	@observable public WebUrl: string;
	@observable public FileName: string;

	constructor(
		protected trimConnector: ITrimConnector,
		protected wordConnector?: IWordUrl
	) {
		configure({ enforceActions: "observed" });
	}

	protected getFileName(): Promise<string> {
		throw new Error("Method not implemented");
	}

	protected getFileToSave(): Promise<string> {
		throw new Error("Method not implemented");
	}

	public isEmail(): boolean {
		return false;
	}
	public deferFetchDriveInfo = () => {
		this._deferFetchDriveInfo = true;
	};

	public moreToFile(): boolean {
		return false;
	}
	public fetchBaseSettingFromTrim = (fromDialog: boolean) => {
		const tc = this.trimConnector;
		const self = this;

		const promisesToRun = [tc.getMe(), tc.getMessages()];
		if (!fromDialog) {
			promisesToRun.push(this.wordConnector!.getWebUrl());
		}
		Promise.all(promisesToRun)
			.then((values) => {
				self.setMe(values[0]);
				self.setMessages(values[1]);

				if (!fromDialog) {
					self.WebUrl = values[2];

					tc.getSearchClauseOrFieldDefinitions(
						BaseObjectTypes.Record
					).then(() => {});

					tc.getSearchOptions().then(() => {});

					self.getFileName().then((fileName) => {
						self.setFileName(fileName);
					});

					if (this._deferFetchDriveInfo === false) {
						tc.getDriveId(
							self.WebUrl,
							this.isEmail(),
							this.wordConnector!.getRecordUri()
						)
							.then((driveInfo) => {
								self.setDocumentInfo(driveInfo);
								self.setStatus("WAITING");
							})
							.catch((error) => {
								self.setError(error, "fetch base settings for dialog");
							});
					} else {
						this.trimConnector
							.getDatabaseProperties()
							.then((database: IDatabase) => {
								(this.wordConnector as OutlookConnector)
									.getRecordUrisFromItem(database.Id)
									.then((uris: number[]) => {
										self.setDocumentInfo({ ...this.documentInfo, Uris: uris });
										self.setStatus("WAITING");
									});
							})
							.catch((error) => {
								self.setError(error, "get mail items");
							});
						//(this.wordConnector as OutlookConnector).getRecordUrisFromItem();
					}
				} else {
					self.setStatus("WAITING");
				}
			})
			.catch((error) => {
				self.setError(error, "fetch base settings");
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
		if (
			this.documentInfo != null &&
			this.documentInfo.Uris &&
			this.documentInfo.Uris.length > 0
		) {
			return this.documentInfo.Uris[0];
		}
		return 0;
	}

	@action.bound
	setDocumentInfo(documentInfo: IDriveInformation) {
		this.documentInfo = documentInfo;
	}

	public createRecordFromStyle = (
		checkinStyle: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject> => {
		return this.createRecordInternal(
			{ CreateFromCheckinStyle: checkinStyle, ...properties },
			fields
		);
	};

	public createRecord = (
		recordType: number,
		properties: any,
		fields?: any
	): Promise<ITrimMainObject> => {
		return this.createRecordInternal(
			{ RecordRecordType: recordType, ...properties },
			fields
		);
	};

	private createRecordInternal = (
		properties: any,
		fields?: any
	): Promise<ITrimMainObject> => {
		return new Promise((resolve, reject) => {
			this.getFileToSave().then((fileName) => {
				fields = fields || {};
				fields.DriveID = this.documentInfo.Id;

				return this.trimConnector
					.saveToTrim(
						BaseObjectTypes.Record,
						{
							...properties,
							RecordFilePath: fileName,
						},
						fields
					)
					.then((newRecord: ITrimMainObject) => {
						if (newRecord.Uri > 0) {
							this.setDocumentInfo({
								Uris: [],
								//CommandDefs: newRecord.CommandDefs!,
								Id: this.documentInfo.Id,
								Options: this.documentInfo.Options,
								EmailPath: this.documentInfo.EmailPath,
								URN: newRecord.URN!,
							});
						}
						this.setStatus("WAITING");
						resolve(newRecord);
					})
					.catch((error) => {
						this.setError(error, "create record");
						reject();
					});
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
	public setSpinning = (on: Boolean, label?: string) => {
		this.spinning = on;
		this.spinningLabel = label;
	};

	public getSpinningLabel = () => {
		return this.spinningLabel;
	};

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
		this.spinning = false;
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

export default AppStoreBase;
