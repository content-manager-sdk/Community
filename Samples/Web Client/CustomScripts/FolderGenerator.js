var RMFolderGenerator = function () {

    var buttonCaption = "Add Standard Folders";

    // jQuery getJson() implements the promise interface, so we can use the folderSource variable
    // repeatedly with the done() method().  Subsequent calls will not make a request to the server.
    // see: http://api.jquery.com/jquery.getjson/ and http://api.jquery.com/category/deferred-object/
    var folderSource = $.getJSON(HPRMWebConfig.virtualDirectory + "CustomData/folders.json");

    var folderGeneratorButton = new HP.HPTRIM.Addon.RecordAddonButton({
        caption: buttonCaption,
        clickHandler: function () {

            var cntx = this.context;
            var folderCount = 0;


            folderSource.done(function (data) {
                var folders = data[cntx.RecordRecordType.RecordTypeName.Value];

                // this should always be true (given that I check it in preRender), maybe I am being over-cautious.
                if (folders) {

                    var folderList = [cntx.Uri];

                    // folders will contain an array of Record objects which we can post directly to the ServiceAPI.
                    for (var n = 0; n < folders.length; n++) {

                        // add the current record as the container for the new record.
                        folders[n].RecordContainer = cntx.Uri;

                        // post to the ServiceAPI.
                        $.ajax({
                            url: HPRMWebConfig.virtualDirectory + "HPRMServiceAPI/Record",
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(folders[n]),
                            success: function (response) {
                                // the logic is that if there is an error a message is displayed and everything continues
                                // at the end a search result window is opened to display the newly created records plus the
                                // original record.
                                folderList.push(response.Results[0].Uri);
                                folderCount++;

                                if (folderCount === folders.length && folderList.length > 1) {
                                    var trimApp = window['root'];
                                    trimApp.trimGlobalSearchPanel.search('unkUri:' + folderList.join());
                                }
                            },
                            error: function (xhr, status, error) {
                                folderCount++;
                                var err = eval("(" + xhr.responseText + ")");
                                alert(err.ResponseStatus.Message);
                            }


                        });

                    }
                } else {
                    alert('Record type not supported.')
                }
            });
        
        }
    });

    folderGeneratorButton.preRender = function () {
        var record = this.context;
        var me = this;
        me.setVisible(false);

        // check if the the current record type is to be found in folders.json, if so display this
        // menu item.
        folderSource.done(function (data) {
            if (data[record.RecordRecordType.RecordTypeName.Value]) {
                me.setVisible(true);
            }
        });
    };


    HP.HPTRIM.Addon.CustomScriptManager.register(folderGeneratorButton);

}();