import { BASE_URI } from "../stores/AppStore";
import { BaseObjectTypes } from "./trim-baseobjecttypes";
import TrimMessages from "./trim-messages";
import Axios, { AxiosRequestConfig } from "axios";

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
	getDriveId(token: string, webUrl: string): Promise<string>;
	CredentialsResolver: Promise<string>;
}

export class TrimConnector implements ITrimConnector {
	CredentialsResolver: Promise<string>;

	public getDriveId(webUrl: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(token, "RegisterFile", "get", {
					webUrl,
				});

				Axios(options)
					.then((response) => resolve(response.data.Id))
					.catch((error) => {
						console.log(JSON.stringify(error.response.statusText));
					});
			});
		});
	}

	public registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject> {
		const body = { ...properties, RecordRecordType: recordTypeUri };

		//	const options = this.makeOptions("POST", body);

		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(token, "Record", "post", body);

				Axios(options).then((response) => {
					if (response.data.Results && response.data.Results.length > 0) {
						resolve(response.data.Results[0]);
					} else {
						reject({ message: response.data.ResponseStatus.Message });
					}
				});
			});
		});
	}

	public getPropertySheet(recordTypeUri: number): Promise<any> {
		const params = {
			properties: ["dataentryformdefinition"],
		};

		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(
					token,
					`RecordType/${recordTypeUri}`,
					"get",
					params
				);

				Axios(options)
					.then((response) => {
						if (response.data.Results && response.data.Results.length > 0) {
							resolve(response.data.Results[0].DataEntryFormDefinition);
						} else {
							reject({ message: "No results found" }); // needs to come from TrimMessages
						}
					})
					.catch((response) => {
						reject({
							message: response.response.data.ResponseStatus.Message,
						});
					});
			});
		});
	}

	public getMessages(): Promise<any> {
		const params = {
			MatchMessages: [Object.keys(new TrimMessages()).join("|")],
		};

		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(token, "Localisation", "get", params);

				Axios(options).then((response) => {
					if (response.data.Messages) {
						resolve(response.data.Messages);
					} else {
						reject({ message: response.data.ResponseStatus.Message });
					}
				});
			});
		});
	}

	public search<T extends ITrimMainObject>(
		trimType: BaseObjectTypes,
		q: string,
		purpose: number = 0
	): Promise<T[]> {
		const params = {
			properties: ["NameString"],
			purpose,
			q,
		};

		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(token, trimType, "get", params);

				Axios(options).then((response) => {
					if (response.data.Results && response.data.Results.length > 0) {
						const trimObjects = response.data.Results.map((trimObject: T) => {
							return trimObject;
						});
						resolve(trimObjects);
					} else {
						reject({ message: response.data.ResponseStatus.Message });
					}
				});
			});
		});
	}

	public getMe(): Promise<ILocation> {
		const params = {
			properties: ["LocationFullFormattedName"],
		};

		return new Promise((resolve, reject) => {
			this.CredentialsResolver.then((token) => {
				const options = this.makeOptions(token, "Location/me", "get", params);

				Axios(options)
					.then((response) => {
						if (response.data.Results && response.data.Results[0]) {
							resolve({
								FullFormattedName:
									response.data.Results[0].LocationFullFormattedName,
								Uri: response.data.Results[0].Uri,
							});
						} else {
							reject({ message: response.data.ResponseStatus.Message });
						}
					})
					.catch((response) => {
						reject({
							message: response.data.ResponseStatus.Message,
						});
					});
			});
		});
	}

	private makeOptions = (
		accessToken: string,
		path: string,
		method: string = "get",
		data: any = undefined
	): AxiosRequestConfig => {
		const headers = { Accept: "application/json" };

		if (accessToken) {
			headers["Authorization"] = `Bearer ${accessToken}`;
		}

		if (method === "POST") {
			headers["Content-Type"] = "application/json";
		}

		let options = {
			url: `${SERVICEAPI_BASE_URI}/${path}`,
			headers,
			method,
		};

		if (method === "POST") {
			return { ...options, ...{ data } };
		} else {
			return { ...options, ...{ params: data } };
		}
	};
}

export default TrimConnector;
