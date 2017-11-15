# Alters a dataport export set such that the electronic documents are named with their record number (instead of suggested title)
# Reference: https://www.cmramble.com/blog/2017/10/15/exporting

$metadataFile = "C:\DataPort\Export\Out-of-the-box Electronic Export\records.txt"
$subFolder = "C:\DataPort\Export\Out-of-the-box Electronic Export\Documents\"
$metaData = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t"
for ( $i = 0; $i -le $metaData.Length; $i++ ) 
{
    $recordNumber = $metaData[$i]."Expanded Number"
    $existingFileName = $metaData[$i]."DOS file"
    $existingFilePath = [System.IO.Path]::Combine($subFolder, $existingFileName)
    $newFileName = ($recordNumber + [System.IO.Path]::GetExtension($existingFileName))
    $newFilePath = [System.IO.Path]::Combine($subFolder, $newFileName)
    if ( ![String]::IsNullOrWhiteSpace($existingFileName) -and (Test-Path $existingFilePath) -and (Test-Path $newFilePath) -eq $false ) 
    {
        if ( (Test-Path $newFilePath) ) 
        {
            Remove-Item -Path $newFilePath
        }
        Move-Item -Path $existingFilePath -Destination $newFilePath
        $metaData[$i].'DOS file' = $newFileName
    }
}
$metaData | ConvertTo-Csv -Delimiter "`t" -NoTypeInformation | Out-File -FilePath $metadataFile