import { computed, flow, observable } from "mobx";
import {
  IWordConnector,
  IGetRecordUriResponse
} from "../office-coms/word-connector";

const BASE_URI = "http://localhost/";
export const SERVICEAPI_BASE_URI = BASE_URI + "ServiceAPI";

export interface IUserProfile {
  DisplayName: string;
}

export interface IAppStore {
  status: string;
  UserProfile?: IUserProfile;
  errorMessage?: string;
}

//configure({ enforceActions: true });

export class AppStore implements IAppStore {
  constructor(private wordConnector: IWordConnector) {}
  @observable status: string = "WAITING";
  @observable errorMessage: string;
  @observable messages: any;
  @observable me: any;
  @observable documentInfo: IGetRecordUriResponse;

  private makeUrl = (path: string, query: any) => {
    const toParam = function(a: any): string {
      return Object.keys(a)
        .map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(a[k]);
        })
        .join("&");
    };

    let url = new URL(`${SERVICEAPI_BASE_URI}/${path}`);
    url.search = toParam(query);
    return String(url);
  };

  fetchBaseSettingFromTrim = flow(function*(this: AppStore) {
    this.status = "SPINNING";

    const fetchOptions: RequestInit = {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: { Accept: "application/json" }
    };

    const userUrl = this.makeUrl("Location/me", {
      properties: ["LocationFullFormattedName"]
    });

    const messagesUrl = this.makeUrl("Localisation", {
      MatchMessages: ["web_HPRM"]
    });

    try {
      const response: Response = yield fetch(userUrl, fetchOptions);
      const messagesResponse: Response = yield fetch(messagesUrl, fetchOptions);
      this.documentInfo = yield this.wordConnector.getUri();

      if (response.ok && messagesResponse.ok) {
        const data = yield response.json();

        this.me = data.Results[0];

        const messagesData = yield messagesResponse.json();
        this.messages = messagesData.Messages;
        // if (document !== undefined) {
        //   let el = document.getElementById("AppForOfficePanel0-title");
        //   if (el !== null) {
        //     el!.innerText = this.ApplicationDisplayName;
        //   }
        // }

        this.status = "WAITING";
      } else {
        this.status = "ERROR";

        const data = yield response.json();
        this.errorMessage = data.ResponseStatus.Message;
        return;
      }

      if (this.documentInfo.found || !this.documentInfo.message) {
        this.status = "WAITING";
      } else {
        this.status = "ERROR";

        const data = yield response.json();
        this.errorMessage = data.ResponseStatus.Message;
      }
    } catch (error) {
      this.status = "ERROR";
      this.errorMessage = error.message;
    }
  });

  @computed
  get ApplicationDisplayName() {
    if (this.messages) {
      return this.messages.web_HPRM; // would actually calculate something on from the state
    } else {
      return "";
    }
  }

  @computed
  get UserProfile(): IUserProfile {
    return {
      DisplayName: this.me.LocationFullFormattedName.Value
    };
  }

  @computed
  get RecordUri(): number {
    if (this.documentInfo != null) {
      return this.documentInfo.uri;
    }
    return -1;
  }
}

//export const appStore = new AppStore();
export default AppStore;
