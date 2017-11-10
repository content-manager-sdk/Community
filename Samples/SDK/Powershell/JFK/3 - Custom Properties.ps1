#Import .Net SDK for Content Manager
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Get document record type
$DocumentRecordType = [HP.HPTRIM.SDK.RecordType]$Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::RecordType, "Document")

#Loop through and create new lookupset properties
$LookupSetFieldNames = @("NARA Formerly Withheld", "NARA Agency", "NARA Doc Type")
foreach ( $LookupSetFieldName  in $LookupSetFieldNames ) 
{
    $Field = New-Object HP.HPTRIM.SDK.FieldDefinition $Database
    $Field.Name = $LookupSetFieldName
    $Field.LookupSet = New-Object HP.HPTRIM.SDK.LookupSet($Database, $LookupSetFieldName)
    $Field.Save()
    $DocumentRecordType.SetUserFieldUsage($Field,$true)
    Write-Host "Created Property for Lookup Set '$($LookupSetFieldName)'"
}

#Loop through and create string properties
$StringFieldNames = @("NARA File Num", "NARA To Name", "NARA From Name", "NARA Title", "NARA Originator", "NARA Record Series", "NARA Comments", "NARA Record Num", "NARA File Name")
foreach ( $StringFieldName  in $StringFieldNames ) 
{
    $Field = New-Object HP.HPTRIM.SDK.FieldDefinition $Database
    $Field.Name = $StringFieldName
    $Field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::String
    $Field.Length = 255
    $Field.Save()
    $DocumentRecordType.SetUserFieldUsage($Field,$true)
    Write-Host "Created Property '$($StringFieldName)' as String with length $($Field.Length)"
}

#Loop through and create number properties
$NumberFieldNames = @("NARA Num Pages", "NARA Pages Released")
foreach ( $NumberFieldName  in $NumberFieldNames ) 
{
    $Field = New-Object HP.HPTRIM.SDK.FieldDefinition $Database
    $Field.Name = $NumberFieldName
    $Field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::Number
    $Field.Save()
    $DocumentRecordType.SetUserFieldUsage($Field,$true)
    Write-Host "Created Property '$($NumberFieldName)' as Number"
}

#Loop through and create date properties
$DateFieldNames = @("NARA Release Date", "NARA Doc Date", "NARA Review Date")
foreach ( $DateFieldName in $DateFieldNames ) 
{
    $Field = New-Object HP.HPTRIM.SDK.FieldDefinition $Database
    $Field.Name = $DateFieldName 
    $Field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::Date
    $Field.Save()
    $DocumentRecordType.SetUserFieldUsage($Field,$true)
    Write-Host "Created Property '$($DateFieldName)' as Date"
}