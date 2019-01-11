import Axios, { AxiosRequestConfig } from "axios";
import { BaseObjectTypes } from "./trim-baseobjecttypes";
import { CommandIds } from "./trim-command-ids";
import TrimMessages from "./trim-messages";

const config = (global as any).config;

const BASE_URI = config.BASE_URL.endsWith("/")
	? config.BASE_URL
	: config.BASE_URL + "/";

export const SERVICEAPI_BASE_URI = BASE_URI + config.SERVICEAPI_PATH;

export type ITokenCallback = (accessToken: string) => void;

export interface ITrimProperty {
	StringValue?: string;
}

export interface ITrimString extends ITrimProperty {
	Value: string;
}

export interface ISearchParamaters {
	trimType: BaseObjectTypes;
	q: string;
	purpose: number;
	purposeExtra?: number;
	start?: number;
}

interface IOptionsInterface {
	accessToken: string;
	path: string;
	method: string;
	data: any;
}

interface IPropertyOrFieldDef {
	Caption: string;
	Id: string;
}

export interface IObjectDetails {
	results: ITrimDetailsObject[];
	propertiesAndFields: IPropertyOrFieldDef[];
}

export interface ISearchResults<T extends ITrimMainObject> {
	hasMoreItems: boolean;
	results: T[];
}

export interface IDriveInformation {
	Id: string;
	Uri: number;
	CommandDefs: ICommandDef[];
}

export interface ITrimMainObject {
	Uri: number;
	NameString?: string;
	CommandDefs?: [];
	PossiblyHasSubordinates?: boolean;
}

export interface ITrimField {
	StringValue: string;
}

export interface ITrimDetailsObject {
	Uri: number;
	Fields?: { [fieldName: string]: ITrimField };
	[x: string]: any;
}

export interface ILocation extends ITrimMainObject {
	FullFormattedName: ITrimString;
}

export interface IClassification extends ITrimMainObject {
	Name: ITrimString;
}

export interface IRecordType extends ITrimMainObject {}
export interface ICommandDef {
	CommandId: string;
	MenuEntryString: string;
	Tooltip: string;
	StatusBarMessage: string;
	IsEnabled: boolean;
}

export interface ISearchClauseDef {
	Id: string;
	InternalName: string;
	Caption: string;
	ToolTip: string;
}

export interface ISearchOptions {
	StartPointForContainers: string;
	StartPointForLocations: string;
	StartPointRecordDefault: string;
	StartPointDefault: string;
	IncludeAlternateWhenShowingFolderContents: boolean;
}

export interface ITrimConnector {
	credentialsResolver: (callback: ITokenCallback) => void;
	getMe(): Promise<ILocation>;
	getMessages(): Promise<any>;
	getSearchClauseDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]>;
	getSearchOptions(): Promise<ISearchOptions>;
	search<T>(
		options: ISearchParamaters
	): Promise<ISearchResults<ITrimMainObject>>;
	getPropertySheet(recordTypeUri: number): Promise<any>;
	registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject>;
	getDriveId(webUrl: string): Promise<IDriveInformation>;
	getObjectDetails(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<IObjectDetails>;

	runAction(commandId: CommandIds, Uri: number): Promise<IDriveInformation>;
}

export class TrimConnector implements ITrimConnector {
	private _searchOptionsCache: ISearchOptions;
	public getSearchOptions(): Promise<ISearchOptions> {
		if (this._searchOptionsCache) {
			return new Promise((resolve) => {
				resolve(this._searchOptionsCache);
			});
		} else {
			return this.makeRequest(
				{ path: "UserOptions/Search", method: "get" },
				(data: any) => {
					this._searchClauseCache = {
						StartPointForContainers:
							data.UserOptions.SearchUserOptionsStartPointForContainers.Value,
						StartPointForLocations:
							data.UserOptions.SearchUserOptionsStartPointForLocations.Value,
						StartPointRecordDefault:
							data.UserOptions.SearchUserOptionsStartPointRecordDefault.Value,
						StartPointDefault:
							data.UserOptions.SearchUserOptionsStartPointDefault.Value,
						IncludeAlternateWhenShowingFolderContents:
							data.UserOptions
								.SearchUserOptionsIncludeAlternateWhenShowingFolderContents
								.Value,
					};
					return this._searchClauseCache;
				}
			);
		}
	}
	private _searchClauseCache = {};

	public getSearchClauseDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]> {
		const params = {
			TrimType: trimType,
		};

		const cachedResults = this._searchClauseCache[trimType];

		if (cachedResults) {
			return new Promise((resolve) => {
				resolve(cachedResults);
			});
		} else {
			return this.makeRequest(
				{ path: "SearchClauseDef", method: "get", data: params },
				(data: any) => {
					this._searchClauseCache[trimType] = data.SearchClauseDefs;
					return data.SearchClauseDefs;
				}
			);
		}
	}
	public credentialsResolver: (callback: ITokenCallback) => void;

	public runAction(
		commandId: CommandIds,
		Uri: number
	): Promise<IDriveInformation> {
		const path = "DriveFile";

		const postBodies = {
			[CommandIds.RecCheckIn]: { Uri, Action: "checkin" },
			[CommandIds.RecDocFinal]: {
				Action: "finalize",
				Uri,
			},
			[CommandIds.AddToFavorites]: {
				Action: "AddToFavorites",
				Uri,
			},
			[CommandIds.RemoveFromFavorites]: {
				Action: "RemoveFromFavorites",
				Uri,
			},
		};

		return this.makeRequest(
			{ path, method: "post", data: postBodies[commandId] },
			(data: any) => {
				return data.Results[0];
			}
		);
	}

	public getObjectDetails(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<IObjectDetails> {
		const params = {
			includePropertyDefs: true,
			propertySets: "Details",
			propertyValue: "String",
			stringDisplayType: "ViewPane",
		};

		return this.makeRequest(
			{ path: `${trimType}/${uri}`, method: "get", data: params },
			(data: any) => {
				return {
					propertiesAndFields: data.PropertiesAndFields[trimType],
					results: data.Results,
				};
			}
		);
	}

	public getDriveId(webUrl: string): Promise<IDriveInformation> {
		return this.makeRequest(
			{ path: "RegisterFile", method: "get", data: { webUrl } },
			(data: any) => {
				return data.Results[0];
			}
		);
	}

	public registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject> {
		const body = {
			...properties,
			RecordRecordType: recordTypeUri,
			properties: "CommandDefs",
		};

		return this.makeRequest(
			{ path: "Record", method: "post", data: body },
			(data: any) => {
				return data.Results[0];
			}
		);
	}

	public getPropertySheet(recordTypeUri: number): Promise<any> {
		const params = {
			properties: "dataentryformdefinition",
		};
		return this.makeRequest(
			{ path: `RecordType/${recordTypeUri}`, method: "get", data: params },
			(data: any) => {
				return data.Results[0].DataEntryFormDefinition;
			}
		);
	}

	private _messageCache: any;
	public getMessages(): Promise<any> {
		const params = {
			MatchMessages: Object.keys(new TrimMessages()).join("|"),
		};

		if (this._messageCache) {
			return new Promise((resolve) => {
				resolve(this._messageCache);
			});
		} else {
			return this.makeRequest(
				{ path: "Localisation", method: "get", data: params },
				(data: any) => {
					// temporary - need to go in TRIM Messages
					data.Messages.web_Register = "Register in Content Manager";
					data.Messages.web_SelectRecordType = "Select a Record Type";
					data.Messages.web_Actions = "Actions";
					data.Messages.web_Checkin = "Check In";
					data.Messages.web_Finalize = "Make Final";
					data.Messages.bob_sbMe = "Me";

					this._messageCache = data.Messages;

					return data.Messages;
				}
			);
		}
	}

	public search<T extends ITrimMainObject>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		const { q, purpose, trimType, start, purposeExtra } = options;

		const params = {
			pageSize: 20,
			properties: "NameString,PossiblyHasSubordinates",
			purpose,
			q,
			start,
		};

		if (purposeExtra) {
			params["purposeExtra"] = purposeExtra;
		}

		if (trimType === BaseObjectTypes.Classification) {
			params.properties += ",Name";
		}

		params.start = params.start || 1;

		return this.makeRequest(
			{ path: trimType, method: "get", data: params },
			(data: any) => {
				return {
					hasMoreItems: data.HasMoreItems,
					results: data.Results.map((trimObject: T) => {
						let newObject = {};

						for (var key in trimObject) {
							
							if (key.startsWith(trimType)) {
								newObject[key.substring(trimType.length)] = trimObject[key];
							} else {
								newObject[key as string] = trimObject[key];
							}
						}

						return newObject;
					}),
				};
			}
		);
	}

	public getMe(): Promise<ILocation> {
		const params = {
			properties: "LocationFullFormattedName",
		};

		return this.makeRequest(
			{ path: "Location/me", method: "get", data: params },
			(data: any) => {
				return {
					FullFormattedName: data.Results[0].LocationFullFormattedName,
					Uri: data.Results[0].Uri,
				};
			}
		);
	}

	private makeOptions = (config: IOptionsInterface): AxiosRequestConfig => {
		const headers = { Accept: "application/json", Authorization: "" };

		if (config.accessToken) {
			headers.Authorization = `Bearer ${config.accessToken}`;
		}

		if (config.method === "post") {
			headers["Content-Type"] = "application/json";
		}

		const options = {
			headers,
			method: config.method,
			url: `${SERVICEAPI_BASE_URI}/${config.path}`,
		};

		if (config.method === "post") {
			return { ...options, ...{ data: config.data } };
		} else {
			return { ...options, ...{ params: config.data } };
		}
	};

	private makeRequest<T>(config: any, parseCallback: any): Promise<T> {
		return new Promise((resolve, reject) => {
			this.credentialsResolver((accessToken) => {
				const options = this.makeOptions({ ...{ accessToken }, ...config });

				Axios(options)
					.then((response) => {
						if (
							response.data.CommandDefs ||
							response.data.Messages ||
							response.data.SearchClauseDefs ||
							response.data.UserOptions ||
							response.data.Results
						) {
							resolve(parseCallback(response.data));
						} else {
							reject({ message: "No results found" }); // needs to come from TrimMessages
						}
					})
					.catch((error) => {
						if (error.response) {
							reject({
								message: error.response.data.ResponseStatus.Message,
							});
						} else {
							reject({
								message: error.message,
							});
						}
					});
			});
		});
	}
}

export default TrimConnector;
