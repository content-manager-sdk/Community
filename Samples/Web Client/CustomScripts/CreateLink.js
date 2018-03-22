var TRIMCreateLink = function () {

    var buttonCaption = "Copy URL to clipboard";


    var createLinkButton = new HP.HPTRIM.Addon.RecordAddonButton({
        caption: buttonCaption,
        clickHandler: function () {

            var cntx = this.context;
            var textArea = document.createElement("textarea");
            textArea.value = window.location.protocol + '//' + window.location.hostname + HPRMWebConfig.virtualDirectory + '?uri=' + cntx.Uri + '&type=' + cntx.TrimType;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');


            createLinkButton.preRender = function () {
                var record = this.context;
                var me = this;
                me.setVisible(true);


            }
        }
    });
    HP.HPTRIM.Addon.CustomScriptManager.register(createLinkButton);

}()