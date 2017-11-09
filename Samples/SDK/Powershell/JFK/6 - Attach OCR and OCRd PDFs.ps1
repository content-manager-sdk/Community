Clear-Host
#Import .Net SDK for Content Manager
Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Formulate starting and ending folder (document moved after successfully imported)
$DocumentsFolder = "$PSScriptRoot\docs"
$AttachedFolder = "$PSScriptRoot\docs_attached"
Write-Progress -Activity "Attaching Documents" -Status "Loading Metadata" -PercentComplete 0
#Import meta-data file from tab delimited and select unique originators (these will be created as locations)
$MetaDataFile = "$PSScriptRoot\nara_jfk_2017release.tsv"
$MetaData = Get-Content -Path $MetaDataFile | ConvertFrom-Csv -Delimiter "`t"
#Get list of just the PDF's (those that haven't been OCR'd)
$Files = Get-ChildItem $DocumentsFolder | where { ($_.Extension -eq '.pdf') -and ($_.Name.Contains('ocr') -eq $false) }
$FileNumber = 0
#Loop through each file and create/attach to the record indicated in the meta-data file.  Alternatively, could search CM for meta-data file name
foreach ( $File in $Files ) 
{
    #Find meta-data row based on file name
    $MetaDataRow = $MetaData | where-object { $_.'File Name'.ToLower().Contains($File.Name.ToLower()) -eq $true } 
    Write-Progress -Activity "Attaching Documents" -Status "$($MetaDataRow.'Record Num')" -PercentComplete (($FileNumber/$Files.Length)*100) 
    #Grab the record number and look it up in CM
    $RecordNum = $MetaDataRow.'Record Num'
    $Record = New-Object HP.HPTRIM.SDK.Record -ArgumentList $Database, $RecordNum
    #Track the original file name so we can compare it later
    $OriginalFileName = $MetaDataRow.'File Name'
    $ShouldSave = $false
    try {
        #If there's an audio attachment (Two file names) then we handle that with two renditions
        if ( $OriginalFileName.Contains(';') ) 
        {
            #generate file names
            $PdfFileName = $($OriginalFileName.Split(';')[0])
            $PdfOcrFileName = $([System.IO.Path]::GetFileNameWithoutExtension($PdfFileName)+"-ocr.pdf")
            $OcrTxt = $([System.IO.Path]::GetFileNameWithoutExtension($PdfFileName)+"-ocr.txt")
            #attach OCR'd PDF as main object
            $Record.SetDocument("$($DocumentsFolder)\$PdfOcrFileName)", $false, $false, "")
            #add WAV as original rendition
            $Record.ChildRenditions.NewRendition("$($DocumentsFolder)\$($OriginalFileName.Split(';')[1])", [HP.HPTRIM.SDK.RenditionType]::Original, "Audio Recording") | Out-Null
            #add PDF as transcription (Other1)
            $Record.ChildRenditions.NewRendition("$($DocumentsFolder)\$PdfFileName", [HP.HPTRIM.SDK.RenditionType]::Other1, "Transcription") | Out-Null
            #add TXT as OCR
            $Record.ChildRenditions.NewRendition($OcrTxt, [HP.HPTRIM.SDK.RenditionType]::Ocr, "Adobe Acrobat") | Out-Null
        } else {
            if ( Test-Path "$($DocumentsFolder)\$($OriginalFileName)" ) {
                #store OCR'd PDF as main object
                $PdfOcrFileName = $([System.IO.Path]::GetFileNameWithoutExtension($OriginalFileName)+"-ocr.pdf")
                $Record.SetDocument("$($DocumentsFolder)\$($PdfOcrFileName)", $false, $false, "")
                #store file as original
                $Record.ChildRenditions.NewRendition("$($DocumentsFolder)\$($OriginalFileName)", [HP.HPTRIM.SDK.RenditionType]::Original, "Official Record") | Out-Null    
                #stick OCR TXT as rendition
                $OcrTxtFileName = $([System.IO.Path]::GetFileNameWithoutExtension($OriginalFileName)+"-ocr.txt")
                $Record.ChildRenditions.NewRendition("$($DocumentsFolder)\$($OcrTxtFileName)", [HP.HPTRIM.SDK.RenditionType]::Ocr, "Adobe Acrobat" )| Out-Null
                $Record.Save()

                if ( ([String]::IsNullOrWhiteSpace($PdfOcrFileName) -eq $false) -and ( Test-Path "$($DocumentsFolder)\$($PdfOcrFileName)" ) ) {
                    if ( Test-Path "$($AttachedFolder)\$([System.IO.Path]::GetFileName($PdfOcrFileName))" ) { Remove-Item "$($AttachedFolder)\$([System.IO.Path]::GetFileName($PdfOcrFileName))" -Force }
                    Move-Item "$($DocumentsFolder)\$($PdfOcrFileName)" "$($AttachedFolder)\$([System.IO.Path]::GetFileName($PdfOcrFileName))" 
                }
                if ( ([String]::IsNullOrWhiteSpace($OriginalFileName) -eq $false) -and ( Test-Path "$($DocumentsFolder)\$($OriginalFileName)" ) ) {
                    if ( Test-Path "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OriginalFileName))" ) { Remove-Item "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OriginalFileName))" -Force }
                    Move-Item "$($DocumentsFolder)\$($OriginalFileName)" "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OriginalFileName))"
                }
                if (  ([String]::IsNullOrWhiteSpace($OcrTxtFileName) -eq $false) -and ( Test-Path "$($DocumentsFolder)\$($OcrTxtFileName)" ) ) {
                    if ( Test-Path "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxtFileName))" ) { Remove-Item "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxtFileName))" -Force }
                    Move-Item "$($DocumentsFolder)\$($OcrTxtFileName)" "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxtFileName))"
                }
                if ( ([String]::IsNullOrWhiteSpace($OcrTxt) -eq $false) -and (Test-Path "$($DocumentsFolder)\$($OcrTxt)") ) {
                    if ( Test-Path "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxt))" ) { Remove-ITem "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxt))" -Force }
                    Move-Item "$($DocumentsFolder)\$($OcrTxt)" "$($AttachedFolder)\$([System.IO.Path]::GetFileName($OcrTxt))"
                }
                Write-Information "Attached documents to record $($meta.'Record Num')"
            } elseif ( (Test-Path "$($AttachedFolder)\$($OriginalFileName)") -eq $false ) {
                Write-Error "Missing file for record $($meta.'Record Num'): $($OriginalFileName)"
            }
        }
    } catch {
        Write-Error $_
    }
    $FileNumber++
}
