import { BASE_URI } from "../stores/AppStore";
import TrimMessages from "./trim-messages";
import { BaseObjectTypes } from "./trim-baseobjecttypes";

export const SERVICEAPI_BASE_URI = BASE_URI + "ServiceAPI";

export interface TrimString {
  Value: string;
}

export interface ITrimMainObject {
  Uri: number;
  NameString?: string;
}

export interface ILocation extends ITrimMainObject {
  FullFormattedName: TrimString;
}

export interface IRecordType extends ITrimMainObject {}

export interface ITrimConnector {
  getMe(): Promise<ILocation>;
  getMessages(): Promise<any>;
  search<T>(
    trimType: BaseObjectTypes,
    query: string,
    purpose: number
  ): Promise<ITrimMainObject[]>;
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
      MatchMessages: [Object.keys(new TrimMessages()).join("|")]
    });
    console.log(url);
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

  search<T extends ITrimMainObject>(
    trimType: BaseObjectTypes,
    query: string,
    purpose: number = 0
  ): Promise<T[]> {
    const url = this.makeUrl(trimType, {
      properties: ["NameString"],
      q: query,
      purpose: purpose
    });

    const options = this.makeOptions();
    return new Promise(function(resolve, reject) {
      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          if (data.Results && data.Results.length > 0) {
            const trimObjects = data.Results.map(function(trimObject: T) {
              return trimObject;
            });
            resolve(trimObjects);
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
