import { observable, action, computed, flow } from "mobx";

export const BASE_URI = "http://localhost/";
export const SERVICEAPI_BASE_URI = BASE_URI + "ServiceAPI";

interface IUserProfile {
  DisplayName: string;
}

export interface IAppStore {
  userProfile: IUserProfile;
}

//configure({ enforceActions: true });

class AppStore implements IAppStore {
  @observable userProfile: IUserProfile = { DisplayName: "" };
  @observable status: string = "WAITING";
  @observable errorMessage: string;

  @action setUserInfo = (data: any) => {
    this.userProfile = {
      DisplayName: data.Results[0].LocationFullFormattedName.Value
    };
  };

  updateUserInfoGenerator = flow(function*(this: AppStore) {
    this.status = "SPINNING";
    const toParam = function(a: any): string {
      return Object.keys(a)
        .map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(a[k]);
        })
        .join("&");
    };

    let url = new URL(`${SERVICEAPI_BASE_URI}/Location/me`);
    url.search = toParam({ properties: ["LocationFullFormattedName"] });

    const response: Response = yield fetch(String(url), {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (response.ok) {
      const data = yield response.json();

      this.userProfile = {
        DisplayName: data.Results[0].LocationFullFormattedName.Value
      };

      this.status = "WAITING";
    } else {
      this.status = "ERROR";

      const data = yield response.json();
      this.errorMessage = data.ResponseStatus.Message;
    }
  });

  @computed
  get someCount() {
    return 56; // would actually calculate something on from the state
  }
}

export const appStore = new AppStore();

//export store;
