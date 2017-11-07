Clear-Host
Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
$metadataFile = "$PSScriptRoot\nara_jfk_2017release.tsv"
Write-Progress -Activity "Creating Records" -Status "Loading Metadata" -PercentComplete 0
$metaData = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t"
$doc = New-Object HP.HPTRIM.SDK.RecordType -ArgumentList $db, "Document"
$fields = @("Agency", "Comments", "Doc Date", "Doc Type", "File Name", "File Num", "Formerly Withheld", "From Name", "NARA Release Date", "Num Pages", "Originator", "Record Num", "Record Series", "To Name", "Review Date", "Title")
$x = 0
foreach ( $meta in $metaData ) 
{
    $existed = $false
    $x++
    Write-Progress -Activity "Creating Records" -Status "Record $($meta.'Record Num')" -PercentComplete (($x/$metaData.Length)*100)
    #check if record already exists
    $record = $db.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::Record, $meta.'Record Num')
    if ( $record -ne $null ) {
       $existed = $true
    } else {
        $record = New-Object HP.HPTRIM.SDK.Record -ArgumentList $db, $doc
        $record.LongNumber = $meta.'Record Num'
    }
    #correct title
    $record.TypedTitle = (&{If([String]::IsNullOrWhiteSpace($meta.Title)) { $meta.'File Name' } else { $meta.Title }})
    #populate custom properties
    foreach ( $field in $fields ) 
    {
        try {
            switch ($field) {
                "NARA Release Date" { $record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $db, "$($field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $(($meta).$field))) }
                "Doc Date" { 
                    $fieldValue = $(($meta).$field)
                    if ( $fieldValue -ne "00/00/0000" ) {
                        $record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $db, "NARA $($field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $fieldValue)) 
                    }
                }
                default { $record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $db, "NARA $($field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $(($meta).$field))) }
            }
        } catch {
            Write-Error ("Exception $($meta.'Record Num'): $($record.TypedTitle): " + $_)
        }
    }
    $record.Save()
    if ( $existed ) {
        Write-Information "Updated Record $($meta.'Record Num'): $($record.TypedTitle)"
    } else {
        Write-Information "Imported Record $($meta.'Record Num'): $($record.TypedTitle)"
    }

}
