# Server document edit ServiceAPI Plugin
This plugin checks in and out a document out to and from a shared folder on the server.  This could be called from a [Web Client add-in](http://www.hprm.info/blog/2016/1/1/web-and-native-client-add-in) to check out a document for a user to edit and then allow the user to check it back in.

## Setup
To use this sample:
 - Copy these files from your ServiceAPI bin folder to the Samples\ServiceAPI\CSharp\lib folder
    - HP.HPTRIM.SDK.dll
	- HP.HPTRIM.ServiceAPI.Client.dll
	- HP.HPTRIM.ServiceAPI.Common.dll
	- HP.HPTRIM.ServiceAPI.Model.dll
	- ServiceStack.Client.dll
	- ServiceStack.dll
	- ServiceStack.Interfaces.dll
	- ServiceStack.Text.dll
 - build the ServerEditPlugin project
 - copy ServerEditPlugin.dll to your ServiceAPI/Web Client bin folder
 - add the XML below to the hptrim.config file in your ServiceAPI folder (or hprmServiceAPI.config for Web Client).

## NOTE for HPE CM 8.x users
This sample has been built against HPE CM 9.3 but will work against 8.x with one change.   Instead of the DLLs above copy the ones below from the ServiceAPI bin (and then update the project references):
 - HP.HPTRIM.SDK.dll
 - HP.HPTRIM.Service.dll
 - HP.HPTRIM.ServiceModel.dll
 - ServiceStack.dll
 - ServiceStack.Interfaces.dll
 - ServiceStack.ServiceInterface.dll
 - ServiceStack.Text.dll
 
 
## Plugin Configuration
The following XML must be copied as a child of the hptrim element of hptrim.config

```
  <pluginAssemblies>
    <add name="ServerEditPlugin" />
  </pluginAssemblies>
```  



## Usage - Checkout
Once the plugin is installed you should be able to call the service like this:


```
http://localhost/cm/serviceapi/ServerCheckout/9000000281?format=json
```

This will extract the document and return a JSON object containing the Path to which the document was extracted.

## Usage - Checkin
To check a document back in POST to a URL like this:

```
http://localhost/cm/serviceapi/ServerCheckout
```

The data to post will look like this:

```
{
	"Uri":9000000281,
	"KeepCheckedOut": false,
	"NewRevision": true,
	"Comments": "some comments"
}
```

This request will check the document back into CM and delete the file (unless KeepCheckedOut == true).
