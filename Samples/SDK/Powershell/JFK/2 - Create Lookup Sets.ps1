Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
$metadataFile = "$($PSScriptRoot)\nara_jfk_2017release.tsv"
$metaData = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t" 

$fields = @("Formerly Withheld", "Agency", "Doc Type")

foreach ( $field in $fields ) 
{
    $fieldItems = $metaData | select $($field) | sort-object -Property $($field) -Unique | select $($field)
    $lookupSet = $null
    $lookupSetName = "NARA $($field)"
    $lookupSet = $db.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::LookupSet, $lookupSetName)
    if ( $lookupSet -eq $null ) 
    { 
        $lookupSet = New-Object HP.HPTRIM.SDK.LookupSet -ArgumentList $db 
        $lookupSet.Name = $lookupSetName
        $lookupSet.Save()
        Write-Host " Created '$($lookupSetName)' set"
    } 
    else 
    {
        Write-Host " Found '$($lookupSetName)' set"
    }
    foreach ( $item in $fieldItems ) 
    {
        $itemValue = $($item.$($field))
        if ( [String]::IsNullOrWhiteSpace($itemValue) -ne $true ) {
            $lookupItem = $db.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::LookupItem, $itemValue)
            if ( $lookupItem -eq $null ) 
            {
                $lookupItem = New-Object HP.HPTRIM.SDK.LookupItem -ArgumentList $lookupSet 
                $lookupItem.Name = $itemValue
                $lookupItem.Save() | Out-Null
                Write-Host " Added '$($itemValue)' item"
            } else {
                Write-Host " Found '$($itemValue)' item"
            }
        }
    }
}