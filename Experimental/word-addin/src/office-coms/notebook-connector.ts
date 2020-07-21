import OfficeOfficeConnector from "./office-office-connector";
import { IOfficeConnector } from "./office-connector";

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

export class NotebookConnector extends OfficeOfficeConnector
	implements IOfficeConnector {
	public getExtension(): string {
		return "pptx";
	}

	public saveDocument(): Promise<void> {
		return new Promise((resolve, reject) => {
			(global as any).Notebook.run((context: any) => {
				resolve();
			}).catch((error: any) => {
				reject(error);
			});
		});
	}

	public setUri(uri: number): Promise<IGetRecordUriResponse> {
		return Promise.reject();
	}

	public getUri(): Promise<IGetRecordUriResponse> {
		return Promise.reject();
	}
}
export default NotebookConnector;
