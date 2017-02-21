# CORS ServiceAPI Plugin
Cross origin resource sharing ([CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)) allows a javascript application in one domain to talk to a web service in another domain, something which the browser security model usually prevents.  The ServiceAPI documentation mentions a CORS feature which, in theory, will enable CORS support but in most circumstances will not work.  This module adds CORS support by getting into the request pipeline before the standard IIS authentication has had a chance to block the CORS pre-flight request.

## Setup
To use this sample:
 - build the project
 - copy CORSModule.dll to the ServiceAPI bin folder
 - add the module to the web.config, as seen below
 - if you are using windows authentication you may need to explicitly set the supported domains, in fact it is probably a good idea to do this anyway, set these in appSettings as seen below
 - if you do not set 'allowedOrigins' in app settings than all domains will be allowed to use CORS (Access-Control-Allow-Origin = "*")

## Module in web.config
 ```xml
 <modules runAllManagedModulesForAllRequests="true">
  <add name="CORSModule" type="CORSModule, CORSModule" />
  ...
</modules>
 ```

## appSettings
```xml
  <appSettings file="user.config">
    <add key="allowedOrigins" value="https://MyDomainOne, https://MyDomainTwo"/>
  </appSettings>
```

## Sample jQuery
The following jQuery will make a windows authenticated request on your server, note nothing special needs to be sent from the jQuery to support CORS.

```javascript
$.ajax({
    xhrFields :{ withCredentials:true },
    url: "http://MyDomainOne/ServiceAPI82/Record/1?&properties=RecordTitle",
    type: 'GET',
    dataType: 'json',
})
.done(function (response, statusText) {
    
    if (statusText === "success") {
        alert("Record named: " + response.Results[0].RecordTitle.Value + " was found.");
    }
})
.fail(function (xhr) {
    var err = eval("(" + xhr.responseText + ")");
    alert(err.ResponseStatus.Message);

});

```
