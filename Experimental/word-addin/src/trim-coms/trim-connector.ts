import { BASE_URI } from "../stores/AppStore";
import TrimMessages from "./trim-messages";

export const SERVICEAPI_BASE_URI = BASE_URI + "ServiceAPI";

export interface TrimString {
  Value: string;
}

export interface ILocation {
  Uri: number;
  FullFormattedName: TrimString;
}
export interface ITrimConnector {
  getMe(): Promise<ILocation>;
  getMessages(): Promise<any>;
}

export class TrimConnector implements ITrimConnector {
  private makeOptions = (): RequestInit => {
    return {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: { Accept: "application/json" }
    };
  };

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

  getMessages(): Promise<any> {
    const url = this.makeUrl("Localisation", {
      MatchMessages: [TrimMessages.web_HPRM]
    });

    const options = this.makeOptions();

    return new Promise(function(resolve, reject) {
      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          if (data.Messages) {
            resolve(data.Messages);
          } else {
            reject({ message: data.ResponseStatus.Message });
          }
        });
    });
  }

  getMe(): Promise<ILocation> {
    const userUrl = this.makeUrl("Location/me", {
      properties: ["LocationFullFormattedName"]
    });

    const options = this.makeOptions();
    return new Promise(function(resolve, reject) {
      fetch(userUrl, options)
        .then(response => response.json())
        .then(data => {
          if (data.Results && data.Results[0]) {
            resolve({
              Uri: data.Results[0].Uri,
              FullFormattedName: data.Results[0].LocationFullFormattedName
            });
          } else {
            reject({ message: data.ResponseStatus.Message });
          }
        });
    });
  }
}

export default TrimConnector;
