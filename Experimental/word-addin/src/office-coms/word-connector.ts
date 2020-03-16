import { OfficeConnector, IOfficeConnector } from "./office-connector";

export interface IGetRecordUriResponse {
	found: boolean;
	uri: number;
	message?: string;
}

interface IFileState {
	file: any;
	counter: number;
	sliceCount: number;
	writeSlice: any;
	onData: any;
	fileName?: string;
}

export class WordConnector extends OfficeConnector implements IOfficeConnector {
	getRecordUri(): number {
		return 0;
	}

	getDocumentData(writeSlice: any): Promise<string> {
		return new Promise((resolve, reject) => {
			const onData = (fileName: string) => {
				resolve(fileName);
			};

			// const onError = (error: any) => {
			// 	reject(error);
			// };
			this.sendFile(writeSlice, onData);
			// this.getDocumentAsCompressed({
			// 	onData: onData,
			// 	writeSlice,
			// 	onError: onError,
			// });
		});
	}
	setAutoOpen(autoOpen: boolean): Promise<void> {
		return new Promise<void>((resolve) => {
			Office.context.document.settings.set(
				"Office.AutoShowTaskpaneWithDocument",
				autoOpen
			);
			Office.context.document.settings.saveAsync({}, function() {
				resolve();
			});
		});
	}
	getAutoOpen(): boolean {
		const autoOpen = Office.context.document.settings.get(
			"Office.AutoShowTaskpaneWithDocument"
		);

		return autoOpen;
	}

	private sendFile(writeSlice: any, onData: any) {
		Office.context.document.getFileAsync(
			Office.FileType.Compressed,
			{ sliceSize: 1048576 },
			(result: any) => {
				if (result.status == Office.AsyncResultStatus.Succeeded) {
					// Get the File object from the result.
					var myFile = result.value;
					var state = {
						file: myFile,
						counter: 0,
						sliceCount: myFile.sliceCount,
						writeSlice,
						onData,
					};

					console.log("Getting file of " + myFile.size + " bytes");
					this.getSlice(state);
				} else {
					console.log(result.status);
				}
			}
		);
	}

	private getSlice(state: IFileState) {
		state.file.getSliceAsync(state.counter, (result: any) => {
			if (result.status == Office.AsyncResultStatus.Succeeded) {
				console.log(
					"Sending piece " + (state.counter + 1) + " of " + state.sliceCount
				);
				this.sendSlice(result.value, state);
			} else {
				console.log(result.status);
			}
		});
	}

	private sendSlice(slice: any, state: IFileState) {
		var data = slice.data;

		// If the slice contains data, create an HTTP request.
		if (data) {
			// Encode the slice data, a byte array, as a Base64 string.
			// NOTE: The implementation of myEncodeBase64(input) function isn't
			// included with this example. For information about Base64 encoding with
			// JavaScript, see https://developer.mozilla.org/docs/Web/JavaScript/Base64_encoding_and_decoding.
			//var fileData = myEncodeBase64(data);

			// Create a new HTTP request. You need to send the request
			// to a webpage that can receive a post.
			// var request = new XMLHttpRequest();

			// // Create a handler function to update the status
			// // when the request has been sent.
			// request.onreadystatechange = () => {
			// 	if (request.readyState == 4) {
			// 		console.log("Sent " + slice.size + " bytes.");
			// 		state.counter++;

			// 		if (state.counter < state.sliceCount) {
			// 			this.getSlice(state);
			// 		} else {
			// 			this.closeFile(state);

			// 			state.onData();
			// 		}
			// 	}
			// };
			state.writeSlice(data, state.fileName).then((result: string) => {
				state.fileName = result;
				console.log("Sent " + slice.size + " bytes.");
				state.counter++;

				if (state.counter < state.sliceCount) {
					this.getSlice(state);
				} else {
					this.closeFile(state);

					state.onData(state.fileName);
				}
			});

			//	request.open("POST", "[Your receiving page or service]");
			//	request.setRequestHeader("Slice-Number", slice.index);

			// Send the file as the body of an HTTP POST
			// request to the web server.
			//	request.send(fileData);
		}
	}

	private closeFile(state: IFileState) {
		// Close the file when you're done with it.
		state.file.closeAsync(function(result: any) {
			// If the result returns as a success, the
			// file has been successfully closed.
			if (result.status == "succeeded") {
				console.log("File closed.");
			} else {
				console.log("File couldn't be closed.");
			}
		});
	}
	/*
	private getDocumentAsCompressed(args: any) {
		const me = this;
		console.log("getDocumentAsCompressed");

		Office.context.document.getFileAsync(
			Office.FileType.Compressed,
			{
				sliceSize: 65536 * 2 
			},
			function(result: any) {
				console.log("callback");
				console.log(result);
				if (result.status === "succeeded") {
					// If the getFileAsync call succeeded, then
					// result.value will return a valid File Object.
					var myFile = result.value;
					var sliceCount = myFile.sliceCount;
					var slicesReceived = 0,
						gotAllSlices = true,
						docdataSlices: [] = [];
					//showNotification("", "File size:" + myFile.size + " #Slices: " + sliceCount);

					// Get the file slices.
					me.getSliceAsync(
						myFile,
						0,
						sliceCount,
						gotAllSlices,
						docdataSlices,
						slicesReceived,
						args
					);
				} else {
					// showNotification("Error:", result.error.message);
					console.log("error error");
					console.log(result.error);
					const { onError } = args;
					onError(result.error.message);
				}
			}
		);
	}

	private getSliceAsync(
		file: any,
		nextSlice: any,
		sliceCount: number,
		gotAllSlices: any,
		docdataSlices: any,
		slicesReceived: any,
		args: any
	) {
		console.log("getSliceAsync");
		const me = this;
		file.getSliceAsync(nextSlice, function(sliceResult: any) {
			if (sliceResult.status == "succeeded") {
				if (!gotAllSlices) {
					// Failed to get all slices, no need to continue.
					return;
				}

				// Got one slice, store it in a temporary array.
				// (Or you can do something else, such as
				// send it to a third-party server.)
				//	docdataSlices[sliceResult.value.index] = sliceResult.value.data;

				const { writeSlice } = args;
				writeSlice(sliceResult.value.data, args.fileName).then(
					(result: any) => {
						args.fileName = result;
						if (++slicesReceived == sliceCount) {
							// All slices have been received.
							console.log("file.closeAsync()");
							file.closeAsync(function(result: any) {
								if (result.status == "succeeded") {
									console.log("File closed.");
								} else {
									console.log("File couldn't be closed.");
								}
							});
							console.log("closed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
							const { onData } = args;
							onData(args.fileName);

							//me.onGotAllSlices(docdataSlices, args);
						} else {
							me.getSliceAsync(
								file,
								++nextSlice,
								sliceCount,
								gotAllSlices,
								docdataSlices,
								slicesReceived,
								args
							);
						}
					}
				);
			} else {
				gotAllSlices = false;
				file.closeAsync();
				const { onError } = args;
				onError(sliceResult.error.message);
				//   showNotification("getSliceAsync Error:", sliceResult.error.message);
			}
		});
	}
*/
	// private onGotAllSlices(docdataSlices: [], args: any) {
	// 	var docdata: number[] = [];
	// 	for (var i = 0; i < docdataSlices.length; i++) {
	// 		docdata = docdata.concat(docdataSlices[i]);
	// 	}

	// 	const { onData } = args;
	// 	onData(docdata);

	// 	// var decoder = new TextDecoder('utf8');
	// 	// var b64encoded = btoa(decoder.decode(docdata));

	// 	//var fileContent = new String();
	// 	//for (var j = 0; j < docdata.length; j++) {
	// 	//    fileContent += String.fromCharCode(docdata[j]);
	// 	//}

	// 	// Now all the file content is stored in 'fileContent' variable,
	// 	// you can do something with it, such as print, fax...
	// }

	public getWebUrl(): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				Office.context.document.getFilePropertiesAsync({}, (asyncResult) => {
					var fileUrl = asyncResult.value.url;
					if (fileUrl == "") {
						reject(
							"The file hasn't been saved yet. Save the file and try again"
						);
					} else {
						resolve(fileUrl);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	// public getName(): Promise<string> {
	// 	return new Promise((resolve, reject) => {
	// 		this.getWebUrl().then((webUrl) => {
	// 			const tokens = webUrl.split("/");
	// 			resolve(tokens[tokens.length - 1].split(".")[0]);
	// 		});
	// 	});
	// 	//	.split("/");
	// 	//	return tokens[tokens.length - 1].split(".")[0];
	// }

	public insertText(textToInsert: string): void {
		Office.context.document.setSelectedDataAsync(
			textToInsert,
			{},
			(asyncResult: any) => {
				if (asyncResult.status == Office.AsyncResultStatus.Failed) {
					//write(asyncResult.error.message);
				}
			}
		);
	}

	public insertLink(textToInsert: string, url: string): void {
		Word.run(function(context) {
			// Create a range proxy object for the current selection.
			var range = context.document.getSelection();

			// Queue a command to insert text at the end of the selection.
			range.insertHtml(
				`<a href="${url}">${textToInsert}</a>`,
				Word.InsertLocation.end
			);

			// Synchronize the document state by executing the queued commands,
			// and return a promise to indicate task completion.
			return context.sync().then(function() {
				console.log("Inserted the text at the end of the selection.");
			});
		}).catch(function(error) {
			console.log("Error: " + JSON.stringify(error));
			if (error instanceof OfficeExtension.Error) {
				console.log("Debug info: " + JSON.stringify(error.debugInfo));
			}
		});
	}

	public isSaved(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			Word.run((context) => {
				const thisDocument = context.document;

				context.load(thisDocument, "saved");
				return context
					.sync()
					.then(() => {
						resolve(thisDocument.saved);
					})
					.catch(() => {
						resolve(false);
					});
			});
		});
	}

	public saveDocument(): Promise<void> {
		return new Promise((resolve, reject) => {
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
								.then(function() {
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
