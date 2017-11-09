Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
$metadataFile = "$PSScriptRoot\nara_jfk_2017release.tsv"
$docFolder = "$PSScriptRoot\docs"
$attachedFolder = "$PSScriptRoot\docs_attached"
Write-Progress -Activity "Attaching Documents" -Status "Loading Metadata" -PercentComplete 0
$metaData = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t"

#get list of just the PDF's (those that haven't been OCR'd)
$files = Get-ChildItem $docFolder | where { ($_.Extension -eq '.pdf') -and ($_.Name.Contains('ocr') -eq $false) }
$x = 0
foreach ( $file in $files ) 
{
    $meta = $metaData | where-object { $_.'File Name'.ToLower().Contains($file.Name.ToLower()) -eq $true } 
    Write-Progress -Activity "Attaching Documents" -Status "$($meta.'Record Num')" -PercentComplete (($x/$files.Length)*100) 
    $recordNum = $meta.'Record Num'


    $record = New-Object HP.HPTRIM.SDK.Record -ArgumentList $db, $recordNum
    $original = $meta.'File Name'
    $save = $false
    try {
        if ( $original.Contains(';') ) 
        {
            #generate file names
            $pdfFileName = $($original.Split(';')[0])
            $pdfOcrFileName = $([System.IO.Path]::GetFileNameWithoutExtension($pdfFileName)+"-ocr.pdf")
            $ocrTxt = $([System.IO.Path]::GetFileNameWithoutExtension($pdfFileName)+"-ocr.txt")
            #attach OCR'd PDF as main object
            $record.SetDocument("$($docFolder)\$pdfOcrFileName)", $false, $false, "")
            #add WAV as original rendition
            $record.ChildRenditions.NewRendition("$($docFolder)\$($original.Split(';')[1])", [HP.HPTRIM.SDK.RenditionType]::Original, "Audio Recording") | Out-Null
            #add PDF as transcription (Other1)
            $record.ChildRenditions.NewRendition("$($docFolder)\$pdfFileName", [HP.HPTRIM.SDK.RenditionType]::Other1, "Transcription") | Out-Null
            #add TXT as OCR
            $record.ChildRenditions.NewRendition($ocrTxt, [HP.HPTRIM.SDK.RenditionType]::Ocr, "Adobe Acrobat") | Out-Null
        } else {
            if ( Test-Path "$($docFolder)\$($original)" ) {
                #store OCR'd PDF as main object
                $pdfOcrFileName = $([System.IO.Path]::GetFileNameWithoutExtension($original)+"-ocr.pdf")
                $record.SetDocument("$($docFolder)\$($pdfOcrFileName)", $false, $false, "")
                #store file as original
                $record.ChildRenditions.NewRendition("$($docFolder)\$($original)", [HP.HPTRIM.SDK.RenditionType]::Original, "Official Record") | Out-Null    
                #stick OCR TXT as rendition
                $ocrTxtFileName = $([System.IO.Path]::GetFileNameWithoutExtension($original)+"-ocr.txt")
                $record.ChildRenditions.NewRendition("$($docFolder)\$($ocrTxtFileName)", [HP.HPTRIM.SDK.RenditionType]::Ocr, "Adobe Acrobat" )| Out-Null
                $record.Save()

                if ( ([String]::IsNullOrWhiteSpace($pdfOcrFileName) -eq $false) -and ( Test-Path "$($docFolder)\$($pdfOcrFileName)" ) ) {
                    if ( Test-Path "$($attachedFolder)\$([System.IO.Path]::GetFileName($pdfOcrFileName))" ) { Remove-Item "$($attachedFolder)\$([System.IO.Path]::GetFileName($pdfOcrFileName))" -Force }
                    Move-Item "$($docFolder)\$($pdfOcrFileName)" "$($attachedFolder)\$([System.IO.Path]::GetFileName($pdfOcrFileName))" 
                }
                if ( ([String]::IsNullOrWhiteSpace($original) -eq $false) -and ( Test-Path "$($docFolder)\$($original)" ) ) {
                    if ( Test-Path "$($attachedFolder)\$([System.IO.Path]::GetFileName($original))" ) { Remove-Item "$($attachedFolder)\$([System.IO.Path]::GetFileName($original))" -Force }
                    Move-Item "$($docFolder)\$($original)" "$($attachedFolder)\$([System.IO.Path]::GetFileName($original))"
                }
                if (  ([String]::IsNullOrWhiteSpace($ocrTxtFileName) -eq $false) -and ( Test-Path "$($docFolder)\$($ocrTxtFileName)" ) ) {
                    if ( Test-Path "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxtFileName))" ) { Remove-Item "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxtFileName))" -Force }
                    Move-Item "$($docFolder)\$($ocrTxtFileName)" "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxtFileName))"
                }
                if ( ([String]::IsNullOrWhiteSpace($ocrTxt) -eq $false) -and (Test-Path "$($docFolder)\$($ocrTxt)") ) {
                    if ( Test-Path "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxt))" ) { Remove-ITem "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxt))" -Force }
                    Move-Item "$($docFolder)\$($ocrTxt)" "$($attachedFolder)\$([System.IO.Path]::GetFileName($ocrTxt))"
                }
                Write-Information "Attached documents to record $($meta.'Record Num')"
            } elseif ( (Test-Path "$($attachedFolder)\$($original)") -eq $false ) {
                Write-Error "Missing file for record $($meta.'Record Num'): $($original)"
            }
        }


     

    } catch {
        Write-Error $_
    }
    $x++
}
