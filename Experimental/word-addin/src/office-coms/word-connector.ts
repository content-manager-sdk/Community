import OfficeOfficeConnector from "./office-office-connector";
import { IOfficeConnector } from "./office-connector";

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

export class WordConnector extends OfficeOfficeConnector
	implements IOfficeConnector {
	public getExtension(): string {
		return "docx";
	}
	public saveDocument(): Promise<void> {
		return new Promise((resolve, reject) => {
			// let doRun;

			// if (Office.context.host === Office.HostType.Word) {
			// 	doRun = Word.run;
			// }

			// if (Office.context.host === Office.HostType.Excel) {
			// 	doRun = Excel.run;
			// }

			// if (Office.context.host === Office.HostType.PowerPoint) {
			// 	doRun = (global as any).PowerPoint.run;
			// }

			Word.run((context) => {
				const thisDocument = context.document;

				context.load(thisDocument, "saved");
				return context
					.sync()
					.then(() => {
						if (thisDocument.saved === false) {
							// Queue a command to save this document.
							thisDocument.save();

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
		return new Promise((resolve, reject) => {
			const response = { found: false, uri: 0, message: "" };

			Word.run((context) => {
				const customProp = context.document.properties.customProperties.add(
					"CM_Record_Uri",
					String(uri)
				);
				return context
					.sync()
					.then(() => {
						const v = customProp.value;
						if (v) {
							response.uri = Number(v);
						}
						response.found = true;
						resolve(response);
					})
					.catch((error) => {
						resolve(response);
					});
			});
		});
	}

	public getUri(): Promise<IGetRecordUriResponse> {
		return new Promise((resolve, reject) => {
			const response = { found: false, uri: 0, message: "" };

			Word.run((context) => {
				const customProps = context.document.properties.customProperties;
				context.load(customProps);

				const customProp = customProps.getItem("CM_Record_Uri");
				context.load(customProp);

				return context
					.sync()
					.then(() => {
						const v = customProp.value;

						if (v) {
							response.uri = Number(v);
							if (response.uri > 0) {
								response.found = true;
							}
						}
						resolve(response);
					})
					.catch((myError) => {
						//  response.message = myError.message || myError;
						resolve(response);
					});
			});
		});
	}
}
export default WordConnector;
