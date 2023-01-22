$assemblyPath = "C:\trunk\x64\Debug\TRIM.SDK.dll"
Add-Type -Path $assemblyPath

$database = New-Object TRIM.SDK.Database
$database.Id = "P1"
$database.WorkgroupServerName = "local"
$database.Connect()


$updateLocations = New-Object TRIM.SDK.TrimMainObjectSearch($database, [TRIM.SDK.BaseObjectTypes]::Location)
$updateLocations.SetSearchString('saved:["Me"]')


Foreach ( $Location in $updateLocations ) 
{
    $Location.RemoveAllRelationships()
    $Location.Save()
}

$database.Dispose()
