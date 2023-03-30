# Powershell - set Content Manager startup options
This sample demonstrates some of the fundamental components of a Content Manager Powershell script. The task it undertakes is to seta favourite Saved Search and set Content Manager to show a list of Saved Searches on startup.

## The namespace
The Content Manager objects are all prefixed with the namespace TRIM.SDK, if you are using a Content Manager version prior to 10.1 you will need to replace these all with HP.HPTRIM.SDK.

## Assembly path

```
$assemblyPath = "C:\trunk\x64\Debug\TRIM.SDK.dll"
Add-Type -Path $assemblyPath
```

This line sets the location of my SDK DLL, for Content Manager versions prior to 10.1 use HP.HPTRIM.SDK.dll instead of TRIM.SDK.dll.

## Connect the database
The code below connects to the database P1 on the local machine, your server will probably be on a separate machine, use its name instead.

```
$database = New-Object TRIM.SDK.Database
$database.Id = "P1"
$database.WorkgroupServerName = "local"
$database.Connect()
```

## Find all Locations from a specified Saved Search
This sample adds the Saved Search with the Uri 9000000008 to the user's favourite searches.  It then switches off all startup options except favourite searces.  Given that the user can choose to have zero or more windows open on startup you can choose to set any of these to true or false.


## Dispose
To keep things tidy I dispose the Database object at the end to close all connections to the actual Database.
```
$database.Dispose()
```