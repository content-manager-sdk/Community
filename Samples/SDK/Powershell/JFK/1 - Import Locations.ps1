#Import .Net SDK for Content Manager
Add-Type -Path "C:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
#Instantiate a connection to the default dataset
$Database = New-Object HP.HPTRIM.SDK.Database
$Database.Connect
#Import meta-data file from tab delimited and select unique originators (these will be created as locations)
$metadataFile = "$($PSScriptRoot)\nara_jfk_2017release.tsv"
$owners = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t" | select "Originator" | sort-object -Property "Originator" -Unique
#Create the public level
$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $Database
$level.Name = "Public"
$level.LevelNumber = 10
$level.Abbreviation = "P"
$level.Save()
#Create the classified level
$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $Database
$level.Name = "Classified"
$level.LevelNumber = 20
$level.Abbreviation = "C"
$level.Save()
#Create the secret level
$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $Database
$level.Name = "Secret"
$level.Abbreviation = "S"
$level.LevelNumber = 30
$level.Save()
#Create the top secret level
$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $Database
$level.Name = "Top Secret"
$level.LevelNumber = 40
$level.Abbreviation = "TS"
$level.Save()
#iterate each of the owners and create it as a location with top secret level
foreach ( $owner in $owners ) 
{
    if ( ([String]::IsNullOrWhiteSpace($owner.Originator) -ne $true) ) {
        
        $location = New-Object HP.HPTRIM.SDK.Location -ArgumentList $Database
        $location.TypeOfLocation = [HP.HPTRIM.SDK.LocationType]::Organization
        $location.IsWithin = $true
        $location.SortName = $owner.Originator
        $location.Surname = $owner.Originator
        $location.SecurityString = "Top Secret"
        $location.Save()
        Write-Host "Created $($location.FullFormattedName)"
    }
}