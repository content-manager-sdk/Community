# Email Link Admin
Email Link includes an admin console which is used to edit the preferences.json file that drives EmailLink operation.  This preferences file can be edited with any text editor except for the portions of that are encrypted.  This console app demonstrates using the Content Manager framework assembly to edit the EmailLink preferences.

## Audience
The audience for this sample is anyone who wishes to configure EmailLink without using the user intergace.

## Warning
The encryption used by EmailLink requires that the aplication that saves preferences.json is running as the same user that the EmailLink server is running as.

## Instructions
To build this application first copy HP.HPTRIM.Framework.dll and ServiceStack.Text.dll from your EmailLink install folder to the Samples\SDK\CSharp\lib folder.