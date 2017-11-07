Clear-Host
Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
$tmpFolder = "$([System.IO.Path]::GetTempPath())\cmramble"
if ( (Test-Path $tmpFolder) -eq $false ) { New-Item -Path $tmpFolder -ItemType Directory }
Write-Progress -Activity "Generating PDF Thumbnails" -Status "Searching for Records" -PercentComplete 0
$records = New-Object HP.HPTRIM.SDK.TrimMainObjectSearch -ArgumentList $db, Record
$records.SearchString  = "extension:pdf"
$x = 0
foreach ( $result in $records ) {
    $x++
    Write-Progress -Activity "Generating PDF Thumbnails" -Status "Record # $($record.Number)" -PercentComplete (($x/$records.Count)*100)
    $record = [HP.HPTRIM.SDK.Record]$result
    $hasThumbnail = $false
    $localFileName = $null
    for ( $i = 0; $i -lt $record.ChildRenditions.Count; $i++ ) {
        $rendition = $record.ChildRenditions.getItem($i)
        if ( $rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Thumbnail ) {
            #$rendition.Delete()
            #$record.Save()
            $hasThumbnail = $true
        } elseif ( $rendition.TypeOfRendition -eq [HP.HPTRIM.SDK.RenditionType]::Original ) {
            $extract = $rendition.GetExtractDocument()
            $extract.FileName = "$($record.Uri).pdf"
            $extract.DoExtract("$($tmpFolder)", $true, $false, $null)
            $localFileName = "$($tmpFolder)\$($record.Uri).pdf"
        }
    }
    #extract the original rendition
    if ( ($hasThumbnail -eq $false) -and ([String]::IsNullOrWhiteSpace($localFileName) -eq $false) -and (Test-Path $localFileName)) {
        #get a storage spot for the image(s)
        $pngRoot = "$($tmpFolder)\$($record.Uri)\"
        if ( (Test-Path $pngRoot) -eq $false ) { New-Item -ItemType Directory -Path $pngRoot | Out-Null }
        #extract the first image
        &pdftopng -f 1 -l 1 -r 300 "$localFileName" "$pngRoot" 2>&1 | Out-Null
        $firstPages = Get-ChildItem -Path $pngRoot -Filter "*.png"
	    foreach ( $firstPage in $firstPages ) {
            $newImageName = "$($tmpFolder)\$([System.IO.Path]::GetFileNameWithoutExtension($localFileName))$($firstPage.Name)"
		    if ( $firstPage.Length -le 102400 ) {
			    #get second page
			    Remove-Item $firstPage.FullName -Force
			    &pdftopng -f 2 -l 2 -r 300 "$fileName" "$pngRoot"
			    $secondPages = Get-ChildItem -Path $pngRoot -Filter "*.png" 
			    foreach ( $secondPage in $secondPages ) 
			    {
				    $record.ChildRenditions.NewRendition($secondPage.FullName, [HP.HPTRIM.SDK.RenditionType]::Thumbnail, "PSImaging PNG") | Out-Null
                    $record.Save() 
                    Remove-Item $secondPage.FullName -Force
			    }
		    } else {
                #use the first page
    		    $record.ChildRenditions.NewRendition($firstPage.FullName, [HP.HPTRIM.SDK.RenditionType]::Thumbnail, "PSImaging PNG") | Out-Null
                $record.Save()
                Remove-Item $firstPage.FullName -Force
            }
        }
        Remove-Item $pngRoot -Recurse -Force
        Write-Host "Generated Thumbnail for $($record.Number)"
    } else {
        Write-Host "Skipped $($record.Number)"
    }
    Remove-Item $localFileName
}
