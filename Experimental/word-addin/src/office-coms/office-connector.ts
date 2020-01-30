import { IGetRecordUriResponse } from "./word-connector";
import { ITrimConnector } from "src/trim-coms/trim-connector";
import { IAppStore } from "src/stores/AppStoreBase";

export interface IWordUrl {
	getWebUrl(): Promise<string>;
	getDocumentData(writeSlice: any): Promise<string>;
	getRecordUri(): number;
}

export interface IOfficeConnector extends IWordUrl {
	getAccessToken(): Promise<string>;

	getUri(): Promise<IGetRecordUriResponse>;
	setUri(uri: number): Promise<IGetRecordUriResponse>;
	insertText(textToInsert: string): void;
	insertLink(textToInsert: string, url: string): void;
	setAutoOpen(
		autoOpen: boolean,
		recordUrn?: string,
		subjectPrefix?: string
	): void;
	getAutoOpen(): boolean;
	saveDocument(): Promise<void>;
	initialize(trimConnector: ITrimConnector, appStore: IAppStore): void;
}

export class OfficeConnector {
	public initialize(trimConnector: ITrimConnector, appStore: IAppStore): void {}
	public getAccessToken(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// if (Office.context.requirements.isSetSupported("IdentityAPI", 1.1)) {
			// 	reject({ message: "Identity not supported." });
			// } else {

			// if (!Office.context || !Office.context["auth"]) {
			// 	resolve("me");
			// }

			const parseJwt = (token: string): any => {
				try {
					return JSON.parse(atob(token.split(".")[1]));
				} catch (e) {
					return null;
				}
			};

			const cachedToken = localStorage.getItem("access-token");

			if (
				cachedToken &&
				parseJwt(cachedToken).exp * 1000 > new Date().getTime()
			) {
				resolve(cachedToken);
			} else {
				((global as any).OfficeRuntime.auth as any)
					.getAccessToken({ allowSignInPrompt: true, forMSGraphAccess: false })
					.then((token: string) => {
						localStorage.setItem("access-token", token);
						resolve(token);
					})
					.catch((e: any) => {
						console.log(JSON.stringify(e));

						reject(e);
					});
			}
		});
	}
}
export default OfficeConnector;
