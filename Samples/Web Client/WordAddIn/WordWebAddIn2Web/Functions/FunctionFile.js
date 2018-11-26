// The initialize function must be run each time a new page is loaded.
(function () {
    Office.initialize = function (reason) {


        // If you need to initialize something you can do so here.

        //  loadProps();
    };
    
})();


function getUriCustomProp(doc) {
    Word.run(function (context) {

        var td = context.document;
        var customProps = td.properties.customProperties;
        var dd = customProps.getItem('CM_Record_Uri');
      //  context.load(customProps);
        // customProps.add('CM_Record_Uri', uri);
     //   var td = context.document;
    //    context.load(td, 'properties');


        // Synchronize the document state by executing the queued commands, 
        // and return a promise to indicate task completion.
        return context.sync().then(function () {
           
            var vv = dd.value;
        });

        //return context.sync()
        //    .then(function () {
        //        doc.open();
        //        context.sync();

        //    }).catch(function (myError) {
        //        //otherwise we handle the exception here!
        //        showNotification("Error", myError.message);
        //    })

    }).catch(function (myError) { showNotification("Error", myError.message); });

}

function setUriCustomProp(uri) {

    Word.run(function (context) {
        console.log(context.document.url);
        context.document.properties.customProperties.add("CM_Record_Uri", uri);
        return context.sync();
    });
    
    /*
    Word.run(function (context) {

        var doc = context.document;
     //   doc = doc || context.application.createDocument(data);
        var customProps = doc.properties.customProperties;

        context.load(customProps);
       // customProps.add('CM_Record_Uri', uri);

        return context.sync()
            .then(function () {
                customProps.add('CM_Record_Uri', uri);
                doc.save();
               // doc.open();
               // context.sync();

            }).catch(function (myError) {
                //otherwise we handle the exception here!
                showNotification("Error", myError.message);
            })

    }).catch(function (myError) { showNotification("Error", myError.message); });
    */
}

function registerInTrim(event) {

    var dialog;

    $.when(loadProps()).then(function (status) {
        if (status === "success") {
            getUriCustomProp(Office.context.document);
            var docUrl = Office.context.document.url

            Office.context.ui.displayDialogAsync("https://localhost/WordAddin/PropertySheet.html?docUrl=" + docUrl + "&accessToken=" + accessToken + '&rnd=' + Math.random(), { height: 45, width: 50, displayInIframe: true },
                function (asyncResult) {
                    dialog = asyncResult.value;
                    dialog.addEventHandler(Office.EventType.DialogMessageReceived, processCreateMessage);
                }
            );
            event.completed();
        }
    });

    function processCreateMessage(args) {

        setUriCustomProp(args.message);

        dialog.close();
    }

}

var recordUri = 0;

function openDocument(event) {
    var dialog;   
    $.when(loadProps()).then(function (status) {
        if (status === "success") {

            Office.context.ui.displayDialogAsync("https://localhost/WordAddin/DocumentList2.html?accessToken=" + accessToken + '&rnd=' + Math.random(), { height: 45, width: 50, displayInIframe: true },
                function (asyncResult) {
                    dialog = asyncResult.value;
                    dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                }
            );
            event.completed();
        }
    });




    function MyHandler(eventArgs, options) {

        console.log(eventArgs);
    }
    function processMessage(args) {
        
        if (args.message) {

            recordUri = args.message

            localStorage.setItem("recordUri", args.message);
            var docUrl = "/WordAddin/api/Document/" + args.message;
            //  var messageFromDialog = JSON.parse(arg.message);
            dialog.close();

            $.ajax({
                url: docUrl,
                method: "GET",
                dataType: "text",
                headers: { "Authorization": "Bearer " + accessToken },
                success: function (data) {
                    Word.run(function (context) {
                        var doc = context.application.createDocument(data);
                        
                        //doc.open();
                        //doc.properties.customProperties.add("CM_Record_Uri", args.message);
                        
                        return context.sync().then(function () {
                           
                            doc.open();
                          //  doc.addHandlerAsync(Office.EventType.ActiveViewChanged, MyHandler);
                        //    open(doc.url);
                        //  //  doc.save();
                            
                            return context.sync().then(function () {
                              //  setUriCustomProp(args.message);
                              //  doc.properties.customProperties.add("CM_Record_Uri", args.message);
                             //   console.log(doc.url);
                            });
                        //    //setUriCustomProp(args.message);
                        //    //doc.save();
                        //    // return context.sync();
                        });

                    })
                        .catch(function (myError) {
                            showNotification("Error", myError.message);
                        });
                      

                    
                },
                error: function (ex) {
                    console.log(ex.message);
                    //dfd.resolve("error");
                }
            });
        }
    }
}

function getRecordUri() {
    var dfd = jQuery.Deferred();

    Word.run(function (context) {

        // this getDocumentAsBase64 assumes a valid base64-encoded docx file

        var customProps = context.document.properties.customProperties;
        context.load(customProps);

        var customProp = customProps.getItem('CM_Record_Uri');
        context.load(customProp);
       
        return context.sync()
            .then(function () {
                //       var customProp = customProps.getItem('CM_Record_Uri');
                var v = customProp.value;
                dfd.resolve({ "status": "success", "uri": v });

            }).catch(function (myError) {
                //otherwise we handle the exception here!
                showNotification("Error", myError.message);
                dfd.resolve({ "status": "error" });
            });

    }).catch(function (myError) {
        showNotification("Error", myError.message);
        dfd.resolve({ "status": "error" });
    });
    return dfd.promise();
}

function showNotification(status, msg) {
    console.log("$$$$$$ doc open error: " + msg);
}

var accessToken;

// Load properties from the Item base object, then load the
// message-specific properties.
function loadProps() {
    var dfd = jQuery.Deferred();

    if (Office.context.requirements.isSetSupported('IdentityAPI', 1.1)) {
        // Request an SSO Token 

        if (accessToken) {
            dfd.resolve("success");

        } else {

            Office.context.auth.getAccessTokenAsync({ forceConsent: false }, function (result) {

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

    }
    else {
        dfd.resolve("error");
    }
    return dfd.promise();
}

function saveDoc(event) {


    Word.run(function (context) {

        // Create a proxy object for the document.
        var thisDocument = context.document;

        // Queue a commmand to load the document save state (on the saved property).
        context.load(thisDocument, 'saved');


        // Synchronize the document state by executing the queued commands, 
        // and return a promise to indicate task completion.
        return context.sync().then(function () {

            if (thisDocument.saved === false) {
                // Queue a command to save this document.
                thisDocument.save();

                // Synchronize the document state by executing the queued commands, 
                // and return a promise to indicate task completion.
                return context.sync().then(function () {
                    console.log('Saved the document');
                    event.completed();
                });
            } else {
                console.log('The document has not changed since the last save.');
            }
        });
    })
        .catch(function (error) {
            console.log("Error: " + JSON.stringify(error));
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
}

//function registerInTrim() {

    //Office.context.ui.displayDialogAsync("https://localhost/cm" + accessToken + '&rnd=' + Math.random(), { height: 45, width: 50, displayInIframe: true },
    //    function (asyncResult) {
    //   //     dialog = asyncResult.value;
    //   //     dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
    //    }
    //);

  //  open("http://localhost/cm");
   // var dfd = jQuery.Deferred();

    //$.when(loadProps()).then(function (status) {

    //    //   Word.run(function (context) {

    //    // this getDocumentAsBase64 assumes a valid base64-encoded docx file

    //    var docUrl = Office.context.document.url;
    //    var mm = Office.context.document.mode;



    //    Word.run(function (context) {
    //        var props = context.document.properties;
    //        context.load(props);

    //    //    var comment = props.getItem("comments");
    //   //     context.load(comment);

    //        return context.sync()
    //            .then(function () {
    //                //       var customProp = customProps.getItem('CM_Record_Uri');
    //                var v = props.comments;
    //                //   dfd.resolve({ "status": "success", "uri": v });

    //            }).catch(function (myError) {
    //                //otherwise we handle the exception here!
    //                showNotification("Error", myError.message);
    //                //  dfd.resolve({ "status": "error" });
    //            });
    //    });

    //});
    //}).catch(function (myError) {
    //    showNotification("Error", myError.message);

    //});


//}

function getDocumentAsCompressed(args) {
    var dfd = jQuery.Deferred();

    Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 65536 /*64 KB*/ },
        function (result) {
            if (result.status == "succeeded") {
                // If the getFileAsync call succeeded, then
                // result.value will return a valid File Object.
                var myFile = result.value;
                var sliceCount = myFile.sliceCount;
                var slicesReceived = 0, gotAllSlices = true, docdataSlices = [];
                showNotification("", "File size:" + myFile.size + " #Slices: " + sliceCount);

                // Get the file slices.
                getSliceAsync(myFile, 0, sliceCount, gotAllSlices, docdataSlices, slicesReceived, args);
            }
            else {
                showNotification("Error:", result.error.message);
            }
        });
}

function getSliceAsync(file, nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived, args) {
    file.getSliceAsync(nextSlice, function (sliceResult) {
        if (sliceResult.status == "succeeded") {
            if (!gotAllSlices) { // Failed to get all slices, no need to continue.
                return;
            }

            // Got one slice, store it in a temporary array.
            // (Or you can do something else, such as
            // send it to a third-party server.)
            docdataSlices[sliceResult.value.index] = sliceResult.value.data;
            if (++slicesReceived == sliceCount) {
                // All slices have been received.
                file.closeAsync();
                onGotAllSlices(docdataSlices, args);
            }
            else {
                getSliceAsync(file, ++nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived, args);
            }
        }
        else {
            gotAllSlices = false;
            file.closeAsync();
            showNotification("getSliceAsync Error:", sliceResult.error.message);
        }
    });
}

function onGotAllSlices(docdataSlices, args) {
    var docdata = [];
    for (var i = 0; i < docdataSlices.length; i++) {
        docdata = docdata.concat(docdataSlices[i]);
    }

    // var decoder = new TextDecoder('utf8');
    // var b64encoded = btoa(decoder.decode(docdata));

    //var fileContent = new String();
    //for (var j = 0; j < docdata.length; j++) {
    //    fileContent += String.fromCharCode(docdata[j]);
    //}

    $.when(loadProps()).then(function (status) {
        if (status === "success") {


                    $.ajax({
                        url: "/WordAddin/api/Document",
                        method: "POST",
                        dataType: "json",
                        data: {
                            "KeepBookedOut": args.KeepBookedOut,
                            "Data": docdata
                        },
                        headers: { "Authorization": "Bearer " + accessToken },
                        success: function (data) {
                            saveDoc(args.event);
                        },
                        error: function (ex) {
                            console.log(ex.message);
                            //dfd.resolve("error");
                        }

                    });

        }
    });
    // Now all the file content is stored in 'fileContent' variable,
    // you can do something with it, such as print, fax...
}


function inContentManager(event, continueFN) {
    $.when(getRecordUri()).then(function (r) {

        if (r.uri) {
            continueFN(r);
        } else {
            MessageBox.Show("This document is not in Content Manager.", "Error", MessageBoxButtons.OkOnly,
                MessageBoxIcons.Error, false, null, function (buttonFirst) {
                    event.completed();
                });
        }
    });

}

function saveToTrim(event) {
    inContentManager(event, function () {
        getDocumentAsCompressed({ "KeepBookedOut": true, "event": event });
    });
}

function saveAndCheckinToTrim(event) {
    inContentManager(event, function () {
        getDocumentAsCompressed({ "KeepBookedOut": false, "event": event });
    });
    
}

function showProperties(event) {
    inContentManager(event, function(r){
        open('http://localhost/cm?q=Uri:' + r.uri + '&t=Record');
        event.completed();
    });


}