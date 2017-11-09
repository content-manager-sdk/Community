#Import .Net SDK for Content Manager
Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Import meta-data file from tab delimited and select unique originators (these will be created as locations)
$MetadataFile = "$($PSScriptRoot)\nara_jfk_2017release.tsv"
$MetaData = Get-Content -Path $MetadataFile | ConvertFrom-Csv -Delimiter "`t"
$DocumentFolder = "$PSScriptRoot\docs"
if ( Test-Path $DocumentFolder -eq $false ) { New-Item $DocumentFolder -ItemType Directory }
#Fetch the record type for documents
$DocumentRecordType = New-Object HP.HPTRIM.SDK.RecordType -ArgumentList $Database, "Document"
foreach ( $MetaRow in $MetaData ) 
{
    $Record = [HP.HPTRIM.SDK.Record]$Database.FindTrimObjectByName($MetaRow.'Record Num')
    foreach ( $MetaFileName in $MetaRow.'File Name'.Split(';') ) 
    {
        #Download the document
        $LocalFileName =  "$($DocumentFolder)\$($MetaFileName)"
        Invoke-WebRequest "https://www.archives.gov/files/research/jfk/releases/$(($MetaFileName).ToLower())" -OutFile $LocalFileName
        #All files first get attach as main document and then as the appropriate rendition type
        $Record.SetDocument($LocalFileName)
        if ( ([System.IO.Path]::GetExtension($file).ToLower() -eq 'pdf') -and ($Record.ChildRenditions.Count -gt 0) ) {
             $Record.ChildRenditions.NewRendition($LocalFileName, [HP.HPTRIM.SDK.RenditionType]::Other1)
        } else {   
            $Record.ChildRenditions.NewRendition($LocalFileName, [HP.HPTRIM.SDK.RenditionType]::Original)
        }
    }
    $Record.Save()
    Write-Host "Imported Record $($meta.'Record Num'): $($record.TypedTitle)"
}
