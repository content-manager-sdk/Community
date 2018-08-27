# Thin Office Plugin
A Thin OFfice plugin allows you to modify the HTTP request sent to the web client from the Content Manager office integagration.  One use of this is the building of custom authentication.  This sample demonstrates a very simple use of this to add a basic username / paassword prompt. 

## Operation 
The operation of this plugin is as follows:
 1 the BeforeRequest method displays a user name / password dialog,
 2 the user name and password are Base64 encoded, then
 3 the authorization header is set on the request object.

## Warning
This is a sample only and not intended for commercial use.

## Usage
To use this plugin:
 1 ensure that the Content Manager Web Client has Basic authentication enabled in IIS Manager,
 2 build the project,
 3 copy the file OfficePlugin.dll to the end user's office integration install folder, then
 4 close and re-open an office application (only works when using the Content Manager web client as the data source).


## Before doing a build
Before building this project copy these files from your office integration install folder to the folder HPECM-Community\Samples\ServiceAPI\CSharp\lib:
 * HP.HPRM.OfficeIntegration.dll
 * HP.HPTRIM.ServiceAPI.Client.dll
 * ServiceStack.Client.dll

 ## In version 9.2 
 HP.HPRP.OfficeIntegration.dll in version 9.2 uses .Net framework 4.6.2 so this project wil need to be changed from 4.6.1 to 4.6.2 when building againdt CM 9.2 DLLs.