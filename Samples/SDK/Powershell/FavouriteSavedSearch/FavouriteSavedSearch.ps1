$assemblyPath = "C:\trunk\x64\Debug\TRIM.SDK.dll"
Add-Type -Path $assemblyPath

$database = New-Object TRIM.SDK.Database
$database.Id = "P1"
$database.WorkgroupServerName = "local"
$database.Connect()


$savedSearch = $database.FindTrimObjectByUri([TRIM.SDK.BaseObjectTypes]::SavedSearch, 9000000008)
$savedSearch.AddToFavorites()
$savedSearch.save()

$startupOptions = New-Object TRIM.SDK.StartupUserOptions($database);
$startupOptions.ActivityDue = $false;
$startupOptions.CheckinStyles = $false;
$startupOptions.ClassificationBrowser = $false;
$startupOptions.ClientMatterHierarchy = $false;
$startupOptions.Dashboard = $false;
$startupOptions.Dashboard = $false;
$startupOptions.DueTray = $false;
$startupOptions.Explorer = $false;
$startupOptions.FavoriteClassifications = $false;
$startupOptions.FavoriteLocations = $false;
$startupOptions.FavoriteRecords = $false;
$startupOptions.FavoriteWorkflows = $false;
$startupOptions.Find = $false;
$startupOptions.InDueTray = $false;
$startupOptions.InTray = $false;
$startupOptions.NewItem = $false;
$startupOptions.OfflineRecords = $false;
$startupOptions.RecentContainers = $false;
$startupOptions.Requests = $false;
$startupOptions.TodoItems = $false;
$startupOptions.UserLabels = $false;
$startupOptions.WorkTray = $false;


$startupOptions.FavoriteSearches = $true;
$startupOptions.Save();


$database.Dispose()
