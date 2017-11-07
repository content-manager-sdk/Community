$metadataFile = "$PSScriptRoot\nara_jfk_2017release.tsv"
$metaData = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t"
$doc = New-Object HP.HPTRIM.SDK.RecordType -ArgumentList $db, "Document"
foreach ( $meta in $metaData ) 
{
    foreach ( $file in $meta.'File Name'.Split(';') ) 
    {
        $localFileName =  "$PSScriptRoot\$($file)"
        Invoke-WebRequest "https://www.archives.gov/files/research/jfk/releases/$(($file).ToLower())" -OutFile $localFileName
        if ( [System.IO.Path]::GetExtension($file).ToLower() -eq 'wav' ) {
            $record.SetDocument($localFileName)
        } else {
            $record.ChildRenditions.NewRendition($localFileName, [HP.HPTRIM.SDK.RenditionType]::Longevity)
        }
    }
    Write-Host "Imported Record $($meta.'Record Num'): $($record.TypedTitle)"
}
