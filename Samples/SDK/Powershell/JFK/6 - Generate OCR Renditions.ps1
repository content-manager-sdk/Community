#Prepare some variables...
$LocalTempFolder = "$([System.IO.Path]::GetTempPath())\cmramble"     #Local Storage spot where the original (or transcript) will be extracted to
$OcrGeneratedProperty = $null     #Custom Property in CM that will be used to track if OCR should be generated
$Database = $null                 #Dataset connection to CM
$CurrentRowNumber = 0             #Current row number in resultset (used for the progress bar)

#Clear the console and import the CM .Net SDK
Clear-Host
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"

#Connect to CM and retrieve the custom property
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect()
$OcrGeneratedProperty = $Database.FindTrimObjectByName(Record, "Ocr Generated")

#Search for items to process
$Records = New-Object HP.HPTRIM.SDK.TrimMainObjectSearch($Database, [HP.HPTRIM.SDK.BaseObjectTypes]::Record)
foreach ( $Result in $Records ) {
    $Record = [HP.HPTRIM.SDK.Record]$Result
    $CurrentRowNumber++
    Write-Progress -Activity "Generating OCR Renditions" -Status "$($Record.Number)" -PercentComplete (($CurrentRowNumber/$Records.Count)*100)
	for ( $i = 0; $i -lt $record.ChildRenditions.Count; $i++ ) 
	{
		$Rendition = $record.ChildRenditions.getItem($i)
		#find original rendition
		if ( $Rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Original ) 
		{
			#extract it
			$extract = $Rendition.GetExtractDocument()
			$extract.FileName = "$($record.Uri).txt"
			$extract.DoExtract("$($LocalTempFolder)", $true, $false, $null)
			$localFileName = "$($LocalTempFolder)\$($record.Uri).pdf"
            #get a storage spot for the image(s)
            $pngRoot = "$($LocalTempFolder)\$($record.Uri)\"
            if ( (Test-Path $pngRoot) -eq $false ) { New-Item -ItemType Directory -Path $pngRoot | Out-Null }
            #extract images
            &pdftopng -r 300 "$localFileName" "$pngRoot" 2>&1 | Out-Null
            #generate OCR from each image
            $ocrTxt = "$([System.IO.Path]::GetDirectoryName($pngRoot))\$($record.Uri).txt"
            if ( Test-Path $ocrTxt ) { Remove-Item $ocrTxt -Force }
            New-Item $ocrTxt -Force | Out-Null
            $y = 0
            $files = Get-ChildItem $pngRoot -Filter "*.png" | ForEach-Object {
                Export-ImageText $_.FullName |  Add-Content $ocrTxt
                Remove-Item $_.FullName -Force | Out-Null
            }
            Get-Content $ocrTxt | Where-Object {$_ -match $regex} | ForEach-Object {
				$matches = $regex.Matches($_)
				foreach ( $match in $matches ) 
				{
                    if ( ($match -ne $null) -and ($match.Value -ne $null) -and ($match.Value.Length -gt 2) ) 
                    {
                        $matchedWord = $match.Value.ToLower().Replace("_","")
                        if ( $noiseWords.Contains($matchedWord.ToLower()) -eq $false)  {
					        if ( $words.Contains($matchedWord) ) 
					        {
						        $words[$matchedWord]++
					        } else {
						        $words.Add($matchedWord, 1)
					        }
                        }
                    }
				}
			}
			#reorder words
			$words = $words.GetEnumerator() | Sort-Object Value -Descending
            Remove-Item $ocrTxt -Force
            $Words | ConvertTo-Csv -Delimiter ' ' | Out-File $ocrTxt -Force
			$wordText = ''
			#generate string of just the words (no counts)
			$words | ForEach-Object { $wordText += ($_.Name + '  ') }
			#stuff into CM
            if ( $wordText.Length > 65536 ) {
                $wordText = $wordText.Substring(0, 65535)
            }
			$record.SetFieldValue($db.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::FieldDefinition, "NARA OCR Keywords"), (New-Object HP.HPTRIM.SDK.UserFieldValue($wordText)))
			#replace OCR txt
			for ( $i = 0; $i -lt $record.ChildRenditions.Count; $i++ ) 
			{
				$Rendition = $record.ChildRenditions.getItem($i)
				#remove any OCR
				if ( $Rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Ocr ) 
				{
					$Rendition.Delete()
				}
			}
            if ( Test-Path $ocrTxt ) {
                $record.ChildRenditions.NewRendition($ocrTxt, [HP.HPTRIM.SDK.RenditionType]::Ocr, "OCR") | Out-Null
                $record.SetFieldValue($ocrField, (New-Object HP.HPTRIM.SDK.UserFieldValue -ArgumentList $true)) 
				$record.Save() | Out-Null                
                Remove-Item $ocrTxt -Force
            }
				
            Remove-Item $pngRoot -Force
            Remove-Item -Path $localFileName
		}
	}
}

