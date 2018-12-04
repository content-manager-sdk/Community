// (function() {
// 	Office.initialize = function(reason) {
// 		// If you need to initialize something you can do so here.
// 		//  loadProps();typescript class
// 	};
// })();

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

export interface IWordConnector {
	getAccessToken(): Promise<string>;
	getUri(): Promise<IGetRecordUriResponse>;
	setUri(uri: number): Promise<IGetRecordUriResponse>;
	getName(): string;
}

export class WordConnector implements IWordConnector {
	public getName(): string {
		const tokens = Office.context.document.url.split("/");
		return tokens[tokens.length - 1].split(".")[0];
	}

	public setUri(uri: number): Promise<IGetRecordUriResponse> {
		return new Promise((resolve, reject) => {
			const response = { found: false, uri: 0, message: "" };

			Word.run((context) => {
				let customProp = context.document.properties.customProperties.add(
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

	public getAccessToken(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// if (Office.context.requirements.isSetSupported("IdentityAPI", 1.1)) {
			// 	reject({ message: "Identity not supported." });
			// } else {
			(Office.context["auth"] as any).getAccessTokenAsync(
				{ forceConsent: false },
				(result: any) => {
					if (result.status === "succeeded") {
						resolve(result.value);
					} else {
						reject({ message: result.error });
					}
				}
			);
			//}
		});
	}
}
export default WordConnector;
