var CM_LABEL = "[CM]";
var BASE_URL = 'https://mfcm.info';
var SERVICE_URL = BASE_URL + '/HPECMServiceAPI/';
var CLIENT_URL = BASE_URL + '/HPEContentManager/';


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


function uploadFile(e) {
  var cookies = getSessionId();
  
   var accessToken = e.messageMetadata.accessToken;
  
    GmailApp.setCurrentMessageAccessToken(accessToken);
  

    var messageId = e.messageMetadata.messageId;
    var message = GmailApp.getMessageById(messageId);
  
  
  
  var rawContent = message.getRawContent();
  
   // Make a POST request with form data.
 var resumeBlob = Utilities.newBlob(rawContent, 'message/rfc822', messageId + '.eml');
 var formData = {   
   'Files': resumeBlob
 };
 // Because payload is a JavaScript object, it will be interpreted as
 // as form data. (No need to specify contentType; it will automatically
 // default to either 'application/x-www-form-urlencoded'
 // or 'multipart/form-data')
 var options = {
   'method' : 'post',
   'payload' : formData,
       headers: {
        'Cookie': cookies
      },
 };
 var response = UrlFetchApp.fetch(SERVICE_URL + 'UploadFile?format=json', options);
  
  
 var result = JSON.parse(response.getContentText());
  
  return result.FilePath;
}


function suggestionCallback(e) {

  var query = e.formInput[e.parameters.propertyName];
  
  if (e.parameters.ObjectType == 'Record') {
    query = query += " or title:'" + query + "*'"; 
  }
  
    var locations = getJSON(e.parameters.ObjectType + '?q=' + query + '*&properties=Tooltip&pageSize=5&ExcludeCount=true');
  Logger.log(locations);
   var suggestions = CardService.newSuggestions();

   for(var i = 0; i < locations.Results.length; i++) {
     suggestions.addSuggestion(locations.Results[i].ToolTip + '(' + locations.Results[i].Uri + ')');
   }
   return CardService.newSuggestionsResponseBuilder()
       .setSuggestions(suggestions)
       .build(); 
}


function getValue(val) {
  if (val) {
    
    if (!val.IsClear && val.DateTime) {
      return val.DateTime;
    }
    
    if (val.IsClear === true) {
      return "";
    }
    
    if (val.NameString) {
      if (val.Uri) {
        return val.NameString + '(' + val.Uri + ')';
      }
      
      return val.NameString;
    }
    return val;
  }
  return '';
}


var nav;

function showRecordForm(e) {
  
  var cookies = getSessionId();
  
  var fileName = uploadFile(e);
  
  e.parameters.RecordFilePath = fileName.replace(/\\/g, '/');
  
      var recordFormCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle('New Record'));

  var formData = {
                    "ByPassSave": true,
                    "RecordRecordType": e.formInput.RecordRecordType,
                    "RecordFilePath": e.parameters.RecordFilePath,
                    "properties": "dataentryformdefinition"
                };
  //var recordType = getJSON('RecordType/' + e.formInput.RecordRecordType + '?properties=dataentryformdefinition');
  
   var options = {
   'method' : 'post',
   'payload' : formData,
       headers: {
        'Cookie': cookies
      },
 };
 var response = UrlFetchApp.fetch(SERVICE_URL + 'Record?format=json', options);
  var result = JSON.parse(response.getContentText());
  
  var page = result.Results[0].DataEntryFormDefinition.Pages[0];
  
  
  var pageSection = CardService.newCardSection().setHeader(page.Caption);
  
  for (var itemCounter = 0; itemCounter < page.PageItems.length; itemCounter++) {
    var pageItem = page.PageItems[itemCounter];
    if (pageItem.Type == 'Field' || pageItem.Type == 'Property') {
      
      var prop = CardService.newTextInput()
                            .setTitle(pageItem.Caption)
                            .setFieldName(pageItem.Name)
                            .setValue(""+getValue(pageItem.Value));
      
      if (pageItem.Format == 'Object') {

        var suggestionsAction = CardService.newAction()
           .setFunctionName('suggestionCallback')
           .setParameters({'ObjectType': pageItem.ObjectType, 'numSuggestions': '7', 'propertyName':pageItem.Name});
      
        prop.setSuggestionsAction(suggestionsAction);
        
        
      } else if (pageItem.LookupValues) {
        prop = CardService.newSelectionInput()
                 .setType(CardService.SelectionInputType.DROPDOWN)
                 .setTitle(pageItem.Caption)
                 .setFieldName(pageItem.Name);
        
        for (var liCounter = 0; liCounter < pageItem.LookupValues.length; liCounter++) {
          prop.addItem( pageItem.LookupValues[liCounter], pageItem.LookupValues[liCounter], false);
        }
        
        
      } else if (pageItem.Format == 'Boolean') {
          prop =  CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.CHECK_BOX)
    .setFieldName(pageItem.Name)
    .addItem(pageItem.Caption, "True", false)

      } 
      
      if (pageItem.Format == 'Datetime' || pageItem.Format == 'Date') {
          prop.setHint('dd/MM/YYY');
      }
      
      pageSection.addWidget(prop);
      
    }
  }
  
  var p = e.parameters;
  p.RecordRecordType = e.formInput.RecordRecordType;
  
  var nAction = CardService.newAction().setFunctionName("notificationCallback").setParameters(p);

  var checkinButton = CardService.newTextButton()
   .setText("Check In").setOnClickAction(nAction);
  
  pageSection.addWidget(checkinButton);
  
  recordFormCard = recordFormCard.addSection(pageSection).build();
  

  nav = CardService.newNavigation().pushCard(recordFormCard);
  
  return  CardService.newActionResponseBuilder()
            .setNavigation(nav)
            .build();
  
}

function openLinkCallback(e) {
  return CardService.newActionResponseBuilder()
      .setOpenLink(CardService.newOpenLink()
          .setUrl(SERVICE_URL + 'CreateRecordExample').setOpenAs(CardService.OpenAs.OVERLAY))
      .build();
}


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function notificationCallback(e) {
  
  var cookies = getSessionId();
  
  var formData = e.formInput;
  
  for (var fieldName in formData) {
    var propVal = formData[fieldName];
    var startIdx = propVal.lastIndexOf('(');
    
    if (endsWith(propVal, ')') && startIdx > -1) {
       var uri = propVal.substring(startIdx+1, propVal.length-1);
       if (isNumber(uri)) {
         formData[fieldName] = uri;
       }
    }
  }
  
  formData.RecordRecordType = e.parameters.RecordRecordType;
  formData.RecordFilePath = e.parameters.RecordFilePath;
  
  formData.properties = "RecordNumber,RecordTitle";
  formData.RecordExternalReference = e.messageMetadata.messageId;
  
  var options = {
    'method' : 'post',
    'payload' : formData,
    muteHttpExceptions: true,
    headers: {
       'Cookie': cookies
    }
  };
 

  
 var response = UrlFetchApp.fetch(SERVICE_URL + 'Record?format=json', options);
 var result = JSON.parse(response.getContentText());
    
 var code = response.getResponseCode();
 if (code >= 400) {  
   return CardService.newActionResponseBuilder()
     
     .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText(result.ResponseStatus.Message))
    .build();
 }   
  
 attachLabel(e)
  
 var nav = CardService.newNavigation().popToRoot().updateCard(makePropertiesCard(result.Results[0]));
  
 return CardService.newActionResponseBuilder()
  .setStateChanged(true)
  .setNotification(CardService.newNotification()
       .setType(CardService.NotificationType.INFO)
       .setText("Record " + result.Results[0].RecordNumber.Value + " created in Content Manager"))
  .setNavigation(nav)
  .build();
  

}


function getEmailRecord(e) { 
  
  var result = getJSON('Record?q=recExternal:' + e.messageMetadata.messageId + '*&&pageSize=1&ExcludeCount=true&properties=RecordNumber,RecordTitle');
  
  if (result.Results.length > 0) {
    return result.Results[0]; 
  }
  return null;
}

function attachLabel(e) {
  
   var accessToken = e.messageMetadata.accessToken;
  
    GmailApp.setCurrentMessageAccessToken(accessToken);
  
 var msg = GmailApp.getMessageById(e.messageMetadata.messageId);
  
  msg.getThread()
  .addLabel(GmailApp.createLabel(CM_LABEL));
}

function makePropertiesCard(rec) {
     var numKey = CardService.newKeyValue()
       .setTopLabel("Number")
       .setContent(rec.RecordNumber.Value);
      
     var titleKey = CardService.newKeyValue()
       .setTopLabel("Title")
       .setContent(rec.RecordTitle.Value);
      
     var button = CardService.newTextButton()
       .setText("Open in CM")
       .setOpenLink(CardService.newOpenLink()
        .setUrl(CLIENT_URL + "?q=uri:" + rec.Uri + "&t=Record")
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING));
      
    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle('Record Details'))
        .addSection(CardService.newCardSection()
            .addWidget(numKey)  
            .addWidget(titleKey) 
            .addWidget(button)        

            )
        .build();   // Don't forget to build the Card!
  
  
}

function getContextualAddOn(e) {

  
  if (rec = getEmailRecord(e)) {  
    return [makePropertiesCard(rec)];
  }
  
  
  
  var recordTypeUI = CardService.newSelectionInput()
     .setTitle('Record Type')
     .setType(CardService.SelectionInputType.DROPDOWN)
     .setFieldName('RecordRecordType');
  
  
  var recordTypes = getJSON('RecordType?q=all&filter=unkActive rtyHasElecDocSupport&properties=Name'); 

  
  for (var counter = 0; counter < recordTypes.Results.length; counter++) {
    recordTypeUI.addItem(recordTypes.Results[counter].RecordTypeName.Value, recordTypes.Results[counter].Uri.toString(), false);
  }
  
  var action = CardService.newAction().setFunctionName('showRecordForm');
    
  var formButton = CardService.newTextButton()
     .setText("Show Form").setOnClickAction(action);

  var mainCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle('File'))
        .addSection(CardService.newCardSection()
            .addWidget(recordTypeUI)
            .addWidget(formButton)

            )
        .build();   // Don't forget to build the Card!
  return [mainCard];
}

