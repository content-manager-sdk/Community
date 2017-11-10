Clear-Host
#Import .Net SDK for Content Manager
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
Write-Progress -Activity "Creating Records" -Status "Loading Metadata" -PercentComplete 0
#Import meta-data file from tab delimited and select unique originators (these will be created as locations)
$MetaDataRowdataFile = "$PSScriptRoot\nara_jfk_2017release.tsv"
$MetaDataRowData = Get-Content -Path $MetaDataRowdataFile | ConvertFrom-Csv -Delimiter "`t"
$DocumentRecordType = New-Object HP.HPTRIM.SDK.RecordType -ArgumentList $Database, "Document"
#Array used during custom property population
$Fields = @("Agency", "Comments", "Doc Date", "Doc Type", "File Name", "File Num", "Formerly Withheld", "From Name", "NARA Release Date", "Num Pages", "Originator", "Record Num", "Record Series", "To Name", "Review Date", "Title")
$RowNumber = 0
foreach ( $MetaDataRow in $MetaDataRowData ) 
{
    $RecordExisted = $false
    $RowNumber++
    Write-Progress -Activity "Creating Records" -Status "Record $($MetaDataRow.'Record Num')" -PercentComplete (($RowNumber/$MetaDataRowData.Length)*100)
    #Check if record already exists
    $Record = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::Record, $MetaDataRow.'Record Num')
    if ( $Record -ne $null ) {
       $RecordExisted = $true
    } else {
        $Record = New-Object HP.HPTRIM.SDK.Record -ArgumentList $Database, $DocumentRecordType
        $Record.LongNumber = $MetaDataRow.'Record Num'
    }
    #Correct title
    $Record.TypedTitle = (&{If([String]::IsNullOrWhiteSpace($MetaDataRow.Title)) { $MetaDataRow.'File Name' } else { $MetaDataRow.Title }})
    #Populate custom properties
    foreach ( $Field in $Fields ) 
    {
        try {
            switch ($Field) {
                "NARA Release Date" { $Record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $Database, "$($Field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $(($MetaDataRow).$Field))) }
                "Doc Date" { 
                    $FieldValue = $(($MetaDataRow).$Field)
                    if ( $FieldValue -ne "00/00/0000" ) {
                        $Record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $Database, "NARA $($Field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $FieldValue)) 
                    }
                }
                default { $Record.SetFieldValue((New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $Database, "NARA $($Field)"), (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $(($MetaDataRow).$Field))) }
            }
        } catch {
            Write-Error ("Exception $($MetaDataRow.'Record Num'): $($Record.TypedTitle): " + $_)
        }
    }
    $Record.Save()
    #Log what happened
    if ( $RecordExisted ) {
        Write-Information "Updated Record $($MetaDataRow.'Record Num'): $($Record.TypedTitle)"
    } else {
        Write-Information "Imported Record $($MetaDataRow.'Record Num'): $($Record.TypedTitle)"
    }

}
