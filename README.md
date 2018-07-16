# Welcome to the HPECM-Community repo!
## Welcome
To start with this site is mostly about sample code for the .Net SDK.  It may become more than this depending on interest and time.

## Important
Before you build the C# samples you must copy any required files (usually at least HP.HPTRIM.SDK.dll and HP.HPTRIM.SDK.xml) from your Content Manager folder to \Samples\CSharp\lib.

## 32 versus 64 bit
As the SDK is a wrapper around the underlying unmanaged code it needs to know whether to run in 32 or 64 bit.  All samples in this site are built to run 64 bit.  To run in 32 bit mode change enable the option 'Prefer 32-bit' in each Project - Properties - Build settings

## Sample code compatibility
The sample code in this site should build against the current release of Content Manager (CM) (as at the time of writing 9.0).  In general most code should also work with older versions of CM, maybe with a few edits.  To change CM version replace Samples/CSharp/lib/HP.HPTRIM.SDK.DLL.

## Other resources
The .Net SDK documentation is available for version [83](http://sdk.hpecm.xyz/83/index.html) and [90](http://sdk.hpecm.xyz/90/index.html).

## List Sample Projects

| Project                                                                     | Description                                                                            |
| --------------------------------------------------------------------------- |----------------------------------------------------------------------------------------|
| [TrimUI](Samples/SDK/CSharp/TrimUI)                                         | A simple WPF application to demonstrate the user interferface classes in the SDK.      |
| [CreateNewDocument](Samples/SDK/CSharp/CreateNewDocument/)                  | A simple application demonstrating creation of a new Record from a RecordType.         | 
| [BulkDataLoader](Samples/SDK/CSharp/BulkDataLoader/)                       | Combines the BulkDataLoader and Origin to create a high performance import of Records. |
| [ExecutableAddin](Samples/SDK/CSharp/ExecutableAddin/)                      | Sample demonstrates passing parameters via the command line for an EXE addin.          |
| [EventProcessor](Samples/SDK/CSharp/EventProcessor/)                        | A custom event to plug into the core event processor and react to object (e.g. Record) related events on the server.|
| [SampleAddIn](Samples/SDK/CSharp/SampleAddIn/)                              | Custom save and delete behaviour or add items to the menu for various objects (e.g. Records) in the native client. |
| [ImportUsingOrigin](Samples/SDK/CSharp/ImportUsingOrigin/)                  | A WPF application to import documents based on an Origin. |
| [SimpleServiceAPIPlugin](Samples/ServiceAPI/CSharp/SimpleServiceAPIPlugin/) | A Simple ServiceAPI plugin, demonstrates how to call your plugin from the ServiceAPI client proxy. |
| [MakeReferencePlugin](Samples/ServiceAPI/CSharp/MakeReferencePlugin/)       | A ServiceAPI plugin which adds a service to download a TR5 reference file. |
| [AddingGroupMemberships](Samples/ServiceAPI/CSharp/AddingGroupMemberships/) | A C# ServiceAPI client application to add a 'Member Of' association between two Locations. |
| [Web Drawer DateRangeSearch](Samples/WebDrawer/DateRangeSearch/) | Some sample code to transform WebDrawer date search fields from plain text to a date range picker. |
| [ServiceAPI OAuth](Samples/ServiceAPI/CSharp/ADFSOauthClient/) | Console application to connect to the ServiceAPI using ADFS OAuth, plus instructions to configure the ServiceAPI to use OAuth. |
| [Database pool for web services](Samples/SDK/CSharp/DatabasePool/)   | Speed up your RM database connections when building a web service. |
| [ServiceAPI CORS](Samples/ServiceAPI/CSharp/CORSModule/) | Add [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) support to the ServiceAPI. |
| [ServiceAPI Java](Samples/ServiceAPI/Java/MyTestConsole/) | A first sample using Java to connect to the ServiceAPI. |
| [ServiceAPI Java file upload](Samples/ServiceAPI/Java/SampleFileUpload/) | Create a Record and attach a file to it using Java. |
| [ServiceAPI Google OAuth2 Authentication](Samples/ServiceAPI/CSharp/GoogleAuthPlugin/) | Use the ServiceStack Google OAuth2 authentication provider in WebDrawer and the Web Client. |
| [SDK Create Location WPF UI](Samples/SDK/CSharp/CreateLocation) | A simple WPF user interface to create a Location. |
| [SDK Record update](Samples/SDK/CSharp/Record_Update_SDKSample) | Find a Record by number and update some of its properties. |
| [ServiceAPI / Web Client SAML support](Samples/ServiceAPI/CSharp/ComponentSpaceSAMLPlugin) | Authenticate the ServiceAPi (including Web Client) using SAML. |


