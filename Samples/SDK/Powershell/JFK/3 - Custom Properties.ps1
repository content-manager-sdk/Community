Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect

$lookupFields = @("NARA Formerly Withheld", "NARA Agency", "NARA Doc Type")
foreach ( $lookupField  in $lookupFields ) 
{
    $field = New-Object HP.HPTRIM.SDK.FieldDefinition $db
    $field.Name = $lookupField
    $field.LookupSet = New-Object HP.HPTRIM.SDK.LookupSet $db, $lookupField
    $field.Save()

    Write-Host "Created Property for Lookup Set '$($lookupField)'"
}
$stringFields = @("NARA File Num", "NARA To Name", "NARA From Name", "NARA Title", "NARA Originator", "NARA Record Series", "NARA Comments", "NARA Record Num", "NARA File Name")
foreach ( $stringField  in $stringFields ) 
{
    $field = New-Object HP.HPTRIM.SDK.FieldDefinition $db
    $field.Name = $stringField
    $field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::String
    $field.Length = 255
    $field.Save()

    Write-Host "Created Property '$($stringField)' as String with length $($field.Length)"
}
$numberFields = @("NARA Num Pages", "NARA Pages Released")
foreach ( $numberField  in $numberFields ) 
{
    $field = New-Object HP.HPTRIM.SDK.FieldDefinition $db
    $field.Name = $numberField
    $field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::Number
    $field.Save()

    Write-Host "Created Property '$($numberField)' as Number"
}

$dateFields = @("NARA Release Date", "NARA Doc Date", "NARA Review Date")
foreach ( $dateField in $dateFields ) 
{
    $field = New-Object HP.HPTRIM.SDK.FieldDefinition $db
    $field.Name = $dateField 
    $field.Format = [HP.HPTRIM.SDK.UserFieldFormats]::Date
    $field.Save()

    Write-Host "Created Property '$($dateField)' as Date"
}