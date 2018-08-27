# Thin Office Plug-in
A Thin Office plug-in allows you to modify the HTTP request sent to the web client from the Content Manager office integration.  One use of this is the building of custom authentication.  This sample demonstrates two simple uses of this to add a
 * basic user-name / password prompt, or
 * a SAML login screen.

## Operation 
The operation of the basic authentication plug-in is as follows:
 1. the BeforeRequest method displays a user name / password dialog,
 2. the user name and password are Base64 encoded, then
 3. the authorization header is set on the request object.
 
The operation of the SAML plugin is similar to the basic except that it:
 * displays the login page in a WebBrowser control, 
 * when the control is reloaded extracts the authentication cookie from the control, then
 * stores that cookie in memory to apply to later requests.

## Warning
These are samples only and not intended for commercial use.  One potential enhancement is to securely store the authentication string (or cookie) on the user's machine to avoid having to authenticate every time the application is opened.

## Usage
To use the basic authentication plug-in:
 1. ensure that the Content Manager Web Client has Basic authentication enabled in IIS Manager,
 2. build the project,
 3. copy the file OfficePlugin.dll to the end user's office integration install folder, then
 4. close and re-open an office application (only works when using the Content Manager web client as the data source).
 
To use the SAML sample follow the above steps except configure SAML on your CM server. 


## Before doing a build
Before building this project copy these files from your office integration install folder to the folder HPECM-Community\Samples\ServiceAPI\CSharp\lib:
 * HP.HPRM.OfficeIntegration.dll
 * HP.HPTRIM.ServiceAPI.Client.dll
 * ServiceStack.Client.dll

 ## In version 9.2 
 HP.HPRP.OfficeIntegration.dll in version 9.2 uses .Net framework 4.6.2 so this project will need to be changed from 4.6.1 to 4.6.2 when building against CM 9.2 DLLs.