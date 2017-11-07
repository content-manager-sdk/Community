Add-Type -Path "D:\Program Files\Hewlett Packard Enterprise\Content Manager\HP.HPTRIM.SDK.dll"
$db = New-Object HP.HPTRIM.SDK.Database
$db.Connect
$metadataFile = "F:\Dropbox\CMRamble\JFK\nara_jfk_2017release.tsv"
$owners = Get-Content -Path $metadataFile | ConvertFrom-Csv -Delimiter "`t" | select "Originator" | sort-object -Property "Originator" -Unique

$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $db
$level.Name = "Public"
$level.LevelNumber = 10
$level.Abbreviation = "P"
$level.Save()

$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $db
$level.Name = "Classified"
$level.LevelNumber = 20
$level.Abbreviation = "C"
$level.Save()

$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $db
$level.Name = "Secret"
$level.Abbreviation = "S"
$level.LevelNumber = 30
$level.Save()

$level = New-Object HP.HPTRIM.SDK.SecurityLevel -ArgumentList $db
$level.Name = "Top Secret"
$level.LevelNumber = 40
$level.Abbreviation = "TS"
$level.Save()


foreach ( $owner in $owners ) 
{
    if ( [String]::IsNullOrWhiteSpace($owner.Originator) -ne $true ) {
        $location = New-Object HP.HPTRIM.SDK.Location -ArgumentList $db
        $location.TypeOfLocation = [HP.HPTRIM.SDK.LocationType]::Organization
        $location.IsWithin = $true
        $location.SortName = $owner.Originator
        $location.Surname = $owner.Originator
        $location.SecurityString = "Top Secret"
        $location.Save()
        Write-Host "Created $($location.FullFormattedName)"
    }
}