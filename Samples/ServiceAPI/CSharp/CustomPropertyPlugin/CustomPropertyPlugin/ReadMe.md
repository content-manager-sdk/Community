# Custom property plugin
This sample adds a new property to the Record object.

## Setup
To use this sample:
 - Copy these files from your ServiceAPI bin folder to the Samples\ServiceAPI\CSharp\lib folder
    - HP.HPTRIM.SDK.dll
	- HP.HPTRIM.ServiceAPI.Common.dll
	- HP.HPTRIM.ServiceAPI.Model.dll

 - build the project
 - copy CustomPropertyPlugin.dll to your ServiceAPI (and/or WebDrawer) bin folder
 - add the XML below to the hptrim.config file in your ServiceAPI/WebDrawer folder

## Requirements
Content Manager 9.2 Patch 1 is required for this sample.

For the property MyTestCustomLocation to work you will require:
 - a Record with the GpsLocation set
 - at least one Project Team Location with a GpsLocation within 5 kilometres of the Record
 
 
## Plugin Configuration
The following XML must be copied as a child of the hptrim element of hptrim.config.

```
  <pluginAssemblies>
    <add name="CustomPropertyPlugin" />
  </pluginAssemblies>
```  

To include the propperties in the 'Other' section in the WebDrawer details page add the property names to the apprtopriate section like this:

```
	<add
		name="RecordOther"
		properties="RecordDateInactive,RecordPriority,RecordFullClassification,RecordDateFinalized,RecordReviewDate,RecordIsEnclosed,RecordHistory,RecordReturnDueDateTime,RecordDispositionChanges,MyTestCustomProperty,MyTestCustomLocation"
    />
```  

## Usage
Once the plugin is installed you should be able to request your properties by including them in the properties query parameter, for example:

```
http://localhost/ServiceAPI/Record/9000000296?format=json&properties=MyTestCustomProperty
```

The properties should also be available in the PropertyDef service and the custom property help, for example:

```
http://localhost/ServiceAPI/help/customproperties

http://localhost/ServiceAPI/PropertyDef?TrimType=Record&GetProperties=MyTestCustomProperty&format=json
```