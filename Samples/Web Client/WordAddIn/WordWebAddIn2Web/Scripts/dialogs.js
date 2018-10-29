/*!
 * dialogs JavaScript Library v1.0.8
 * http://theofficecontext.com
 *
 * Copyright David E. Craig and other contributors
 * Released under the MIT license
 * https://tldrlegal.com/license/mit-license
 *
 * Date: 2017-09-13T10:27EST
 /** 
  * OfficeJS global
 */
var OfficeJS = new dlg();
/**
 * OfficeJS.dialogs class
 */
function dlg() {
    /** @type {init} */
    this.dialogs = new init();
    return this;
};
/**
 * Init class to hold global strings and other items (TDB)
 */
function init() {
    /** @returns {string} */
    this.settings = function() { return "OfficeJS.dialogs.settings" };
    /** @returns {string} */
    this.message = function() { return "OfficeJS.dialogs.message" };
    /**
     * Returns the proper URL to the dialogs html file
     * CDN usage - TBD
     */
    this.GetUrl = function() {
        /**
         * @type {string} 
         */
        var url = getUrl() + "dialogs.html";
        return url;
    }
    return this;
};
/**
 * The global PrintPreview object for single use of displaying
 * a print preview in the Office client. Use the Show() method. 
 */
var PrintPreview = new print();
/**
 * The global messagebox object for single use of displaying
 * a Message Box in the Office client. Use the Show() method. 
 * @type {msgbox} 
 * */
var MessageBox = new msgbox();
/**
 * The global inputbox object for single use of displaying
 * a Input Box in the Office client. Use the Show() method. 
 * @type {ibox} 
 * */
var InputBox = new ibox();
/**
 * The global form object for single use of displaying
 * a custom form in the Office client. Use the Show() method. 
 * @type {form} 
 * */
var Form = new form();
/**
 * The global alert object for single use of displaying
 * a simple alert box with only a message and an OK button.
 * @param {string} text             Text message, no more than 256 characters
 * @param {{function()}} asynresult Callback when the dialog is closed
 */
var Alert = new notify();
/**
 * The global progress form that will show a progress bar
 * and allow you to Update() the value until you issue
 * a CloseDialog()
 */
var Progress = new progress();
/**
 * The global wait spinner form that will allow an indeterminate
 * modal block on the UI until you issue a CloseDialog()
 */
var Wait = new spinner();
/**
 * An enum of Message Box Button types
 * @readonly
 * @typedef {string} MessageBoxIcons
 * @enum {MessageBoxIcons} 
 */
var MessageBoxIcons = {
    Asterisk: "Asterisk",           // Warning
    Error: "Error",                 // Stop
    Exclamation: "Exclamation",     // Warning
    Hand: "Hand",                   // Stop
    Information: "Information",     // Information
    None: "None",                   // none
    Question: "Question",           // Question
    Stop: "Stop",                   // Stop
    Warning: "Warning"              // Warning
};
/**
 * An enum of Message Box Button types
 * @readonly
 * @typedef {string} MessageBoxButtons
 * @enum {MessageBoxButtons} 
 */
var MessageBoxButtons = {
    Ok: "Ok",
    OkCancel: "OkCancel",
    YesNo: "YesNo",
    YesNoCancel: "YesNoCancel",
    RetryCancel: "RetryCancel",
    AbortRetryCancel: "AbortRetryCancel"
};
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
                    ****  ****  ***** *   * *****       *****  ***  ****  *   *                     
                    *   * *   *   *   **  *   *         *     *   * *   * ** **                     
                    ****  ****    *   * * *   *         ***   *   * ****  * * *                     
                    *     *   *   *   *  **   *         *     *   * *   * *   *                     
                    *     *   * ***** *   *   *         *      ***  *   * *   *                     
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * A class for creating a print preview dialog
 */
function print() {
    /**
     * Internal referenced values 
     * @type {{CancelResult: {function()}, Dialog: any, 
               DialogSettings: any, Displayed: true}} 
     * */
    var value = {
        CancelResult: null,
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    };
    /**
     * This displays the print preview dialog with the content you specify with HTML
     * In Office you can export the selection or the entire document/message as 
     * raw HTML and pass it to this function to display it as it appears on screen
     * and then print it.
     * @param {string} [html]   The html to be printed
     * @param {{function()}} [cancelResult] Callback if the user cancels
     */
    this.Show = function(html, cancelresult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            if (html === undefined || html === null || html == "") {
                html = "<html></html>";
            } 
            var buttons = MessageBoxButtons.OkCancel;
            var content = btoa(unescape(encodeURIComponent(html)));
            value.CancelResult = cancelresult;
            value.DialogSettings = {
                Text: content, Caption: "Print Preview", Buttons: buttons,
                Icon: MessageBoxIcons.None, DialogType: "print"
            };
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // show the dialog 
            Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                { height: 60, width: 60, displayInIframe: isOfficeOnline() },
                function (result) {
                    value.Displayed = true;
                    value.Dialog = result.value;
                    value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if(value.CancelResult) value.CancelResult();
                        });
                    });
                    value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if(value.CancelResult) value.CancelResult();
                        });
                    });
                });
        } catch(e) {
            console.log(e);
        }
    }
    /**
     * Resets the PrintPreview object for reuse
     */
    this.Reset = function () {
        try {
            PrintPreview = new print();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * This method closes the PrintPreview dialog
     * by calling the helper function for async
     * @param {function()} asyncResult Callback after the dialog is closed
     */
    this.CloseDialogAsync = function (asyncResult) {
        value.Displayed = false;
        dialogCloseAsync(value.Dialog, asyncResult);
    }
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
               ***  ****  ***** *   * *   * ***** ****        *****  ***  ****  *   *               
              *   * *   *   *   **  * **  * *     *   *       *     *   * *   * ** **               
                *   ****    *   * * * * * * ***   ****        ***   *   * ****  * * *               
              *   * *       *   *  ** *  ** *     *   *       *     *   * *   * *   *               
               ***  *     ***** *   * *   * ***** *   *       *      ***  *   * *   *               
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * A class for creating a non-determinate wait spinner
 * Most useful for simply making the UI modal while
 * you do work in the background.
 */
function spinner() {
    /**
     * Internal referenced values 
     * @type {{CancelResult: {function()}, Dialog: any, 
               DialogSettings: any, Displayed: true}} 
     * */
    var value = {
        CancelResult: null,
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    };
    /**
     * This message displays the wait spinner form
     * @param {string} [text]   The text to display in the spinner
     * @param {boolean} [showcancel] Enables a the cance button. If this is false or left
     *                               empty then there will not be a callback
     * @param {{function()}} [cancelResult] Callback if the user cancels
     */
    this.Show = function(text, showcancel, cancelresult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            if (text === undefined || text === null || text == "") {
                text = "Please wait...";
            } else {
                text = text.substring(0, 40); // no more than 40 characters allowed
            }
            var buttons = MessageBoxButtons.None;
            if(showcancel) {
                buttons = "Cancel";
            }
            value.CancelResult = cancelresult;
            value.DialogSettings = {
                Text: "", Caption: text, Buttons: buttons,
                Icon: MessageBoxIcons.None, DialogType: "spinner"
            };
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // show the dialog 
            Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                { height: 32, width: 32, displayInIframe: isOfficeOnline() },
                function (result) {
                    value.Displayed = true;
                    value.Dialog = result.value;
                    value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if(value.CancelResult) value.CancelResult();
                        });
                    });
                    value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if(value.CancelResult) value.CancelResult();
                        });
                    });
                });
        } catch(e) {
            console.log(e);
        }
    }
    /**
     * Resets the SpinnerForm object for reuse
     */
    this.Reset = function () {
        try {
            Wait = new spinner();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * This method closes the MessageBox
     * by calling the helper function for async
     * @param {function()} asyncResult Callback after the dialog is closed
     */
    this.CloseDialogAsync = function (asyncResult) {
        value.Displayed = false;
        dialogCloseAsync(value.Dialog, asyncResult);
    }
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
};
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
           ****  ****   ***   ***  ****  *****  ***   ***        *****  ***  ****  *   *            
           *   * *   * *   * *     *   * *     *   * *   *       *     *   * *   * ** **            
           ****  ****  *   * *  ** ****  ***     *     *         ***   *   * ****  * * *            
           *     *   * *   * *   * *   * *     *   * *   *       *     *   * *   * *   *            
           *     *   *  ***   ***  *   * *****  ***   ***        *      ***  *   * *   *            
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * A class for create a progress form
 * @class
 */
function progress() {
    /**
     * Internal referenced values 
     * @type {{AsyncResult: {function()}, CancelResult: {function()} Dialog: Office.Context.ui.dialog, 
               DialogSettings: any, Cancelled: boolean, Displayed: true}} 
     * */
    var value = {
        AsyncResult: null,
        CancelResult: null,
        Dialog: null,
        DialogSettings: {},
        Cancelled: false,
        Displayed: false
    };
    /**
     * This method tells the MessageBox to show a please wait spinner
     * @param {string} [text] The message you want to show - default "Please wait"
     * @param {Number} [start] A number to set the progress bar to
     * @param {Number} [max] A number to set the progress maximum value to
     * @param {{function()}} [asyncresult] Callback once you call Complete()
     * @param {{function()}} [cancelresult] Callback if the user cancels
     */
    this.Show = function (text, start, max, asyncresult, cancelresult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            if (text === undefined || text === null || text == "") {
                text = "Please wait...";
            } else {
                text = text.substring(0, 40); // no more than 40 characters allowed
            }
            if(start == undefined || start == null) {
                start = 0;
            }
            if(max == undefined || max == null) {
                max = 100;
            }
            value.AsyncResult = asyncresult;
            value.CancelResult = cancelresult;
            value.DialogSettings = {
                Text: "", Caption: text, Buttons: "Cancel",
                Icon: MessageBoxIcons.None, WithCheckbox: false,
                CheckBoxText: "", DialogType: "wait",
                Number: start, Maximum: max
            };
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // show the dialog
            Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                { height: 25, width: 40, displayInIframe: isOfficeOnline() },
                function (result) {
                    value.Displayed = true;
                    value.Dialog = result.value;
                    value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            value.Cancelled = true;
                            value.CancelResult();
                        });
                    });
                    value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            value.Cancelled = true;
                            value.CancelResult();
                        });
                    });
                });
        } catch(e) {
            console.log(e);
        }
    };
    /**
     * Updates the progress bar by incrementing it
     * @param {number} [increment]  The amount ot increment the progress bar by
     * @param {string} [text]       A new message to display
     * @returns {{Value: number, Cancelled: boolean}}   Returns a JSON object wiht the value
     *                                                 of the progress bar and whether the
     *                                                 user pressed cancel
     */
    this.Update = function (increment, text) {
        try {
            if(text) {
                value.DialogSettings.Caption = text.substring(0,40);
            }
            if(!increment) {
                increment = 1;
            }
            value.DialogSettings.Number += increment;
            /** @type {{message:string, settings: any}} */
            var message = { message: "progress", settings: value.DialogSettings };
            localStorage.setItem(OfficeJS.dialogs.message(), JSON.stringify(message));
            var returnResult = {
                Value: value.DialogSettings.Number,
                Cancelled: value.Cancelled
            }
            return returnResult; // return JSON
        } catch (e) {
            console.log(e);
            return "";
        }
    };
    /**
     * Resets the ProgressForm object for reuse
     */
    this.Reset = function () {
        try {
            Progress = new progress();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Completes the progress. You call this method
     * at the end of the process where you display
     * progress form
     */
    this.Complete = function () {
        value.Displayed = false;
        dialogCloseAsync(value.Dialog, value.AsyncResult);
    };
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
                    *   * *****  ***   ***   ***   ***  ***** ****   ***  *   *                     
                    ** ** *     *   * *   * *   * *     *     *   * *   *  * *                      
                    * * * ***     *     *   ***** *  ** ***   ****  *   *   *                       
                    *   * *     *   * *   * *   * *   * *     *   * *   *  * *                      
                    *   * *****  ***   ***  *   *  ***  ***** ****   ***  *   *                     
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * A class for creating message boxes in OfficeJS Web Addins
 * @class
 */
function msgbox() {
    /**
     * Internal referenced values 
     * @type {{HandleClose: boolean, AsyncResult: {function(button: string, checked: boolean)}, 
               Dialog: any, DialogSettings: any, Displayed: boolean}} 
     * */
    var value = {
        HandleClose: true,  // default
        AsyncResult: {},
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    }
    /**
     * Shows the message box, with the provided parameters
     * @param {string} text The message to be shown in the message box
     * @param {string} [caption] The caption on the top of the message box
     * @param {MessageBoxButtons} [buttons] The buttons to be displayed on the message box, of 
     *                                      type MessageBoxButtons
     * @param {MessageBoxIcons} [icon] The icon to show on the message box, of type MessageBoxIcons
     * @param {boolean} [withcheckbox] Enables a checkbox on the message box below the buttons
     * @param {string} [checkboxtext] The message to show on the message box checkbox
     * @param {function(string, boolean)} asyncResult Results after the message box is dismissed: 
     *                                                - button:string result of the button pressed 
     *                                                - checked:boolean is the checkbox was checked
     * @param {boolean} [processupdates] If enabled, the dialog will not close until you issue a
     *                                   MessageBox.CloseDialog(). Instead, you can update the message
     *                                   box by calling:
     *                                   - MessageBox.UpdateMessage - to update the message
     *                                   - MessageBox.Update - to update the entire MesssgeBox
     */
    this.Show = function (text, caption, buttons, icon, withcheckbox, checkboxtext, asyncResult, processupdates) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            // verify
            if (text == null || text.length == 0) {
                throw ("No text for messagebox. Cannot proceeed.");
            }
            if (processupdates == null) processupdates = false;
            if (caption == null) caption = "";
            if (buttons == null) buttons = MessageBoxButtons.Ok;
            if (icon == null) icon = MessageBoxIcons.None;
            if (withcheckbox == null) withcheckbox = false;
            if (checkboxtext == null) checkboxtext = "";
            if (asyncResult == null) {
                throw ("No callback specified for MessageBox. Cannot proceed.");
            }
            value.HandleClose = !processupdates;
            value.DialogSettings = {
                Text: text, Caption: caption, Buttons: buttons,
                Icon: icon, WithCheckbox: withcheckbox,
                CheckBoxText: checkboxtext, DialogType: "msg"
            };
            // set the storage item for the dialog form
            localStorage.setItem(OfficeJS.dialogs.message(), "");
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // set the callback
            value.AsyncResult = asyncResult;
            var msgWidth = 40;
            var msgHeight = 30; // with checkbox
            if (!withcheckbox) {
                msgHeight = 26; // without
            }
            // show the dialog - we do this in a timeout because in
            // quick succession a dialog may not appear if another
            // is called
            setTimeout(function () {
                Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                    { height: msgHeight, width: msgWidth, displayInIframe: isOfficeOnline() },
                    function (result) {
                        value.Displayed = true;
                        value.Dialog = result.value;
                        value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                            processMsgBoxMessage(arg);
                        });
                        value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                            processMsgBoxMessage(arg);
                        });
                    });
            }, 500);
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Resets the MessageBox object for reuse
     */
    this.Reset = function () {
        try {
            MessageBox = new msgbox();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Updates the text on an existing message box, with the provided parameters
     * @param {string} text The message to be shown in the message box
     * @param {function(string, boolean)} asyncResult Results after the message box is mismissed: 
     *                                                - String result of the button pressed 
     *                                                - And boolean is the checkbox was checked
     */
    this.UpdateMessage = function (text, asyncResult) {
        try {
            // verify
            if (text == null || text.length == 0) {
                throw ("No text for messagebox. Cannot proceeed.");
            }
            if (asyncResult == null) {
                throw ("No callback specified for MessageBox. Cannot proceed.");
            }
            value.AsyncResult = asyncResult;
            value.DialogSettings.Text = text;
            /** @type {{ message:string, settings:any }} */
            var message = { message: "update", settings: value.DialogSettings };
            localStorage.setItem(OfficeJS.dialogs.message(), JSON.stringify(message));
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Updates the entire message box, but must be used only if [processupdates] defined
     * on the call to MessageBox.Show(). Otherwise, this function does nothing 
     * @param {string} text The message to be shown in the message box
     * @param {string} [caption] The caption on the top of the message box
     * @param {MessageBoxButtons} [buttons] The buttons to be displayed on the message box, of 
     *                                      type MessageBoxButtons
     * @param {MessageBoxIcons} [icon] The icon to show on the message box, of type MessageBoxIcons
     * @param {boolean} [withcheckbox] Enables a checkbox on the message box below the buttons
     * @param {string} [checkboxtext] The message to show on the message box checkbox
     * @param {function(string, boolean)} asyncResult Results after the message box is mismissed: 
     *                                                     - String result of the button pressed 
     *                                                     - And boolean is the checkbox was checked
     * @param {boolean} [processupdates] If enabled, the dialog will not close until you issue a
     *                                   MessageBox.CloseDialog(). Instead, you can update the message
     *                                   box by calling:
     *                                   - MessageBox.UpdateMessage - to update the message
     *                                   - MessageBox.Update - to update the entire MesssgeBox
     */
    this.Update = function (text, caption, buttons, icon, withcheckbox, checkboxtext, asyncResult) {
        try {
            // verify
            if (text == null || text.length == 0) {
                throw ("No text for messagebox. Cannot proceeed.");
            }
            if (caption == null) caption = "";
            if (buttons == null) buttons = MessageBoxButtons.Ok;
            if (icon == null) icon = MessageBoxIcons.None;
            if (withcheckbox == null) withcheckbox = false;
            if (checkboxtext == null) checkboxtext = "";
            if (asyncResult == null) {
                throw ("No callback specified for MessageBox. Cannot proceed.");
            }
            value.DialogSettings = {
                Text: text, Caption: caption, Buttons: buttons,
                Icon: icon, WithCheckbox: withcheckbox,
                CheckBoxText: checkboxtext, DialogType: "msg"
            };
            // set the callback
            value.AsyncResult = asyncResult;
            /** @type {object} */
            var message = { message: "update", settings: value.DialogSettings };
            // set the storage item for the dialog form
            localStorage.setItem(OfficeJS.dialogs.message(), JSON.stringify(message));
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * This method closes the MessageBox
     * by calling the helper function
     * @param {function()} asyncResult Callback after the dialog is closed
     */
    this.CloseDialogAsync = function (asyncResult) {
        value.Displayed = false;
        dialogCloseAsync(value.Dialog, asyncResult);
    }
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
    /**
     * Processes the message from the dialog HTML
     * @param {string | string} arg An object with the results
     */
    function processMsgBoxMessage(arg) {
        try {
            /** @type {string} */
            var button = "";
            /** @type {boolean} */
            var checked = false;
            // process any errors first if there is one and then exit this function, do not
            // process the message. The main one we care about is the user pressing the (X)
            // to close the form. We want to make sure we reset everything.
            /** @type {string} */
            var result = dialogErrorCheck(arg.error);
            if (result == "CANCELLED") {
                // user clicked the (X) to close the dialog
                button = "Cancel";
                checked = false;
            } else if (result == "NOERROR") {
                button = JSON.parse(arg.message).Button;
                checked = JSON.parse(arg.message).Checked;
            } else {
                button = JSON.stringify({ Error: result });
            }
            // close the dialog if not processing multiple messages
            if (value.HandleClose) {
                // close for the user
                dialogCloseAsync(value.Dialog, function() {
                    value.Displayed = false;
                    value.AsyncResult(button, checked);
                });
            } else {
                // return without closing
                value.AsyncResult(button, checked);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return this;
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
               ***  *     ***** ****  *****       ****  *****  ***  *      ***   ***                
              *   * *     *     *   *   *         *   *   *   *   * *     *   * *                   
              ***** *     ***   ****    *         *   *   *   ***** *     *   * *  **               
              *   * *     *     *   *   *         *   *   *   *   * *     *   * *   *               
              *   * ***** ***** *   *   *         ****  ***** *   * *****  ***   ***                
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * This is a simple alert dialog
 */
function notify() {
    /**
     * Internal referenced values 
     * @type {{AsyncResult: {function(button: string, checked: boolean)}, 
             Dialog: any, DialogSettings: any, Displayed: boolean}} 
    * */
    var value = {
        AsyncResult: null,
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    }
    /**
     * Show a basic alert
     * @param {string} text                The text to show in the alert
     * @param {{function()}} [asyncresult] The callback called with the alert is dismissed
     */
    this.Show = function(text, asyncresult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            value.AsyncResult = asyncresult;
            value.DialogSettings = {
                Text: text.substring(0, 256), Buttons: "Ok", CheckBoxText: "", DialogType: "alert"
            }
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            var height = ((value.DialogSettings.Text.length / 256) * 10) + 15;      // max: 25
            var width = ((value.DialogSettings.Text.length / 256) * 20) + 20;       // max: 40
            // show the dialog
            Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                { height: height, width: width, displayInIframe: isOfficeOnline() },
                function (result) {
                    value.Displayed = true;
                    value.Dialog = result.value;
                    value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if (value.AsyncResult) value.AsyncResult();
                        });
                    });
                    value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                        dialogCloseAsync(value.Dialog, function() {
                            value.Displayed = false;
                            if (value.AsyncResult) value.AsyncResult();
                        });
                    });
            });
        } catch(e) {
            console.log(e);
        }
    }
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
                          ***** *   * ****  *   * ***** ****   ***  *   *                           
                            *   **  * *   * *   *   *   *   * *   *  * *                            
                            *   * * * ****  *   *   *   ****  *   *   *                             
                            *   *  ** *     *   *   *   *   * *   *  * *                            
                          ***** *   * *      ***    *   ****   ***  *   *                           
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * Shows the input box, with the provided parameters
 * @class
 */
function ibox(text, caption, defaultValue, asyncResult) {
    /**
     * Internal referenced values 
     * @type {{AsyncResult: {function(button: string, checked: boolean)}, 
               Dialog: any, DialogSettings: any, Displayed: boolean}} 
     * */
    var value = {
        AsyncResult: {},
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    }
    // /** @type {object} */
    // var dialog;
    // /** @type {function(string,boolean)} */
    // var callback;
    /**
     * Shows the input box, with the provided parameters
     * @param {string} text The message to be shown in the input box
     * @param {string} [caption] The caption on the top of the input box
     * @param {string} [defaultvalue] The default value to be provided
     * @param {function(string)} asyncResult Results after the input box is mismissed. If the
     *                                       returned string is empty, then the user pressed
     *                                       cancel. Otherwise it contains the value the user
     *                                       typed into the form
     */
    this.Show = function (text, caption, defaultvalue, asyncResult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            // verify
            if (text == null || text.length == 0) {
                throw ("No text for InputBox. Cannot proceeed.");
            }
            if (caption == null) caption = "";
            if (defaultvalue == null) defaultvalue = "";
            if (asyncResult == null) {
                throw ("No callback specified for InputBox. Cannot proceed.");
            }
            value.DialogSettings = {
                Text: text, Caption: caption, Buttons: MessageBoxButtons.OkCancel,
                Icon: MessageBoxIcons.Question, WithCheckbox: false,
                CheckBoxText: "", DialogType: "input", DefaultValue: defaultvalue
            };
            // set the storage item for the dialog form
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // set the callback
            value.AsyncResult = asyncResult;
            var msgWidth = 40;
            var msgHeight = 25;
            // show the dialog - we do this in a timeout because in
            // quick succession a dialog may not appear if another
            // is called
            setTimeout(function () {
                Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                    { height: msgHeight, width: msgWidth, displayInIframe: isOfficeOnline() },
                    function (result) {
                        value.Displayed = true;
                        value.Dialog = result.value;
                        value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                            processInputBoxMessage(arg);
                        });
                        value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                            processInputBoxMessage(arg);
                        });
                    });
            }, 500);
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Resets the MessageBox object for reuse
     */
    this.Reset = function () {
        try {
            InputBox = new ibox();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
    /**
     * Processes the message from the dialog HTML
     * @param {string | string} arg An object with the results
     */
    function processInputBoxMessage(arg) {
        try {
            /** @type {string} */
            var text = "";
            // process any errors first if there is one and then exit this function, do not
            // process the message. The main one we care about is the user pressing the (X)
            // to close the form. We want to make sure we reset everything.
            /** @type {string} */
            var result = dialogErrorCheck(arg.error);
            if (result == "CANCELLED") {
                // user clicked the (X) to close the dialog
                text = "";
            } else if (result == "NOERROR") {
                text = JSON.parse(arg.message).Text;
            } else {
                text = JSON.stringify({ Error: result });
            }
            // close the dialog
            dialogCloseAsync(value.Dialog, function() {
                // return
                value.Displayed = false;
                value.AsyncResult(text);
            });
        } catch (e) {
            console.log(e);
        }
    }
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
                  ***  *   *  ***  *****  ***  *   *       *****  ***  ****  *   *                  
                 *   * *   * *   *   *   *   * ** **       *     *   * *   * ** **                  
                 *     *   *   *     *   *   * * * *       ***   *   * ****  * * *                  
                 *   * *   * *   *   *   *   * *   *       *     *   * *   * *   *                  
                  ***   ***   ***    *    ***  *   *       *      ***  *   * *   *                  
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * This class helps create a user form in a dialog
 * @class
 */
function form() {
    /**
     * Internal referenced values 
     * @type {{Url: tring, Height: number, Width: number, Resize: boolean, 
               AsyncResult: { function(button: string, checked: boolean) }, 
               Dialog: any, DialogSettings: any, Displayed: boolean}} 
     **/
    var value = {
        Url: "",
        Height: 20,         // default
        Width: 30,          // default
        Resize: false,      // default
        HandleClose: true,  // default
        AsyncResult: {},
        Dialog: null,
        DialogSettings: {},
        Displayed: false
    };
    /**
     * Property: Get/Set: The url for the form. This can take the form:
     *      <file.html> - this will look in the current folder where
     *                    OfficeJS.dialogs is installed.
     *      NOTE: If using from CDN, this will NOT work.
     *      ../../<file.html> - virtual path to the location from the
     *                          current html folder of your app
     *      /<path>/<file.html> - this will look from the root of the
     *                            server address to the folder specified
     *      http://<server>/<path>/<file.html> - this will go to the 
     *                                           literal location
     * @param {string} [item] SETTER: The url item you want to set
     * @returns {string} GETTER: If item is null, will return the url
     */
    this.Url = function (item) {
        try {
            if (item == null) {
                return value.Url;
            } else {
                // the user can specify an folder off the root
                if (item.indexOf("https://") <= 0 && !item.startsWith("/")) {
                    this.Url = getUrl() + item;
                } else if (url.startsWith("/")) {
                    this.Url = getUrl(true) + item;
                } else {
                    this.Url = item; // a fully qualified url
                }
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Property: Get/Set: The Height of the form
     * @param {Number} [item] SETTER: The height you want the form to be
     * @returns {Number} GETTER: If item is null, returns the height of the form
     */
    this.Height = function (item) {
        try {
            if (item == null) {
                return value.Height;
            } else {
                value.Height = item;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Property: Get/Set: The Width of the form
     * @param {Number} [item] SETTER: The width you want the form to be
     * @returns {Number} GETTER: If the item is null, returns the width fo the form
     */
    this.Width = function (item) {
        try {
            if (item == null) {
                return value.Width;
            } else {
                value.Width = item;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Property: Get/Set: If true the form will close when a message is recieved.
     *                    If false, the caller will have to handle the dialog.close();
     * @param {boolean} [item] SETTER: Sets whether the form will close when a message is recieved
     * @returns {boolean} GETTER: The value of whether the form will close when it recieves a message
     */
    this.HandleClose = function (item) {
        try {
            if (item == null) {
                return value.HandleClose;
            } else {
                value.HandleClose = item;
            }
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Property: Set Only: Sets the callback function only
     * @param {function(string)}  - The callback function
     */
    this.AsyncResult = function (item) {
        try {
            value.AsyncResult = item;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * This method closes the MessageBox
     * by calling the helper function
     * @param {function()} asyncResult - callback once the dialog is closed
     */
    this.CloseDialogAsync = function (asyncResult) {
        value.Displayed = false;
        dialogCloseAsync(value.Dialog, asyncResult);
    }
    /**
     * Returns if the dialog is shown
     */
    this.Displayed = function() { return value.Displayed };
    /**
     * Shows a form, with the provided parameters
     * @param {string} [url] The url to the form This can take the form:
     *      <file.html> - this will look in the current folder where
     *                    OfficeJS.dialogs is installed.
     *      NOTE: If using from CDN, this will NOT work.
     *      ../../<file.html> - virtual path to the location from the
     *                          current html folder of your app
     *      /<path>/<file.html> - this will look from the root of the
     *                            server address to the folder specified
     *      http://<server>/<path>/<file.html> - this will go to the 
     *                                           literal location
     * @param {number} [height] The height of the form
     * @param {number} [width] The width of the form
     * @param {boolean} [handleclose] If true, when the form is dismissed the dialog will be closed.
     *                                Otherwise, it is left open and the caller will have to handle
     *                                the dialog.close()
     * @param {function(string)} [asyncresult] Results after the form is dismissed. The 
     *                                         result will be a JSON object like this:
     *                                         {
     *                                              Error: { },         // Error object
     *                                              Result: { },        // JSON from form
     *                                              Cancelled: false,   // boolean if form cancelled with X
     *                                              Dialog: { }         // A reference to the dialog
     *                                         }
     */
    this.Show = function (url, height, width, handleclose, asyncresult) {
        try {
            // verify no other dialogs are open first
            if(isDialogOpen()) throw("A dialog is already open.");
            // set the callback
            if (asyncresult) {
                value.AsyncResult = asyncresult;
            } else { throw ("No asyncresult defined."); }
            if (height && width) {
                // set the other values
                value.Height = height;
                value.Width = width;
                if (value.Height == 0 || value.Width == 0) {
                    value.Resize = true;
                    value.Height = 1; // minimum
                    value.Width = 1;  // minimum
                }
            }
            // set the url
            if (url) {
                // the suer can specify an folder off the root
                if (url.indexOf("https://") <= 0 && !url.startsWith("/")) {
                    value.Url = getUrl() + url;
                } else if (url.startsWith("/")) {
                    // add the host name, assuming we have a full relative path
                    // from the host name and then remove the leading /
                    value.Url = getUrl(true) + url.replace("/", "");
                } else {
                    value.Url = url; // a fully qualified url
                }
            }
            // handle close
            if (handleclose != null) {
                value.HandleClose = handleclose;
            }
            // verify
            if (value.Url == null || value.Url.length == 0) {
                throw ("No url specified for form. Cannot proceed.");
            }
            if (!value.AsyncResult) {
                throw ("No callback specified for form. Cannot proceed.");
            }
            value.DialogSettings = { Url: value.Url, DialogType: "form", Resize: value.Resize };
            // set the storage item for the dialog form
            localStorage.setItem(OfficeJS.dialogs.settings(), JSON.stringify(value.DialogSettings));
            // show the dialog - we do this in a timeout because in
            // quick succession a dialog may not appear if another
            // is called
            setTimeout(function () {
                Office.context.ui.displayDialogAsync(OfficeJS.dialogs.GetUrl(),
                    { height: value.Height, width: value.Width, displayInIframe: isOfficeOnline() },
                    function (result) {
                        value.Displayed = true;
                        value.Dialog = result.value;
                        value.Dialog.addEventHandler(Office.EventType.DialogEventReceived, function (arg) {
                            processFormMessage(arg);
                        });
                        value.Dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (arg) {
                            processFormMessage(arg);
                        });
                    }
                );
            }, 500);
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Resets the Form object for reuse
     */
    this.Reset = function () {
        try {
            Form = new form();
        } catch (e) {
            console.log(e);
        }
    };
    /**
     * Processes the message from the dialog HTML
     * @param {string | string} arg An object with the results
     */
    function processFormMessage(arg) {
        try {
            /**@type { } */
            var returnVal = {
                Error: {},             // Error object
                Result: {},            // JSON from form
                Cancelled: false,       // boolean if formed cancelled with X
            };
            // process any errors first if there is one and then exit this function, do not
            // process the message. The main one we care about is the user pressing the (X)
            // to close the form. We want to make sure we reset everything.
            /** @type {string} */
            var result = dialogErrorCheck(arg.error);
            if (result == "CANCELLED") {
                // user clicked the (X) to close the dialog
                returnVal.Cancelled = true;
            } else if (result == "NOERROR") {
                returnVal.Result = arg.message;
            } else {
                // an error occurred
                returnVal.Error = result;
            }
            // close the dialog
            if (value.HandleClose) {
               dialogCloseAsync(value.Dialog, function() {
                    // return
                    value.AsyncResult(JSON.stringify(returnVal));
                    value.Displayed = false;
               });
            } else {
                // return
                value.AsyncResult(JSON.stringify(returnVal));
            }
        } catch (e) {
            console.log(e);
        }
    }
}
/****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************
    *   * ***** *     ****  ***** ****        ***** *   * *   *  ***  ***** *****  ***  *   *  ***  
    *   * *     *     *   * *     *   *       *     *   * **  * *   *   *     *   *   * **  * *   * 
    ***** ***   *     ****  ***   ****        ***   *   * * * * *       *     *   *   * * * *   *   
    *   * *     *     *     *     *   *       *     *   * *  ** *   *   *     *   *   * *  ** *   * 
    *   * ***** ***** *     ***** *   *       *      ***  *   *  ***    *   *****  ***  *   *  *** 
 ****************************************************************************************************
 ****************************************************************************************************
 ****************************************************************************************************/
/**
 * Closes the currently open dialog asyncronously.
 * This has an ugly workaround which is to try to set a new
 * event handler on the dialog until it fails. When it failed
 * we know the original dialog object was destroyed and we
 * can then proceed. The issue we are working around is that
 * if you call two dialogs back to back, the second one will
 * likely not open at all.
 * @param {Office.context.ui.dialog} dialog The dialog to be closed
 * @param {function()} asyncResult The callback when close is complete
 */
 function dialogCloseAsync(dialog, asyncResult){
    // send a message to the dialog first just to stop any
    // message pump it may have running. 
    var message = { message: "close", settings: {} };
    localStorage.setItem(OfficeJS.dialogs.message(), JSON.stringify(message));
    // issue the close
    dialog.close();
    // and keep here until aync closed
    setTimeout(function() {
        try{
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, function() {});
            dialogCloseAsync(dialog, asyncResult);
        } catch(e) {
            asyncResult(); // done - closed
        }
    }, 0);
}
/**
 * Returns true of any of our dialog types is open:
 *  - MessageBox
 *  - InputBox
 *  - Alert
 *  - Progress
 *  - Form
 */
function isDialogOpen() {
    return MessageBox.Displayed() ||
           InputBox.Displayed() ||
           Alert.Displayed() ||
           Progress.Displayed() ||
           Form.Displayed() ||
           PrintPreview.Displayed();
}
/**
 * Gets the URL of this JS file so we can then grab the dialog html
 * that will be in the same folder
 * @param {boolean} [convert] appends the server name to a relative path
 *                            such as (/folder/pages/page.html) will become
 *                            https://server/folder/pages/page.html 
 * @returns {string} The URL
 */
function getUrl(convert) {
    try { 
        /** @type {string} */
        var url = getScriptURL(); // document.location.href;
        if (convert) {
            url = "https://" + document.location.host + "/";
        }
        /** @type {number} */
        var pos = url.lastIndexOf("/");
        url = url.substring(0, pos);
        if (!url.endsWith("/")) {
            url += "/";
        }
        return url;
    } catch (e) {
        console.log(e);
        return null;
    }
}
/**
 * Returns whether the platform is OffOnline
 * @returns {boolean} True if it is OfficeOnline
 */
function isOfficeOnline() {
    /**
     * Check to see if we are in full client or not
     * @type {string}
     */
    var platform = Office.context.platform;
    if (platform == "OfficeOnline") {
        return true;
    } else {
        return false;
    }
}
/**
 * Returns the error details if there is an error number
 * @param {Number} error 
 * @returns {string} Retruns an error message or NOERROR if there is none, 
 *                   or CANCELLED if the dialog was cancelled
 */
function dialogErrorCheck(error) {
    if (error == 12006) {
        return "CANCELLED";
    } else if (error > 0) {
        return error.message;
    } else {
        return "NOERROR";
    }
}

/**
 * Returns the url of the current running script
 * @returns {string} Retruns the url
 */
var getScriptURL = (function () {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index];
    return function () { return myScript.src; };
})();