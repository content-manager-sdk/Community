$assemblyPath = "c:\trunk\x64\Debug\TRIM.SDK.dll"

Add-Type -Path $assemblyPath

$database = New-Object TRIM.SDK.Database
$database.TrustedUser = "corpdom\churchla"
$database.Id = "N1"
$database.WorkgroupServerName = "local"
$database.Connect()

$searchSearch = New-Object TRIM.SDK.SavedSearch($database, "ACL Test")


foreach ($record in $searchSearch.GetSearch()) {
    $acl = $record.AccessControlList

	if ($acl.GetAccessLocations([TRIM.SDK.RecordAccess]::UpdateMetadata).Count -gt 0)
	{

		$acl.SetCurrentAccessControlSettings([TRIM.SDK.RecordAccess]::AddContents, $acl.GetCurrentAccessControlSettings([TRIM.SDK.RecordAccess]::UpdateMetadata))
		$acl.SetAccessLocations([TRIM.SDK.RecordAccess]::AddContents, $acl.GetAccessLocations([TRIM.SDK.RecordAccess]::UpdateMetadata));

		$record.AccessControlList = $acl
		$record.Save()
	}

}