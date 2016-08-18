# MakeReference ServiceAPI Plugin
This sample adds a new service to the ServiceAPI to download a TR5 reference file which maybe used to open a Record (or other object type) in the native client.

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
 - build the MakeReferencePlugin project
 - copy MakeReferencePlugin.dll to your ServiceAPI bin folder
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
    <add name="MakeReferencePlugin" />
  </pluginAssemblies>
```  

### Example

![Example Config](plugin_config.PNG)


## Usage
Once the plugin is installed you should be able to download a TR5 file using a URL similar to this:

### Record TR5
```
http://localhost/HPRMServiceAPI/MakeReference?TrimType=Record&Name=D16/1
```

### Location TR5
```
http://localhost/HPRMServiceAPI/MakeReference?TrimType=Location&Name=David
```