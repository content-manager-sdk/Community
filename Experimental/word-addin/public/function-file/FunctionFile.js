// The initialize function must be run each time a new page is loaded.
(function() {
	Office.initialize = function(reason) {
		// If you need to initialize something you can do so here.
		//  loadProps();
	};
})();

let accessToken = "";

function loadProps() {
	var dfd = jQuery.Deferred();

	if (Office.context.requirements.isSetSupported("IdentityAPI", 1.1)) {
		// Request an SSO Token

		if (accessToken) {
			dfd.resolve("success");
		} else {
			Office.context.auth.getAccessTokenAsync({ forceConsent: false }, function(
				result
			) {
				if (result.status === "succeeded") {
					// Use this token to call Web API
					var ssoToken = result.value;
					accessToken = result.value;
					dfd.resolve("success");
				} else {
					console.log(result.error);
					// alert(result.error)
					if (result.error.code === 13003) {
						// SSO is not supported for domain user accounts, only
						// work or school (Office 365) or Microsoft Account IDs.
					} else {
						// Handle error
					}
					dfd.resolve("error");
				}
			});
		}
	} else {
		dfd.resolve("error");
	}
	return dfd.promise();
}

function getRoot() {
	let appPath = config.MY_PATH;

	let root = location.origin.endsWith("/")
		? location.origin
		: location.origin + "/";

	root = root + (appPath === "/" ? "" : appPath);

	root = root.endsWith("/") ? root : root + "/";

	return root;
}

function openHelp(event) {
	const root = getRoot();

	open(root + "home/help.html", "_help");
	event.completed();
}

let dialog;

function insertObjectFromTrim(event) {
	const fn = function(args) {
		if (args.message !== "0") {
			// Run a batch operation against the Word object model.
			Word.run(function(context) {
				// Queue a command to get the current selection and then
				// create a proxy range object with the results.
				var range = context.document.getSelection();

				// Queue a commmand to delete the range object.
				range.insertFileFromBase64(args.message, "Replace");

				// Synchronize the document state by executing the queued commands,
				// and return a promise to indicate task completion.
				return context.sync().then(function() {
					console.log("Inserting text");
				});
			}).catch(function(error) {
				console.log("Error: " + JSON.stringify(error));
				if (error instanceof OfficeExtension.Error) {
					console.log("Debug info: " + JSON.stringify(error.debugInfo));
				}
			});
		}
		dialog.close();
	};

	const extentsions = "docx,docm,dotx,xlsx,xlsm,xltx,pptx";

	doOpen(
		event,
		`recExtension:${extentsions} OR recContains:[recExtension:${extentsions}${extentsions}]`,
		fn
	);
}

function insertTextFromTrim(event) {
	const fn = function(args) {
		if (args.message !== "0") {
			// Run a batch operation against the Word object model.
			Word.run(function(context) {
				// Queue a command to get the current selection and then
				// create a proxy range object with the results.
				var range = context.document.getSelection();

				// Queue a commmand to delete the range object.
				range.insertText(args.message, "Replace");

				// Synchronize the document state by executing the queued commands,
				// and return a promise to indicate task completion.
				return context.sync().then(function() {
					console.log("Inserting text");
				});
			}).catch(function(error) {
				console.log("Error: " + JSON.stringify(error));
				if (error instanceof OfficeExtension.Error) {
					console.log("Debug info: " + JSON.stringify(error.debugInfo));
				}
			});
		}
		dialog.close();
	};

	const extentsions = "txt,log,csv,1st,html,lst,md,text,xml";

	doOpen(
		event,
		`recExtension:${extentsions} OR recContains:[recExtension:${extentsions}${extentsions}]`,
		fn
	);
}

function insertPictureFromTrim(event) {
	const fn = function(args) {
		if (args.message !== "0") {
			// Run a batch operation against the Word object model.
			Word.run(function(context) {
				// Queue a command to get the current selection and then
				// create a proxy range object with the results.
				var range = context.document.getSelection();

				// Queue a commmand to delete the range object.
				range.insertInlinePictureFromBase64(args.message, "Replace");

				// Synchronize the document state by executing the queued commands,
				// and return a promise to indicate task completion.
				return context.sync().then(function() {
					console.log("Inserting picture");
				});
			}).catch(function(error) {
				console.log("Error: " + JSON.stringify(error));
				if (error instanceof OfficeExtension.Error) {
					console.log("Debug info: " + JSON.stringify(error.debugInfo));
				}
			});
		}
		dialog.close();
	};
	const extentsions = "ai,bmp,gif,ico,png,ps,psd,jpeg,tif,tiff,jpg";

	doOpen(
		event,
		`recExtension:${extentsions} OR recContains:[recExtension:${extentsions}${extentsions}]`,
		fn
	);
}

function openFromTrim(event) {
	const fn = function(args) {
		if (args.message !== "0") {
			open(args.message, "_blank");
		}
		dialog.close();
	};

	doOpen(event, "", fn);
}

function doOpen(event, filter, fn) {
	$.when(loadProps()).then(function(status) {
		if (status === "success") {
			const root = getRoot();
			Office.context.ui.displayDialogAsync(
				root +
					"?searchdialog=true&accessToken=" +
					accessToken +
					"&rnd=" +
					Math.random() +
					"&filter=" +
					filter,
				{ height: 55, width: 50, displayInIframe: true },
				function(asyncResult) {
					dialog = asyncResult.value;
					dialog.addEventHandler(Office.EventType.DialogMessageReceived, fn);
				}
			);
			event.completed();
		} else {
			event.completed();
		}
	});

	// function processCreateMessage(args) {
	// 	if (args.message !== "0") {
	// 		open(args.message, "_blank");
	// 	}
	// 	dialog.close();
	// }
}
