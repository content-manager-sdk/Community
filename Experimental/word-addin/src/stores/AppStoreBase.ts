import { action, computed, configure, observable } from "mobx";
import { IWordUrl } from "../office-coms/office-connector";
import {
	IDriveInformation,
	ILocation,
	ITrimConnector,
	ITrimMainObject,
	IRecord,
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
	PreservedUris: number[];
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
	isOffice(): boolean;
	clearUris(): void;
	fetchFiledRecords(): Promise<IRecord[]>;
}

export class AppStoreBase implements IAppStore {
	private _deferFetchDriveInfo = false;
	private spinningLabel: string | undefined;

	@observable public errorMessage: string;
	@observable public errorBody: any;
	@observable public documentInfo: IDriveInformation = {
		Id: "",
		Uris: [],
		EmailPath: "",
		URN: "",
		PreservedUris: [],
	};
	@observable public me: ILocation;
	@observable public messages: TrimMessages = new TrimMessages();
	@observable public status: string = "STARTING";
	@observable public spinning: Boolean;
	@observable public FileName: string;
	public PreservedUris: number[];

	constructor(
		protected trimConnector: ITrimConnector,
		protected wordConnector?: IWordUrl
	) {
		configure({ enforceActions: "observed" });
	}

	private canConnectToOffice(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			this.wordConnector!.getWebUrl()
				.then(function () {
					resolve(true);
				})
				.catch(function () {
					resolve(false);
				});
		});
	}

	protected getFileName(): Promise<string> {
		throw new Error("Method not implemented");
	}

	protected getFileToSave(): Promise<string> {
		throw new Error("Method not implemented");
	}

	fetchFiledRecords(): Promise<IRecord[]> {
		return new Promise<IRecord[]>((resolve) => {
			const uris =
				(this.PreservedUris || []).length > 0
					? this.PreservedUris
					: this.documentInfo.Uris || [];
			if (uris.length > 0) {
				this.setSpinning(true);
				this.trimConnector
					.search<IRecord>({
						q: "unkUri:" + uris.join(","),
						trimType: BaseObjectTypes.Record,
						purpose: 0,
						properties: "ToolTip,RecordMessageId,RecordESource",
					})
					.then((data) => {
						this.setSpinning(false);
						resolve(data.results as IRecord[]);
					})
					.catch((e) => {
						this.setError(e);
						resolve([]);
					});
			} else {
				resolve([]);
			}
		});
	}

	public isEmail(): boolean {
		return false;
	}

	public isOffice(): boolean {
		return false;
	}

	public isWebApp(): boolean {
		return false;
	}

	public deferFetchDriveInfo = () => {
		this._deferFetchDriveInfo = true;
	};

	public clearUris(): void {
		this.PreservedUris = [...this.documentInfo.Uris];
		this.setDocumentInfo({
			...this.documentInfo,
			Uris: [],
		});
	}

	public moreToFile(): boolean {
		return false;
	}
	public fetchBaseSettingFromTrim = async (fromDialog: boolean) => {
		const tc = this.trimConnector;

		this.PreservedUris = [];

		try {
			this.setMe(await tc.getMe());
			this.setMessages(await tc.getMessages());

			if (!fromDialog) {
				let isSaved = true;

				try {
					await this.wordConnector!.getWebUrl();
				} catch {
					isSaved = false;
				}

				if (!isSaved) {
					this.setStatus("WAITING");
				} else {
					const fn = await this.getFileName();
					this.setFileName(fn);

					if (this._deferFetchDriveInfo === false) {
						try {
							const webUrl = await this.wordConnector!.getWebUrl();
							const driveInfo = await tc.getDriveId(
								webUrl,
								this.wordConnector!.getRecordUri()
							);

							this.setDocumentInfo(driveInfo);

							this.setStatus("WAITING");
						} catch (error) {
							this.setError(error, "fetch base settings for dialog");
						}
					} else {
						try {
							if (await this.canConnectToOffice()) {
								const database = await this.trimConnector.getDatabaseProperties();
								const uris = await (this
									.wordConnector as OutlookConnector).getRecordUrisFromItem(
									database.Id
								);

								this.setDocumentInfo({ ...this.documentInfo, Uris: uris });
							}
							this.setStatus("WAITING");
						} catch (error) {
							this.setError(error, "get mail items - get database");
						}
					}
				}
			} else {
				this.setStatus("WAITING");
			}
		} catch (error) {
			this.setError(error, "fetch base settings");
		}
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
		return new Promise(async (resolve, reject) => {
			const fileName = await this.getFileToSave();

			fields = fields || {};
			if (!this.isEmail()) {
				properties.RecordExternalEditorId = this.documentInfo.Id;
			}
			try {
				let isLocal = false;
				if (!properties.RecordExternalEditorId && !this.isEmail()) {
					properties.RecordExternalEditorId = await this.wordConnector!.getWebUrl();
					isLocal = true;
				}

				const newRecord = await this.trimConnector.saveToTrim(
					BaseObjectTypes.Record,
					{
						...properties,
						RecordFilePath: fileName,
					},
					fields
				);

				if (!this.isEmail() && isLocal) {
					await this.trimConnector.saveToTrim(BaseObjectTypes.Record, {
						Uri: newRecord.Uri,
						Checkout: {
							CheckoutSaveCheckoutPathAs: properties.RecordExternalEditorId,
						},
					});
				}

				if (newRecord.Uri > 0) {
					this.setDocumentInfo({
						Uris: [],
						Id: this.documentInfo.Id,
						EmailPath: this.documentInfo.EmailPath,
						URN: newRecord.URN!,
					});
				}
				this.setStatus("WAITING");
				resolve(newRecord);
			} catch (error) {
				this.setError(error, "create record");
				reject();
			}
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

	private _spinningCount = 0;

	@action.bound
	public setSpinning = (on: Boolean, label?: string) => {
		if (on) {
			this._spinningCount++;
		} else {
			if (this._spinningCount > 0) {
				this._spinningCount--;
			}
		}
		this.spinning = this._spinningCount > 0;
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
	public setError = (error: any, module?: string, setStatus = true) => {
		try {
			if (error.data.response.status === 401) {
				const servicePath = this.trimConnector.getServiceAPIPath();
				window.location.replace(
					`${servicePath}/auth/openid?redirect=${encodeURI(top.location.href)}`
				);
			}
		} catch {}
		let message;
		if (typeof error === "string" || error instanceof String) {
			message = error;
		} else {
			message = error.message || "no message";
		}

		this.errorMessage = module ? message + " (" + module + ")" : message;

		if (typeof error !== "string" && !(error instanceof String)) {
			this.errorBody = error;
		}
		if (setStatus) {
			this.status = "ERROR";
		}
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
