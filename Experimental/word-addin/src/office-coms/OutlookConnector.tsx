import { OfficeConnector, IOfficeConnector } from "./office-connector";
import { ITrimConnector } from "../trim-coms/trim-connector";
import { IAppStore } from "../stores/AppStoreBase";
import Axios from "axios";

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

		Office.context.mailbox.addHandlerAsync(
			Office.EventType.ItemChanged,
			(item) => {
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
	setAutoOpen(autoOpen: boolean, recordUrn?: string): void {
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

				const options = {
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					method: "PATCH",
					url: getMessageUrl,
					data: {
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: recordUrn,
							},
						],
					},
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
