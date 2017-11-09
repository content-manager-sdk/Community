function isNumeric ($x) {
    $x2 = 0
    $isNum = [System.Int32]::TryParse($x, [ref]$x2)
    return $isNum
}

Clear-Host
Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
Write-Progress -Activity "Generating OCR Keywords" -Status "Loading" -PercentComplete 0
#prep a temp spot to store OCR text files
$tmpFolder = "$([System.IO.Path]::GetTempPath())\cmramble"
if ( (Test-Path $tmpFolder) -eq $false ) { New-Item -Path $tmpFolder -ItemType Directory }
#prep word collection and word regex
$regex = [regex]"(\w+)"
$noiseWords = @("the", "to", "and", "subject", "or", "of", "is", "in", "be", "he", "that", "with", "was", "on", "have", "had", "as", "has", "at", "but", "no", "his", "these", "from", "any", "there")
$records = New-Object HP.HPTRIM.SDK.TrimMainObjectSearch $db, Record
$records.SearchString = "electronic not naraOcrd"
$ocrField = $db.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::FieldDefinition, "NARA OCRd")
$x = 0
foreach ( $result in $records ) 
{
    $x++
    $record = [HP.HPTRIM.SDK.Record]$result
    Write-Progress -Activity "Generating OCR Keywords" -Status "$($record.Number)" -PercentComplete (($x/$records.Count)*100)
    Write-Host "Record # $($record.Number)"
    #fetch the record
    if ( ($record -ne $null) -and ($record.GetFieldValue($ocrField).AsBool() -eq $false) ) 
    {
	    for ( $i = 0; $i -lt $record.ChildRenditions.Count; $i++ ) 
	    {
		    $rendition = $record.ChildRenditions.getItem($i)
		    #find original rendition
		    if ( $rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Original ) 
		    {
                $words = [ordered]@{}
			    #extract it
			    $extract = $rendition.GetExtractDocument()
			    $extract.FileName = "$($record.Uri).txt"
			    $extract.DoExtract("$($tmpFolder)", $true, $false, $null)
			    $localFileName = "$($tmpFolder)\$($record.Uri).pdf"
                #get a storage spot for the image(s)
                $pngRoot = "$($tmpFolder)\$($record.Uri)\"
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
					$rendition = $record.ChildRenditions.getItem($i)
					#remove any OCR
					if ( $rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Ocr ) 
					{
						$rendition.Delete()
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
}