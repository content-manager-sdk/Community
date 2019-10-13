import Axios, { AxiosRequestConfig } from "axios";
import { BaseObjectTypes } from "./trim-baseobjecttypes";
import { CommandIds } from "./trim-command-ids";
import TrimMessages from "./trim-messages";

const config = (global as any).config;

const BASE_URI = config.BASE_URL.endsWith("/")
	? config.BASE_URL
	: config.BASE_URL + "/";

export const SERVICEAPI_BASE_URI = BASE_URI + config.SERVICEAPI_PATH;

export type ITokenCallback = (
	accessToken: string,
	errorMessage: string
) => void;

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
	sortBy?: string;
	filter?: string;
}

interface IOptionsInterface {
	accessToken: string;
	path: string;
	method: string;
	data: any;
}

export interface IPropertyOrFieldDef {
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

export interface IEnumDetails {
	Id: string;
	Caption: string;
}

export interface IEnums {
	RecordRelationshipType: IEnumDetails[];
}

export interface IDriveInformation {
	Id: string;
	Uri: number;
	RecordType: string;
	CommandDefs: ICommandDef[];
	Options: ITrimOptions;
	Enums: IEnums;
}

export interface IIcon {
	FileType: string;
	Id: string;
}

export interface ITrimMainObject {
	Icon?: IIcon;
	Uri: number;
	NameString?: string;
	CommandDefs?: ICommandDef[];
	PossiblyHasSubordinates?: boolean;
	ToolTip?: string;
	Selected?: boolean;
	TrimType?: BaseObjectTypes;
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

export interface ITrimOptions {
	DefaultDocumentRecordType: number;
}

export interface IObjectDef {
	Id: string;
	Caption: string;
	CaptionPlural: string;
}

export interface ISearchClauseDef {
	Id: string;
	InternalName: string;
	Caption: string;
	ToolTip: string;
	MethodGroup: string;
	IsBlocked: boolean;
}

export interface ISearchClauseOrFieldDef {
	Caption: string;
	MethodGroup: string;
	ClauseName: string;
	IsRecent: boolean;
	IsFavorite: boolean;
	ParameterFormat: string;
	SearchParameterFormat: string;
	ClauseDef: ISearchClauseDef;
}

export interface ISearchOptions {
	StartPointForContainers: string;
	StartPointForLocations: string;
	StartPointRecordDefault: string;
	StartPointDefault: string;
	IncludeAlternateWhenShowingFolderContents: boolean;
	ContentsInReverseDateOrder: boolean;
}

export interface IDatabase {
	CurrencySymbol: string;
}

export interface ITrimConnector {
	cancel: () => void;
	credentialsResolver: (callback: ITokenCallback) => void;
	getMe(): Promise<ILocation>;
	getMessages(): Promise<any>;
	getSearchClauseDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]>;
	getSearchClauseOrFieldDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseOrFieldDef[]>;

	getObjectDefinitions(): Promise<IObjectDef[]>;
	getObjectCaption(trimType: BaseObjectTypes): Promise<string>;
	getSearchOptions(): Promise<ISearchOptions>;
	getDatabaseProperties(): Promise<IDatabase>;
	search<T>(
		options: ISearchParamaters
	): Promise<ISearchResults<ITrimMainObject>>;
	getPropertySheet(recordTypeUri: number): Promise<any>;
	registerInTrim(
		recordTypeUri: number,
		properties: any
	): Promise<ITrimMainObject>;
	getDriveUrl(recordUri: number): Promise<string>;
	getRecordAsText(recordUri: number): Promise<string>;
	getDriveId(webUrl: string): Promise<IDriveInformation>;
	getObjectDetails(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<IObjectDetails>;

	runAction(
		commandId: CommandIds,
		uri: number,
		fileName: string,
		webUrl: string
	): Promise<IDriveInformation>;

	createRelationship(
		uri: number,
		relatedRecord: number,
		relationshipType: string
	): Promise<void>;

	writeFileSlice(data: number[], fileName: string): Promise<string>;
	makeFriendlySearchQuery(trimType: BaseObjectTypes, query: string): string;

	setLatestClause(trimType: BaseObjectTypes, queryName: string): void;
	getLatestClause(trimType: BaseObjectTypes): string;
	setViewPaneProperties(
		trimObject: ITrimMainObject,
		propertyIds: string[]
	): Promise<IPropertyOrFieldDef[]>;
}

export class TrimConnector implements ITrimConnector {
	private CancelToken = Axios.CancelToken;
	private source = this.CancelToken.source();
	private _databaseProperties: IDatabase;

	public cancel(): void {
		this.source.cancel();
	}

	public makeFriendlySearchQuery(
		trimType: BaseObjectTypes,
		query: string
	): string {
		switch (trimType) {
			case BaseObjectTypes.Record:
				return `recAnyWord:${query}* OR recNumber:${query}*`;
			case BaseObjectTypes.Location:
				return `locGivenNames:${query}* OR locSortName:${query}* OR locLogin:${query}*`;
			case BaseObjectTypes.Classification:
				return `plnWord:${query}* OR plnTitle:${query}*`;
			default:
				return `${query}*`;
		}
	}

	public setLatestClause(trimType: BaseObjectTypes, queryName: string): void {
		const cacheValue = this.getFromCache("latest-query") || {};
		cacheValue[trimType] = queryName;

		this.setCache("latest-query", cacheValue);
	}
	public getLatestClause(trimType: BaseObjectTypes): string {
		return (this.getFromCache("latest-query") || {})[trimType];
	}

	public getDatabaseProperties(): Promise<IDatabase> {
		if (this._databaseProperties) {
			return new Promise((resolve) => {
				resolve(this._databaseProperties);
			});
		} else {
			return this.makeRequest(
				{
					path: "Database",
					method: "get",
					data: { properties: "DatabaseCurrencySymbol" },
				},
				(data: any) => {
					const prefix = "Database";
					let databaseProperties = {};
					for (const key in data.Results[0]) {
						if (key.startsWith(prefix)) {
							databaseProperties[key.substring(prefix.length)] =
								data.Results[0][key].Value;
						} else {
							databaseProperties[key as string] = data.Results[0][key].Value;
						}
					}

					return (this._databaseProperties = databaseProperties as IDatabase);
				}
			);
		}
	}

	public getSearchOptions(): Promise<ISearchOptions> {
		const cachedOptions = this.getFromCache("search-options");
		if (cachedOptions) {
			return new Promise((resolve) => {
				resolve(cachedOptions);
			});
		} else {
			return this.makeRequest(
				{ path: "UserOptions/Search", method: "get" },
				(data: any) => {
					const prefix = "SearchUserOptions";
					const searchOptionsCache = {};
					for (let key in data.UserOptions) {
						if (key.startsWith(prefix)) {
							searchOptionsCache[key.substring(prefix.length)] =
								data.UserOptions[key].Value;
						} else {
							searchOptionsCache[key as string] = data.UserOptions[key].Value;
						}
					}
					this.setCache("search-options", searchOptionsCache);
					return searchOptionsCache as ISearchOptions;
				}
			);
		}
	}

	private getFromCache(key: string): any {
		const cacheItem = localStorage.getItem(key);
		if (cacheItem) {
			return JSON.parse(cacheItem);
		}
		return null;
	}

	private setCache(key: string, cacheData: any) {
		localStorage.setItem(key, JSON.stringify(cacheData));
	}

	public getObjectCaption(trimType: BaseObjectTypes): Promise<string> {
		return new Promise((resolve) => {
			this.getObjectDefinitions().then((objectDefs) => {
				const objectDef = objectDefs.find((objectDef) => {
					return objectDef.Id == trimType;
				});
				if (objectDef) {
					resolve(objectDef.Caption);
				} else {
					resolve(trimType);
				}
			});
		});
	}

	public getObjectDefinitions(): Promise<IObjectDef[]> {
		const params = {
			ObjectType: "Main",
		};

		let cachedResults = this.getFromCache("object-definitions");

		if (cachedResults) {
			return new Promise((resolve) => {
				resolve(cachedResults);
			});
		} else {
			return this.makeRequest(
				{ path: "ObjectDef", method: "get", data: params },
				(data: any) => {
					cachedResults = data.ObjectDefs;
					this.setCache("ObjectDef", cachedResults);

					return data.ObjectDefs;
				}
			);
		}
	}
	public getSearchClauseDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseDef[]> {
		const params = {
			TrimType: trimType,
		};

		const cachedResults = this.getFromCache("search-clauses") || {};

		if (cachedResults[trimType]) {
			return new Promise((resolve) => {
				resolve(cachedResults[trimType]);
			});
		} else {
			return this.makeRequest(
				{ path: "SearchClauseDef", method: "get", data: params },
				(data: any) => {
					cachedResults[trimType] = data.SearchClauseDefs;
					this.setCache("search-clauses", cachedResults);
					//this._searchClauseCache[trimType] = data.SearchClauseDefs;
					return data.SearchClauseDefs;
				}
			);
		}
	}

	public getSearchClauseOrFieldDefinitions(
		trimType: BaseObjectTypes
	): Promise<ISearchClauseOrFieldDef[]> {
		const params = {
			TrimType: trimType,
		};

		const cachedResults = this.getFromCache("search-field-clauses") || {};

		if (cachedResults[trimType]) {
			return new Promise((resolve) => {
				resolve(cachedResults[trimType]);
			});
		} else {
			return this.makeRequest(
				{ path: "SearchClauseOrFieldDef", method: "get", data: params },
				(data: any) => {
					cachedResults[trimType] = data.SearchClauseOrFieldDefs;
					this.setCache("search-field-clauses", cachedResults);
					//this._searchClauseCache[trimType] = data.SearchClauseDefs;
					return data.SearchClauseOrFieldDefs;
				}
			);
		}
	}
	public credentialsResolver: (callback: ITokenCallback) => void;

	writeFileSlice(data: number[], fileName: string): Promise<string> {
		return this.makeRequest(
			{ path: "WriteFile", method: "post", data: { data, fileName } },
			(data: any) => {
				return data.FileName;
			}
		);
	}

	public runAction(
		commandId: CommandIds,
		uri: number,
		fileName: string,
		webUrl: string
	): Promise<IDriveInformation> {
		const path = "DriveFile";

		const postBodies = {
			[CommandIds.RecCheckIn]: { uri, Action: "checkin", fileName, webUrl },
			[CommandIds.RecDocFinal]: {
				Action: "finalize",
				uri,
			},
			[CommandIds.AddToFavorites]: {
				Action: "AddToFavorites",
				uri,
			},
			[CommandIds.RemoveFromFavorites]: {
				Action: "RemoveFromFavorites",
				uri,
			},
		};

		return this.makeRequest(
			{ path, method: "post", data: postBodies[commandId] },
			(data: any) => {
				return data.Results[0];
			}
		);
	}

	public setViewPaneProperties(
		trimObject: ITrimMainObject,
		propertyIds: string[]
	): Promise<IPropertyOrFieldDef[]> {
		const path = "PropertyDef";

		const postBody = {
			TrimType: trimObject.TrimType,
			ForObject: trimObject.Uri,
			PropertiesAndFields: propertyIds.map((pid) => {
				return { Id: pid };
			}),
			ListType: "Detailed",
		};

		return this.makeRequest(
			{ path, method: "post", data: postBody },
			(data: any) => {
				return data.PropertiesAndFields;
			}
		);
	}

	public createRelationship(
		uri: number,
		relatedRecord: number,
		relationshipType: string
	): Promise<void> {
		const body = {
			Uri: uri,
			ChildRelationships: [
				{
					RecordRelationshipRelationType: `${relationshipType}`,
					RecordRelationshipRelatedRecord: { Uri: relatedRecord },
				},
			],
		};

		return this.makeRequest(
			{ path: "Record", method: "post", data: body },
			(data: any) => {
				return;
			}
		);
	}

	public getObjectDetails(
		trimType: BaseObjectTypes,
		uri: number
	): Promise<IObjectDetails> {
		const params = {
			includePropertyDefs: true,
			propertySets: "Detailed",
			propertyValue: "String",
			stringDisplayType: "ViewPane",
			properties: "ToolTip,NameString",
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
				return data.Results
					? data.Results[0]
					: { Id: "", Uri: 0, CommandDefs: [] };
			}
		);
	}

	public getDriveUrl(recordUri: number): Promise<string> {
		return this.makeRequest(
			{ path: `OpenFile/${recordUri}`, method: "get" },
			(data: any) => {
				return JSON.stringify(data);
			}
		);
	}

	public getRecordAsText(recordUri: number): Promise<string> {
		return this.makeRequest(
			{ path: `GetFile`, method: "get", data: { uri: recordUri } },
			(data: any) => {
				return data.File;
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

	public getMessages(): Promise<any> {
		const params = {
			MatchMessages: Object.keys(new TrimMessages()).join("|"),
		};

		const messageCache = this.getFromCache("messages");

		if (messageCache) {
			return new Promise((resolve) => {
				resolve(messageCache);
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
					data.Messages.web_GoToTextSearch = "Go to text search";
					data.Messages.web_GoToAdvancedSearch = "Go to advanced search";
					data.Messages.web_GoToCM = "Open in Content Manager";
					data.Messages.web_Paste = "Paste";
					data.Messages.web_Paste_Title = "Title";
					data.Messages.web_Paste_Number = "Number";
					data.Messages.web_Paste_Link = "Link";
					data.Messages.web_Please_Select = "Please select a Record";
					data.Messages.web_Show = "Show";
					data.Messages.web_in_Same_Container = "in same container";
					data.Messages.web_with_Same_Contacts = "with same contacts";
					data.Messages.web_Related_To = "related to";
					data.Messages.web_All_Related_To = "all related to";
					data.Messages.web_Search_Content = "Content:";
					data.Messages.web_Add_Relationship = "Add relationship";
					data.Messages.web_Add_RelationshipTitle =
						"Add relationship from the open document to the selected record.";
					this.setCache("messages", data.Messages);
					//this._messageCache = data.Messages;

					return data.Messages;
				}
			);
		}
	}

	public search<T extends ITrimMainObject>(
		options: ISearchParamaters
	): Promise<ISearchResults<T>> {
		const {
			q,
			purpose,
			trimType,
			start,
			purposeExtra,
			sortBy,
			filter,
		} = options;

		const params = {
			pageSize: 30,
			properties: "NameString,PossiblyHasSubordinates,Icon",
			purpose,
			q,
			start,
			ExcludeCount: true,
		};

		if (sortBy) {
			params["sortBy"] = sortBy;
		}

		if (filter) {
			params["filter"] = filter;
		}

		if (purposeExtra) {
			params["purposeExtra"] = purposeExtra;
		}

		if (trimType === BaseObjectTypes.Classification) {
			params.properties += ",Name";
		}

		if (trimType === BaseObjectTypes.Record) {
			params.properties += ",Tooltip";
		}

		params.start = params.start || 1;

		return this.makeRequest(
			{ path: trimType, method: "get", data: params },
			(data: any) => {
				return {
					hasMoreItems: data.HasMoreItems,
					results: data.Results.map((trimObject: T) => {
						const newObject = {};

						for (const key in trimObject) {
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
		this.source = this.CancelToken.source();

		return new Promise((resolve, reject) => {
			this.credentialsResolver((accessToken, errorMessage) => {
				if (errorMessage) {
					reject({ message: errorMessage });
				}

				const options = this.makeOptions({ ...{ accessToken }, ...config });
				options.cancelToken = this.source.token;
				Axios(options)
					.then((response) => {
						if (
							response.data.CommandDefs ||
							response.data.Messages ||
							response.data.SearchClauseDefs ||
							response.data.SearchClauseOrFieldDefs ||
							response.data.ObjectDefs ||
							response.data.UserOptions ||
							response.data.WebUrl ||
							response.data.Results ||
							response.data.FileName ||
							response.data.File ||
							response.data.PropertiesAndFields
						) {
							resolve(parseCallback(response.data));
						} else {
							reject({ message: "No results found" }); // needs to come from TrimMessages
						}
					})
					.catch((error) => {
						if (Axios.isCancel(error)) {
						} else {
							if (
								error.response &&
								error.response.data &&
								error.response.data.ResponseStatus
							) {
								reject({
									data: error,
									message:
										error.response.data.ResponseStatus.Message ||
										error.response.data.ResponseStatus.ErrorCode,
								});
							} else {
								reject({
									data: error,
									message: error.message,
								});
							}
						}
					});
			});
		});
	}
}

export default TrimConnector;
