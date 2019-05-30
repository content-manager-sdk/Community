# Simple ServiceAPI Plugin
This sample adds a new service to the ServiceAPI to fetch a Record Title along with the current user name, it serves to demonstrate the creation of a ServiceAPI plugin.

## Support
ServiceAPI plugins are supported from version 8.2 onwards.

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
 - build the SimpleServiceAPIPlugin project
 - copy SimpleServiceAPIPlugin.dll to your ServiceAPI bin folder
 - add the XML below to the hptrim.config file in your ServiceAPI folder

## NOTE for HPE CM 8.x users
This sample has been built against HPE CM 9.0 but will work against 8.x with one change.   Instead of the DLLs above copy the ones below from the ServiceAPI bin (and then update the project references):
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
    <add name="SimpleServiceAPIPlugin" />
  </pluginAssemblies>
```  



## Usage
Once the plugin is installed you should be able to call the service like this:


```
http://localhost/HPRMServiceAPI/simple?format=json&Uri=9000000000
```

## Usage from .Net proxy classes
One important thing to note is that in the SimpleService.cs the request model (Simple) implements the interface IReturn<SimpleResponse>. This allow the .Net proxy classes to link the request and response in the .Get method, for example:

```
TrimClient trimClient = new TrimClient("http://localhost/ServiceAPI");
trimClient.AlwaysSendBasicAuthHeader = true;
trimClient.Password = "XXXXXXX";
trimClient.UserName = "user_a";

SimpleResponse response = trimClient.Get<SimpleResponse>(new Simple() { Uri = 9000000000 });
Console.WriteLine(response.RecordTitle);
```