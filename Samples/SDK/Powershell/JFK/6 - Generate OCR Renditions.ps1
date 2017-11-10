#Prepare some variables...
$LocalTempFolder = "$([System.IO.Path]::GetTempPath())\cmramble"     #Local Storage spot where the original (or transcript) will be extracted to
$OcrGeneratedProperty = $null     #Custom Property in CM that will be used to track if OCR should be generated
$Database = $null                 #Dataset connection to CM
$CurrentRowNumber = 0             #Current row number in resultset (used for the progress bar)
$OcrGeneratedPropertyName = "Ocr Generated"    #Name of field used to track whether OCR has been generated
$DocumentRecordTypeName = "Document"    #Needed if OCR field needs to be added

#Clear the console and import the CM .Net SDK
Clear-Host
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
if ( (Test-Path $LocalTempFolder) -eq $false ) { New-Item $LocalTempFolder -Item Directory }

#Connect to CM and retrieve the custom property
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect()

#Retrieve/Create boolean property used to track if OCR has already been generated
$OcrGeneratedProperty = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::FieldDefinition, $OcrGeneratedPropertyName)
if ( $OcrGeneratedProperty -eq $null ) {
    $OcrGeneratedProperty = New-Object HP.HPTRIM.SDK.FieldDefinition -ArgumentList $Database
    $OcrGeneratedProperty.Name = $OcrGeneratedPropertyName
    $OcrGeneratedProperty.Format = [HP.HPTRIM.SDK.UserFieldFormats]::Boolean
    $DocumentRecordType = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::RecordType, "Document")
    $OcrGeneratedProperty.Save()
    Write-Host "Created Field '$($OcrGeneratedPropertyName)'"
    if ( $DocumentRecordType -ne $false ) {
        $DocumentRecordType.SetUserFieldUsage($OcrGeneratedProperty, $true)
        $DocumentRecordType.Save()
        Write-Host "Enabled field on '$($DocumentRecordTypeName)' record type"
    }
}

#Search for items to process, using the OCR Generated boolean property
$Records = New-Object HP.HPTRIM.SDK.TrimMainObjectSearch($Database, [HP.HPTRIM.SDK.BaseObjectTypes]::Record)
$Records.SearchString = "not $($OcrGeneratedProperty.SearchClause)"
foreach ( $Result in $Records ) {
    #Update current row number, cast variable so intellisense workds, update progerss bar
    $Record = [HP.HPTRIM.SDK.Record]$Result
    $CurrentRowNumber++
    Write-Progress -Activity "Generating OCR Renditions" -Status "$($Record.Number)      ($($CurrentRowNumber) of $($Records.Count))" -PercentComplete (($CurrentRowNumber/$Records.Count)*100)

    #The original or transcript (Other1) renditions are what we OCR, so need to find that
    $OriginalRendition = $null
    for ( $i = 0; $i -lt $record.ChildRenditions.Count; $i++ ) 
	{
        $Rendition = $record.ChildRenditions.getItem($i)
		#find original rendition
		if ( (($Rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Original) -and ($Rendition.Extension -eq "pdf")) -or ($Rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Other1) ) 
		{
		    $OriginalRendition = $Rendition
        } elseif ( ($Rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Ocr) ) {
            $Rendition.Delete()
        }
    }
    
    #If a valid original rendition was found
    if ( $OriginalRendition -ne $null ) {
        #Extract and OCR the rendition
	    $ExtractDocument = $Rendition.GetExtractDocument()
	    $ExtractDocument.FileName = "$($Record.Uri).txt"
	    $ExtractDocument.DoExtract("$($LocalTempFolder)", $true, $false, $null)
	    $LocalFileName = "$($LocalTempFolder)\$($Record.Uri).pdf"
        #get a storage spot for the image(s)
        $PngRoot = "$($LocalTempFolder)\$($record.Uri)\"
        if ( (Test-Path $PngRoot) -eq $false ) { New-Item -ItemType Directory -Path $PngRoot | Out-Null }
        #extract images
        &pdftopng -r 300 "$LocalFileName" "$PngRoot" 2>&1 | Out-Null
        #generate OCR from each image
        $OcrTxt = "$([System.IO.Path]::GetDirectoryName($PngRoot))\$($Record.Uri).txt"
        if ( Test-Path $OcrTxt ) { Remove-Item $OcrTxt -Force }
        New-Item $OcrTxt -Force | Out-Null
        $Files = Get-ChildItem $PngRoot -Filter "*.png" | ForEach-Object {
            Export-ImageText $_.FullName |  Add-Content $OcrTxt
            Remove-Item $_.FullName -Force | Out-Null
        }

        #Save the rendition if this all worked
        if ( Test-Path $ocrTxt ) {
            $record.ChildRenditions.NewRendition($ocrTxt, [HP.HPTRIM.SDK.RenditionType]::Ocr, "OCR") | Out-Null
            $record.SetFieldValue($OcrGeneratedProperty, (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $true)) 
			$record.Save() | Out-Null                
            Remove-Item $ocrTxt -Force
        }
        Remove-Item $PngRoot -Force
        Remove-Item -Path $LocalFileName
    }
}

