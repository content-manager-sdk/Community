#Import .Net SDK for Content Manager
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Initialize a progress bar and variables
Write-Progress -Activity "Attaching Documents" -Status "Loading Objects" -PercentComplete 0
$DocumentFolder = "$($PSScriptRoot)\docs"
$ItemNumber = 0
if ( (Test-Path $DocumentFolder) -eq $false ) { New-Item $DocumentFolder -ItemType Directory | Out-Null }
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Fetch the custom property that holds the NARA File name
$NaraFileNameProperty = $Database.FindTrimObjectByName([HP.HPTRIM.SDK.BaseObjectTypes]::FieldDefinition, "NARA File Name")
#Set security protocol to support HTTPS (necessary to download files)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
#Find all non-electronic records
$NonElectronicRecords = New-Object HP.HPTRIM.SDK.TrimMainObjectSearch -ArgumentList $Database, Record
$NonElectronicRecords.SearchString = "not electronic"
Write-Progress -Activity "Attaching Documents" -Status "Processing Records" -PercentComplete 0
foreach ( $result in $NonElectronicRecords ) {
    $ItemNumber++
    $Record = [HP.HPTRIM.SDK.Record]$result
    Write-Progress -Activity "Attaching Documents" -Status "Record $($Record.Number)" -PercentComplete (($ItemNumber/$NonElectronicRecords.Count)*100)
    #Fetch the file name and then check it's not empty
    $NaraFileName = $Record.GetFieldValueAsString($NaraFileNameProperty, [HP.HPTRIM.SDK.StringDisplayType]::Default, $false)
    if ( [String]::IsNullOrWhiteSpace($NaraFileName) -eq $true ) {
        #Don't bother continuing with this record if there's no value in the field
        continue
    }
    #Iterate the files in the file name field
    foreach ( $MetaFileName in $NaraFileName.Split(';') ) 
    {
        #Don't process empty strings
        if ( [String]::IsNullOrWhiteSpace($MetaFileName) ) { Continue }
        
        #Download the document
        $LocalFileName =  "$($DocumentFolder)\$($MetaFileName)"
        Invoke-WebRequest "https://www.archives.gov/files/research/jfk/releases/$(($MetaFileName).ToLower())" -OutFile $LocalFileName

        #All files first get attach as main document and then as the appropriate rendition type
        if ( $Record.IsElectronic -eq $false ) {
            $Record.SetDocument($LocalFileName)
            Write-Host "Attached Record $($meta.'Record Num'): $($MetaFileName)"
        }

        #Most renditions will be the original; but if there's already a rendition and this new one is a PDF then it should become the Other1
        $RenditionType = [HP.HPTRIM.SDK.RenditionType]::Original
        if ( ([System.IO.Path]::GetExtension($file).ToLower() -eq 'pdf') -and ($Record.ChildRenditions.Count -gt 0) ) {
            $RenditionType = [HP.HPTRIM.SDK.RenditionType]::Other1
        }
        $Record.ChildRenditions.NewRendition($LocalFileName, $RenditionType, $RenditionType) | Out-Null
        $Record.Save()
        Write-Host "Attached $($RenditionType) to Record $($meta.'Record Num'): $($MetaFileName)"
        #Clean-up local file
        Remove-Item $LocalFileName -Force
    }
}
#Clean-up the file system
Remove-Item $DocumentFolder -Force