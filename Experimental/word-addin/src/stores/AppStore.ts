import { computed, configure, flow, observable } from "mobx";
import {
	IGetRecordUriResponse,
	IWordConnector,
} from "../office-coms/word-connector";

import TrimMessages from "../trim-coms/trim-messages";

import {
	ILocation,
	ITrimConnector,
	ITrimMainObject,
} from "../trim-coms/trim-connector";

export const BASE_URI = "http://localhost/";

export interface IUserProfile {
	DisplayName: string;
}

export interface IAppStore {
	status: string;
	UserProfile?: IUserProfile;
	errorMessage?: string;
}

export class AppStore implements IAppStore {
	@observable public errorMessage: string;
	@observable public documentInfo: IGetRecordUriResponse;
	@observable public me: ILocation;
	@observable public messages: TrimMessages = new TrimMessages();
	@observable public status: string = "STARTING";

	constructor(
		private wordConnector: IWordConnector,
		private trimConnector: ITrimConnector
	) {
		configure({ enforceActions: "observed" });
	}

	// tslint:disable-next-line
	public fetchBaseSettingFromTrim = flow(function*(this: AppStore) {
		try {
			const response: ILocation = yield this.trimConnector.getMe();
			const messagesResponse: any = yield this.trimConnector.getMessages();

			if (response != null && messagesResponse != null) {
				this.me = response;

				this.messages = messagesResponse;

				// temporary - need to go in TRIM Messages
				this.messages.web_Register = "Register in Content Manager";
				this.messages.web_SelectRecordType = "Select a Record Type";

				this.status = "WAITING";
			}

			this.documentInfo = yield this.wordConnector.getUri();
			this.status =
				this.documentInfo.found || !this.documentInfo.message
					? "WAITING"
					: "ERROR";
		} catch (error) {
			this.status = "ERROR";
			this.errorMessage = error.message;
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
			return this.documentInfo.uri;
		}
		return -1;
	}

	// tslint:disable-next-line
	public createRecord = flow(function*(
		this: AppStore,
		recordType: number,
		properties: any
	) {
		const newRecord: ITrimMainObject = yield this.trimConnector.registerInTrim(
			recordType,
			properties
		);

		this.wordConnector.setUri(newRecord.Uri);

		if (newRecord.Uri > 0) {
			this.documentInfo = { uri: newRecord.Uri, found: true };
		}
	});
}

export default AppStore;
