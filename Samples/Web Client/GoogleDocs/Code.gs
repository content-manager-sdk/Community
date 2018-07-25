var BASE_URL = 'https://mfcm.info';
var SERVICE_URL = BASE_URL + '/HPECMServiceAPI/';

var DETAILS_PROPERTIES = "RecordNumber,RecordIsElectronic,RecordRevisionCount,RecordDocumentStatus,EnabledCommandIds";

function getSessionId(refresh) {
  var cache = CacheService.getUserCache();
  var cookies = cache.get('cookies');
  
  if (!refresh && cookies != null) {
   return cookies; 
  }
  
   var accessToken = ScriptApp.getOAuthToken();
   var url = SERVICE_URL + 'auth/GoogleOAuthApp?format=json&accesstoken=' + accessToken;
  
   var response = UrlFetchApp.fetch(url, {
     method: 'GET'
   });
  
  var txt = response.getContentText()
  
  var result = JSON.parse(response.getContentText());
  
  
  var headers = response.getAllHeaders();
  var cookies = headers['Set-Cookie']; 
  
  var cache = CacheService.getUserCache();
  cache.put('cookies',cookies);
  
  return cache.get('cookies');

}


function getJSON(url, tryAgain) {

  var cookies = getSessionId();

    var url = SERVICE_URL + url + '&format=json';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        'Cookie': cookies
      },
      method: 'GET'
    });
  
  var code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      
       var txt = response.getContentText()
      
       return JSON.parse(response.getContentText());

    } else if (!tryAgain && (code == 401 || code == 403)) {
       // Not fully authorized for this action.
      getSessionId(true);
      getJSON(url, true);
    } else {
       // Handle other response codes by logging them and throwing an
       // exception.
       console.error("Backend server error (%s): %s", code.toString(),
                     resp.getContentText("utf-8"));
       throw ("Backend server error: " + code);
    }  

}


/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */


/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {  

  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();

}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}



function getRecordUri() {

  var ui = DocumentApp.getUi();

  var docId = DocumentApp.getActiveDocument().getId();
  
  var file = Drive.Files.get(docId);

  Logger.log(file.properties);
  
  if (file.properties != null) {
    var link = "";    
    for (var n = 0; n < file.properties.length; n++) {
      if (file.properties[n].key == "CM_URI") {

        return Number(file.properties[n].value);       
      }
    }
  }
  
  return 0;
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  
  var sidebarName = 'sidebar';

  if (getRecordUri() !== 0) {
        sidebarName = 'existing_record_sidebar';   
  }
  

  var ui = HtmlService.createHtmlOutputFromFile(sidebarName)
      .setTitle('Content Manager');
  DocumentApp.getUi().showSidebar(ui);
  

  
 
}

function getRecordDetails() {
  var recordDetails = getJSON('Record/' + getRecordUri() + '?PropertyValue=Both&properties=' + DETAILS_PROPERTIES);
  
  Logger.log(recordDetails.Results);
  
  return recordDetails.Results[0];
}

function getRecordTypes() {

  var doc = DocumentApp.getActiveDocument();  
  var recordTypes = getJSON('RecordType?q=rtyHasElecDocSupport&pageSize=100&ExcludeCount=true&properties=Tooltip,dataentryformdefinition');

  for (var counter = 0; counter < recordTypes.Results.length; counter++) {
    var formDef = recordTypes.Results[counter].DataEntryFormDefinition;
    if ( formDef ) {
      for (var pageCounter = 0; pageCounter < formDef.Pages.length; pageCounter++) {
        for (var itemCounter = 0; itemCounter <  formDef.Pages[pageCounter].PageItems.length; itemCounter++) {
          var pageItem = formDef.Pages[pageCounter].PageItems[itemCounter];
          if (pageItem.Name === "RecordTypedTitle") {
            pageItem.Value = doc.getName();
          }
        }
      }
    }
  }
  
  return recordTypes.Results;
}



/**
 * Gets the stored user preferences for the origin and destination languages,
 * if they exist.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @return {Object} The user's origin and destination language preferences, if
 *     they exist.
 */
function getPreferences() {
  var userProperties = PropertiesService.getUserProperties();
  return {
    originLang: userProperties.getProperty('originLang'),
    destLang: userProperties.getProperty('destLang')
  };
}

function makeFinal(removeOldRevisions) {

  var fileId = DocumentApp.getActiveDocument().getId();
  var cookies = getSessionId();
  var uri = getRecordUri();
      
  var formData = {   
    'Uri': uri.toFixed(0),
    'properties': DETAILS_PROPERTIES,
    'PropertyValue': 'Both',
    'SetAsFinal': {"SetAsFinalRemoveOldRevisions": removeOldRevisions}
  };

  var options = {
    'method' : 'post',
    'muteHttpExceptions': true,
    'contentType': 'application/json',
    'payload' : JSON.stringify(formData),
     headers: {
      'Cookie': cookies
     }
  };
  
  var response = UrlFetchApp.fetch(SERVICE_URL + 'Record?format=json', options);
      
  var result = response.getContentText();
  
  var code = response.getResponseCode();
  if (code >= 400) {  
        
    throw ("Backend server error: " + result);
  } else {
      return JSON.parse(result).Results[0]; 
  }

  


  
return;
}

function checkIn() {

  var fileId = DocumentApp.getActiveDocument().getId();
  
  var file = Drive.Files.get(fileId);
  
  for (var k in file.exportLinks) {
    Logger.log(k);
    if (k.indexOf('application/vnd.openxmlformats') > -1) {

       var thisFile = UrlFetchApp.fetch(file.exportLinks[k], {
         headers: {
           Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
         }
       });         
      

      
      var cookies = getSessionId();
      var uri = getRecordUri();
      
      var formData = {   
        'Uri': uri.toFixed(0),
        'properties': DETAILS_PROPERTIES,
        'PropertyValue': 'Both',
        'Files':thisFile.getBlob()
      };

      var options = {
         'method' : 'post',
         'muteHttpExceptions': true,
         'payload' : formData,
         headers: {
           'Cookie': cookies
         }
      };
      var response = UrlFetchApp.fetch(SERVICE_URL + 'Record?format=json', options);
      
      var result = response.getContentText();
     Logger.log(result);
      var code = response.getResponseCode();
      if (code >= 400) {  
        
        throw ("Backend server error: " + result);
      } else {
           return JSON.parse(result).Results[0]; 
      }
    }
  

  }
  
return;
}

function registerRecord(formData) {  
  var cookies = getSessionId();  
  var doc = DocumentApp.getActiveDocument();
  
  formData.RecordExternalReference = doc.getId();
  formData.Fields = {'ExternalURL': doc.getUrl()};
      
                      /*
 var formData = {   
   'RecordRecordType': recordType,
   'RecordTitle': doc.getName(),
   'RecordExternalReference': doc.getId(),
   'Fields': {
      'ExternalURL': doc.getUrl()
    }
 };
  
  */

 var options = {
   'method' : 'post',
   'contentType': 'application/json',
   'payload' : JSON.stringify(formData),
    headers: {
      'Cookie': cookies
    },
 };


 var response = UrlFetchApp.fetch(SERVICE_URL + 'Record?format=json', options);
  
  
 var result = JSON.parse(response.getContentText());
  
  var fileId = DocumentApp.getActiveDocument().getId();
  
  var file = Drive.Files.get(fileId);
  
  var idProperty = Drive.newProperty();
  idProperty.key = "CM_URI";
  idProperty.value = result.Results[0].Uri
  idProperty.visibility = "PUBLIC";
  
 // file.properties.push(idProperty);
  

  
  (file.properties = file.properties || []).push(idProperty);
  
  Drive.Files.update(file, fileId);
  
  showSidebar();
}

/**
 * Replaces the text of the current selection with the provided text, or
 * inserts text at the current cursor location. (There will always be either
 * a selection or a cursor.) If multiple elements are selected, only inserts the
 * translated text in the first element that can contain text and removes the
 * other elements.
 *
 * @param {string} newText The text with which to replace the current selection.
 */
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw new Error('Can\'t insert text into an image.');
    }
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          var remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}

/**
 * Given text, translate it from the origin language to the destination
 * language. The languages are notated by their two-letter short form. For
 * example, English is 'en', and Spanish is 'es'. The origin language may be
 * specified as an empty string to indicate that Google Translate should
 * auto-detect the language.
 *
 * @param {string} text text to translate.
 * @param {string} origin The two-letter short form for the origin language.
 * @param {string} dest The two-letter short form for the destination language.
 * @return {string} The result of the translation, or the original text if
 *     origin and dest languages are the same.
 */
function translateText(text, origin, dest) {
  if (origin === dest) return text;
  return LanguageApp.translate(text, origin, dest);
}