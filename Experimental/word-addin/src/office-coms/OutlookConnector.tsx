import { OfficeConnector, IOfficeConnector } from "./office-connector";
import { ITrimConnector } from "../trim-coms/trim-connector";
import { IAppStore } from "../stores/AppStoreBase";
import Axios from "axios";

// interface IOutlookFolderItem {
// 	Id: string;
// 	DisplayName: any;
// 	SingleValueExtendedProperties: any;
// 	WellKnownName: string;
// }

export interface IOutlookFolder {
	id: string;
	displayName: string;
}
const T_NS = "http://schemas.microsoft.com/exchange/services/2006/types";
export class OutlookConnector extends OfficeConnector
	implements IOfficeConnector {
	_customProps: Office.CustomProperties;

	private loadCustomProps(): Promise<void> {
		return new Promise<void>((resolve) => {
			Office.context.mailbox.item.loadCustomPropertiesAsync((asyncResult) => {
				if (asyncResult.status == Office.AsyncResultStatus.Failed) {
					// Handle the failure.
				} else {
					this._customProps = asyncResult.value;
					resolve();
				}
			});
		});
	}

	public initialize(trimConnector: ITrimConnector, appStore: IAppStore): void {
		this.loadCustomProps().then();

		const handlerFN = () => {
			if (Office.context.mailbox.item) {
				appStore.setStatus("STARTING");
				this.loadCustomProps().then(() => {
					this.getWebUrl().then((webUrl) => {
						trimConnector
							.getDriveId(webUrl, true, this.getRecordUri())
							.then((driveInfo) => {
								appStore.setDocumentInfo(driveInfo);
								appStore.setStatus("WAITING");
							})
							.catch((error) => {
								appStore.setError(error, "fetch base settings for dialog");
							});
					});
				});
			}
		};

		Office.context.mailbox.addHandlerAsync(
			Office.EventType.ItemChanged,
			handlerFN
		);
	}

	getRecordUri(): number {
		const prop = Number(this._customProps.get("TRIM_URI"));

		if (isNaN(prop)) {
			return 0;
		} else {
			return prop;
		}
	}
	public getWebUrl(): Promise<string> {
		return new Promise<string>(function(resolve) {
			if (Office.context.mailbox.diagnostics.hostName === "OutlookIOS") {
				// itemId is already REST-formatted.
				resolve(Office.context.mailbox.item.itemId);
			} else {
				// Convert to an item ID for API v2.0.
				resolve(
					Office.context.mailbox.convertToRestId(
						Office.context.mailbox.item.itemId,
						Office.MailboxEnums.RestVersion.v2_0
					)
				);
			}
		});
	}

	getUri(): Promise<import("./word-connector").IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}
	setUri(
		uri: number
	): Promise<import("./word-connector").IGetRecordUriResponse> {
		throw new Error("Method not implemented.");
	}
	insertText(textToInsert: string): void {
		throw new Error("Method not implemented.");
	}
	insertLink(textToInsert: string, url: string): void {
		throw new Error("Method not implemented.");
	}

	makeEwsXml(): string {
		let result =
			'<?xml version="1.0" encoding="utf-8"?>' +
			'<soap:Envelope xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"' +
			'               xmlns:xsd="https://www.w3.org/2001/XMLSchema"' +
			'               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
			'               xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
			"  <soap:Header>" +
			'    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
			"  </soap:Header>" +
			"  <soap:Body>" +
			'    <FindFolder Traversal="Deep" xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">' +
			"      <FolderShape>" +
			"        <t:BaseShape>Default</t:BaseShape>" +
			"        <t:AdditionalProperties>" +
			'         <t:FieldURI FieldURI="folder:DistinguishedFolderId" />' +
			'         <t:FieldURI FieldURI="folder:ParentFolderId" />' +
			'         <t:FieldURI FieldURI="folder:FolderClass" />' +
			'         <t:FieldURI FieldURI="folder:PolicyTag" />' +
			"        </t:AdditionalProperties>" +
			"    </FolderShape>" +
			"    <ParentFolderIds>" +
			'      <t:DistinguishedFolderId Id="msgfolderroot"/>' +
			"    </ParentFolderIds>" +
			"    </FindFolder>" +
			"  </soap:Body>" +
			"</soap:Envelope>";

		return result;
	}

	getParentFolders(
		folderElements: HTMLCollectionOf<Element>,
		parentIdEl: HTMLCollectionOf<Element>
	): Element[] {
		let parentEl = null;
		let parentIdElement = parentIdEl;
		const parents: Element[] = [];
		do {
			if (parentIdEl.length > 0) {
				parentEl = this.getParentFolder(folderElements, parentIdElement);

				if (parentEl !== null) {
					parentIdElement = parentEl.getElementsByTagNameNS(
						T_NS,
						"ParentFolderId"
					);
					parents.splice(0, 0, parentEl);
				}
			}
		} while (parentEl !== null);
		return parents;
	}

	getParentFolder(
		folderElements: HTMLCollectionOf<Element>,
		parentIdEl: HTMLCollectionOf<Element>
	): Element | null {
		if (parentIdEl.length > 0) {
			const parentId = parentIdEl[0].getAttribute("Id");

			for (let i = 0; i < folderElements.length; i++) {
				if (
					parentId ===
					folderElements[i]
						.getElementsByTagNameNS(T_NS, "FolderId")[0]
						.getAttribute("Id")
				) {
					return folderElements[i];
				}
			}
		}

		return null;
	}

	getParentFolderPrefix(
		folderElements: HTMLCollectionOf<Element>,
		parentIdEl: HTMLCollectionOf<Element>
	): string {
		let prefix = "";

		this.getParentFolders(folderElements, parentIdEl).forEach(
			(parentFolder) => {
				prefix += `${
					parentFolder.getElementsByTagNameNS(T_NS, "DisplayName")[0]
						.childNodes[0].nodeValue
				}\\`;
			}
		);
		return prefix;
		// const parentEl = this.getParentFolder(folderElements, parentIdEl);

		// if (parentEl) {
		// 	const parentId = parentIdEl[0].getAttribute("Id");
		// 	if (
		// 		parentId ===
		// 		parentEl.getElementsByTagNameNS(T_NS, "FolderId")[0].getAttribute("Id")
		// 	) {
		// 		return `${
		// 			parentEl.getElementsByTagNameNS(T_NS, "DisplayName")[0].childNodes[0]
		// 				.nodeValue
		// 		}\\`;
		// 	}
		// }
		// return "";
	}

	getFolders(autoCreateCaption: string): Promise<IOutlookFolder[]> {
		return new Promise<IOutlookFolder[]>((resolve, reject) => {
			const mailbox = Office.context.mailbox;

			try {
				mailbox.makeEwsRequestAsync(this.makeEwsXml(), (result: any) => {
					if (result.status === "succeeded") {
						const parser = new DOMParser();
						const xml = parser.parseFromString(result.value, "text/xml");

						const folderElements = xml.getElementsByTagNameNS(T_NS, "Folder");

						const folders: IOutlookFolder[] = [
							{ id: "cm_auto", displayName: autoCreateCaption },
						];

						for (let i = 0; i < folderElements.length; i++) {
							const folderEl = folderElements[i];
							const parentFolders = this.getParentFolders(
								folderElements,
								folderEl.getElementsByTagNameNS(T_NS, "ParentFolderId")
							);
							let isWellKnown = false;
							let distinguishedFolder = folderEl.getElementsByTagNameNS(
								T_NS,
								"DistinguishedFolderId"
							);

							if (distinguishedFolder.length > 0) {
								isWellKnown = true;
							} else if (parentFolders.length > 0) {
								distinguishedFolder = parentFolders[0].getElementsByTagNameNS(
									T_NS,
									"DistinguishedFolderId"
								);
								if (distinguishedFolder.length > 0) {
									isWellKnown =
										distinguishedFolder[0].childNodes[0].nodeValue! !== "inbox";
								}
							}

							const hasPolicy =
								folderEl.getElementsByTagNameNS(T_NS, "PolicyTag").length > 0;

							const isNoteEl = folderEl.getElementsByTagNameNS(
								T_NS,
								"FolderClass"
							);

							const isNote =
								isNoteEl.length > 0 &&
								isNoteEl[0].childNodes[0].nodeValue! === "IPF.Note";

							const folderIdEl = folderEl.getElementsByTagNameNS(
								T_NS,
								"FolderId"
							);

							if (
								folderIdEl.length > 0 &&
								!isWellKnown &&
								isNote &&
								!hasPolicy
							) {
								folders.push({
									id: folderIdEl[0].getAttribute("Id")!,
									displayName:
										this.getParentFolderPrefix(
											folderElements,
											folderEl.getElementsByTagNameNS(T_NS, "ParentFolderId")
										) +
										folderEl.getElementsByTagNameNS(T_NS, "DisplayName")[0]
											.childNodes[0].nodeValue!,
								});
							}
						}

						resolve(folders);
					} else {
						reject("Error fetching folders.");
					}

					resolve([]);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	setAutoOpen(
		autoOpen: boolean,
		recordUrn?: string,
		subjectPrefix?: string
	): void {
		const getItemId = function() {
			if (Office.context.mailbox.diagnostics.hostName === "OutlookIOS") {
				// itemId is already REST-formatted.
				return Office.context.mailbox.item.itemId;
			} else {
				// Convert to an item ID for API v2.0.
				return Office.context.mailbox.convertToRestId(
					Office.context.mailbox.item.itemId,
					Office.MailboxEnums.RestVersion.v2_0
				);
			}
		};

		Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, function(
			result: any
		) {
			if (result.status === "succeeded") {
				var accessToken = result.value;
				const itemId = getItemId();

				const getMessageUrl =
					Office.context.mailbox.restUrl + "/v2.0/me/messages/" + itemId;
				let idTokens = recordUrn!.split("/");
				let data: any = {
					SingleValueExtendedProperties: [
						{
							PropertyId:
								"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
							Value: recordUrn,
						},
						{
							PropertyId:
								"String {00020386-0000-0000-C000-000000000046} Name HPTrimRecordUri",
							Value: idTokens.pop(),
						},
						{
							PropertyId:
								"String {00020386-0000-0000-C000-000000000046} Name HPTrimDataset",
							Value: idTokens[0].split(":").pop(),
						},
					],
				};

				if (subjectPrefix) {
					data.Subject = `${Office.context.mailbox.item.subject}`;
					if (!data.Subject.startsWith(subjectPrefix!)) {
						data.Subject = `${subjectPrefix} ${data.Subject}`;
					}
				}

				const options = {
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					method: "PATCH",
					url: getMessageUrl,
					data,
				};
				Axios(options);
			} else {
				// Handle the error.
			}
		});

		// Office.context.mailbox.item.loadCustomPropertiesAsync((asyncResult) => {
		// 	if (asyncResult.status == Office.AsyncResultStatus.Failed) {
		// 		// Handle the failure.
		// 	} else {
		// 		// Successfully loaded custom properties,
		// 		// can get them from the asyncResult argument.
		// 		const customProps = asyncResult.value;
		// 		customProps.set("TRIM_URI", String(recordUri));
		// 		// Save all custom properties to server.
		// 		customProps.saveAsync(() => {});
		// 	}
		// });
	}
	getAutoOpen(): boolean {
		return false;
	}
	saveDocument(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	getDocumentData(writeSlice: any): Promise<string> {
		throw new Error("Method not implemented.");
	}
}
