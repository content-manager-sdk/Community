import { computed, flow, observable, configure, action } from "mobx";
import {
  IWordConnector,
  IGetRecordUriResponse
} from "../office-coms/word-connector";

import TrimMessages from "../trim-coms/trim-messages";

import { ITrimConnector, ILocation } from "../trim-coms/trim-connector";

export const BASE_URI = "http://localhost/";

export interface IUserProfile {
  DisplayName: string;
}

export interface IAppStore {
  status: string;
  UserProfile?: IUserProfile;
  errorMessage?: string;
}

configure({ enforceActions: "observed" });

export class AppStore implements IAppStore {
  constructor(
    private wordConnector: IWordConnector,
    private trimConnector: ITrimConnector
  ) {}
  @observable status: string = "WAITING";
  @observable errorMessage: string;
  @observable messages: TrimMessages = {};
  @observable me: ILocation;
  @observable documentInfo: IGetRecordUriResponse;

  fetchBaseSettingFromTrim = flow(function*(this: AppStore) {
    this.status = "SPINNING";

    try {
      const response: ILocation = yield this.trimConnector.getMe();
      const messagesResponse: any = yield this.trimConnector.getMessages();
      this.documentInfo = yield this.wordConnector.getUri();

      if (response != null && messagesResponse != null) {
        this.me = response;

        this.messages = messagesResponse;

        // temporary - need to go in TRIM Messages
        this.messages.web_Register = "Register in Content Manager";
        this.messages.web_SelectRecordType = "Select a Record Type";

        this.status = "WAITING";
      }

      if (this.documentInfo.found || !this.documentInfo.message) {
        this.status = "WAITING";
      } else {
        this.status = "ERROR";
      }
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
      DisplayName: this.me.FullFormattedName.Value
    };
  }

  @computed
  get RecordUri(): number {
    if (this.documentInfo != null) {
      return this.documentInfo.uri;
    }
    return -1;
  }

  @action.bound
  createRecord(recordType: number) {}
}

//export const appStore = new AppStore();
export default AppStore;
