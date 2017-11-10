#Import .Net SDK for Content Manager
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Import meta-data file from tab delimited and select unique originators (these will be created as locations)
$MetaDataArrayFileName = "$($PSScriptRoot)\nara_jfk_2017release.tsv"
$MetaDataArray = Get-Content -Path $MetaDataArrayFileName | ConvertFrom-Csv -Delimiter "`t" 
#Loop through the creation of three lookup sets
$Fields = @("Formerly Withheld", "Agency", "Doc Type")
foreach ( $Field in $Fields ) 
{
    #Create the lookup set if missing
    $LookupSetName = "NARA $($Field)"
    $LookupSet = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::LookupSet, $LookupSetName)
    if ( $LookupSet -eq $null ) 
    { 
        $LookupSet = New-Object HP.HPTRIM.SDK.LookupSet -ArgumentList $Database 
        $LookupSet.Name = $LookupSetName
        $LookupSet.Save()
        Write-Host " Created '$($LookupSetName)' set"
    } 
    else 
    {
        Write-Host " Found '$($LookupSetName)' set"
    }
    #Extract unique values from matching column in meta-data spreadsheet
    $FieldItems = $MetaDataArray | select $($Field) | sort-object -Property $($Field) -Unique | select $($Field)
    #Create each unique value as a lookup set item
    foreach ( $item in $FieldItems ) 
    {
        #Formulate lookupset item value, if valid string create in CM 
        $ItemValue = $($item.$($Field))
        if ( [String]::IsNullOrWhiteSpace($ItemValue) -ne $true ) {
            $LookupItem = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::LookupItem, $ItemValue)
            if ( $LookupItem -eq $null ) 
            {
                $LookupItem = New-Object HP.HPTRIM.SDK.LookupItem -ArgumentList $LookupSet 
                $LookupItem.Name = $ItemValue
                $LookupItem.Save() | Out-Null
                Write-Host " Added '$($ItemValue)' item"
            } else {
                Write-Host " Found '$($ItemValue)' item"
            }
        }
    }
}