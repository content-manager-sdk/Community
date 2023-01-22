# Powershell Sample Script
This sample demonstrates some of the fundamental components of a Content Manager Powershell script. The task it undertakes is to remove all relationships for a set of Locations.

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
For this sample I have a saved search called 'Me'.  In the code below I create a TrimMainObjectSearch object to search for Locations.  I then set the search string to find all Locations in the saved search named 'Me'. Note the use of single quotes inside SetSearchString(), this allows me to surround the name of the saved search with double quotes.

```
$updateLocations = New-Object TRIM.SDK.TrimMainObjectSearch($database, [TRIM.SDK.BaseObjectTypes]::Location)
$updateLocations.SetSearchString('saved:["Me"]')
```

## Remove all relationships
This code loops through all the Locations found by the search, calls RemoveAllRelationships() and then calls Save() to commit the changes to the database.


```
Foreach ( $Location in $updateLocations ) 
{
    $Location.RemoveAllRelationships()
    $Location.Save()
}
```

## Dispose
To keep things tidy I dispose the Database object at the end to close all connections to the actual Database.
```
$database.Dispose()
```