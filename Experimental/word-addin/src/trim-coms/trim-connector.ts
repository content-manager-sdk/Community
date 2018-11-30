import { BASE_URI } from "../stores/AppStore";
import { BaseObjectTypes } from "./trim-baseobjecttypes";
import TrimMessages from "./trim-messages";

export const SERVICEAPI_BASE_URI = BASE_URI + "ServiceAPI";

export interface ITrimString {
	Value: string;
}

export interface ITrimMainObject {
	Uri: number;
	NameString?: string;
}

export interface ILocation extends ITrimMainObject {
	FullFormattedName: ITrimString;
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
	getPropertySheet(recordTypeUri: number): Promise<any>;
	registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject>;
}

export class TrimConnector implements ITrimConnector {
	public registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject> {
		const url = this.makeUrl(`Record`);
		const body = { ...properties, RecordRecordType: recordTypeUri };

		const options = this.makeOptions("POST", body);

		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.Results && data.Results.length > 0) {
						resolve(data.Results[0]);
					} else {
						reject({ message: data.ResponseStatus.Message });
					}
				});
		});
	}

	public getPropertySheet(recordTypeUri: number): Promise<any> {
		const url = this.makeUrl(`RecordType/${recordTypeUri}`, {
			properties: ["dataentryformdefinition"],
		});

		const options = this.makeOptions();

		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.Results && data.Results.length > 0) {
						resolve(data.Results[0].DataEntryFormDefinition);
					} else {
						reject({ message: data.ResponseStatus.Message });
					}
				});
		});
	}

	public getMessages(): Promise<any> {
		const url = this.makeUrl("Localisation", {
			MatchMessages: [Object.keys(new TrimMessages()).join("|")],
		});

		const options = this.makeOptions();

		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.Messages) {
						resolve(data.Messages);
					} else {
						reject({ message: data.ResponseStatus.Message });
					}
				});
		});
	}

	public search<T extends ITrimMainObject>(
		trimType: BaseObjectTypes,
		q: string,
		purpose: number = 0
	): Promise<T[]> {
		const url = this.makeUrl(trimType, {
			properties: ["NameString"],
			purpose,
			q,
		});

		const options = this.makeOptions();
		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.Results && data.Results.length > 0) {
						const trimObjects = data.Results.map((trimObject: T) => {
							return trimObject;
						});
						resolve(trimObjects);
					} else {
						reject({ message: data.ResponseStatus.Message });
					}
				});
		});
	}

	public getMe(): Promise<ILocation> {
		const userUrl = this.makeUrl("Location/me", {
			properties: ["LocationFullFormattedName"],
		});

		const options = this.makeOptions();
		return new Promise((resolve, reject) => {
			fetch(userUrl, options)
				.then((response) => response.json())
				.then((data) => {
					if (data.Results && data.Results[0]) {
						resolve({
							FullFormattedName: data.Results[0].LocationFullFormattedName,
							Uri: data.Results[0].Uri,
						});
					} else {
						reject({ message: data.ResponseStatus.Message });
					}
				});
		});
	}

	private makeOptions = (
		method: string = "GET",
		body: any = undefined
	): RequestInit => {
		const headers = { Accept: "application/json" };
		if (method === "POST") {
			headers["Content-Type"] = "application/json";
		}
		return {
			body: JSON.stringify(body),
			credentials: "include",
			headers: headers,
			method,
			mode: "cors",
		};
	};

	private makeUrl = (path: string, query: any = {}) => {
		const toParam = (a: any): string => {
			return Object.keys(a)
				.map((k) => {
					return encodeURIComponent(k) + "=" + encodeURIComponent(a[k]);
				})
				.join("&");
		};

		const url = new URL(`${SERVICEAPI_BASE_URI}/${path}`);
		url.search = toParam(query);
		return String(url);
	};
}

export default TrimConnector;
