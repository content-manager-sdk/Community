import { computed, flow, observable } from "mobx";

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

class AppStore implements IAppStore {
  //@observable userProfile: IUserProfile = { DisplayName: "" };
  @observable status: string = "WAITING";
  @observable errorMessage: string;
  @observable messages: any;
  @observable me: any;

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

    const response: Response = yield fetch(userUrl, fetchOptions);
    const messagesResponse: Response = yield fetch(messagesUrl, fetchOptions);

    if (response.ok && messagesResponse.ok) {
      const data = yield response.json();

      this.me = data.Results[0];

      const messagesData = yield messagesResponse.json();
      this.messages = messagesData.Messages;

      this.status = "WAITING";
    } else {
      this.status = "ERROR";

      const data = yield response.json();
      this.errorMessage = data.ResponseStatus.Message;
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
}

export const appStore = new AppStore();
export default AppStore;
