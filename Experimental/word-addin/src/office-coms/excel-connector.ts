import OfficeOfficeConnector from "./office-office-connector";
import { IOfficeConnector } from "./office-connector";

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

export class ExcelConnector extends OfficeOfficeConnector
	implements IOfficeConnector {
	public getExtension(): string {
		return "xlsx";
	}
	public saveDocument(): Promise<void> {
		return new Promise((resolve, reject) => {
			Excel.run((context) => {
				const thisDocument = context.workbook;

				context.load(thisDocument, "saved");
				return context
					.sync()
					.then(() => {
						if ((thisDocument as any).saved === false) {
							// Queue a command to save this document.
							(thisDocument as any).save();

							// Synchronize the document state by executing the queued commands,
							// and return a promise to indicate task completion.
							context
								.sync()
								.then(function () {
									//console.log('Saved the document');
									resolve();
								})
								.catch((reason) => reject(reason));
						} else {
							//console.log('The document has not changed since the last save.');
							resolve();
						}

						//	resolve();
					})
					.catch((error) => {
						reject(error);
					});
			}).catch((error) => {
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
export default ExcelConnector;
