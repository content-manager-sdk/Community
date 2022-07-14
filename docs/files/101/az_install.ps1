$global:creds;
function getExistingApp {

    Write-Information -MessageData "" -InformationAction Continue
    Write-Information -MessageData "================================================================================" -InformationAction Continue
    Write-Information -MessageData "* Either hit enter to list all Azure AD apps in your organisation (potentially *" -InformationAction Continue
    Write-Information -MessageData "* very slow) or enter the name (or the first few characters of the name) to    *" -InformationAction Continue
    Write-Information -MessageData "* filter the list.                                                             *"  -InformationAction Continue
    Write-Information -MessageData "================================================================================" -InformationAction Continue
    
    
    $appFilter = Read-Host -Prompt 'Azure AD App display name filter'
    
    if (!$appFilter) {       
        $allApps = az ad app list --all --only-show-errors | ConvertFrom-Json
    }
    else {
        $allApps = az ad app list --filter "startswith(displayName, '$appFilter')" --only-show-errors | ConvertFrom-Json
    }
   
    $data = @()
    foreach ($item in $allApps) {
      
        $row = "" | Select-Object displayName, appId, objectId
        $row.displayName = $item.displayName
        $row.appId = $item.appId     
        $row.objectId = $item.objectId   
        $data += $row     
    
    }
    $allApps = $data


    $GridArguments = @{
        OutputMode = 'Single'
        Title      = 'Please select an Azure AD Application and click OK'
    }

    Write-Information -MessageData "==================== Selecting Application ====================" -InformationAction Continue

    

    $selectedApp = $allApps | Out-GridView @GridArguments

    if (!$selectedApp) {

        Write-Error -Message "==================== Error: Selecting Application ===================="
        return
    }


    $selectedApp
}

function createNewApp {

    do {

        $appName = Read-Host -Prompt ‘Enter the name for your Azure AD application'
        
    } while (!$appName)
    
    

    Write-Information -MessageData "==================== Get my details ====================" -InformationAction Continue 

    $myDetails = az ad signed-in-user show --only-show-errors | ConvertFrom-Json
    
    if (!$myDetails) {
        "==================== Error: Failed to get my details ===================="
        return
    }

    
    $newGuid = [guid]::NewGuid()

    Write-Information -MessageData "==================== Create the Azure application ====================" -InformationAction Continue 

    $replyUrls = "$webServiceUrl/auth/openid"

    if ($webClientUrl) {
        $replyUrls = $replyUrls + " $webClientUrl/serviceapi/auth/openid"
    }
	if($mobileClientUrl)
	{
		 $replyUrls = $replyUrls + " $webServiceUrl/auth/mobile"
	}

    $MyArray = $($replyUrls -split " ")

    $resourceResponse = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/requiredResourceManifest.json"
    
    $resourceResponse | ConvertTo-Json -depth 100 | Out-File $curDir/resman.json
    
   $appDetails = az ad app create --display-name "$appName" `
        --identifier-uris "api://$myDomain/$newGuid"`
        --required-resource-accesses "$curDir/resman.json"`
        --web-redirect-uris @MyArray --only-show-errors
        
    

    $appObject = $appDetails | ConvertFrom-Json
    
    if (!$appObject) {
        "==================== Error: Failed to create the app ===================="
        return
    }
    

    Write-Information -MessageData "==================== Set me as the App Owner ====================" -InformationAction Continue 
        
    az ad app owner add --id $appObject.appId --owner-object-id $myDetails.id --only-show-errors
    
    
    Write-Information -MessageData "==================== Set the App Id Uri ====================" -InformationAction Continue 
    
    $newAppUri = "api://$myDomain/" + $appObject.appId
    
    az ad app update --id $appObject.appId --identifier-uris $newAppUri --only-show-errors
    
    
    Write-Information -MessageData "==================== Grant consent ====================" -InformationAction Continue 
        
    Start-Sleep -Seconds 40
    
    $tryConsent = ""
    
    do {
        try {
            $tryConsent = ""
            $consent = az ad app permission admin-consent --only-show-errors --id $appObject.appId
    
        }
        catch {
    
            $tryConsent = Read-Host -Prompt "try again? (y/n)"
    
        }
    } while ($tryConsent -eq "y")
    
    if ($tryConsent -eq "n") {
        "==================== Error: Failed to grant consent - please do this manually ===================="
    }
        
    Write-Information -MessageData "==================== Set the client secret ====================" -InformationAction Continue 
        
    $global:creds = az ad app credential reset --id $appObject.appId --append --only-show-errors | ConvertFrom-Json
    
    if (!$global:creds) {
        return
    }
   
   
    
    Write-Information -MessageData "==================== Add the Office and Teams Scopes ====================" -InformationAction Continue    
    
    $newTeamsGuid = [guid]::NewGuid()
    $newOfficeGuid = [guid]::NewGuid()
    
      $scopesObject = "{
    `"api`": {
        `"oauth2PermissionScopes`": [
            {
                `"adminConsentDescription`": `"CM Teams Tab`",
                `"adminConsentDisplayName`": `"CM Teams Tab`",
                `"id`": `"$newTeamsGuid`",
                `"isEnabled`": true,
                `"type`": `"User`",
                `"userConsentDescription`": `"CM Teams Tab`",
                `"userConsentDisplayName`": `"CM Teams Tab`",
                `"value`": `"access_as_teams_user`"
            },
            {
                `"adminConsentDescription`": `"Office Integration`",
                `"adminConsentDisplayName`": `"Office Integration`",
                `"id`": `"$newOfficeGuid`",
                `"isEnabled`": true,
                `"type`": `"User`",
                `"userConsentDescription`": null,
                `"userConsentDisplayName`": null,
                `"value`": `"access_for_office`"
            }
        ]
    }
}" | ConvertFrom-Json

$scopesObject | ConvertTo-Json -depth 100 | Out-File $curDir/new_scopes.json
    
    $officeGuids = @("08e18876-6177-487e-b8b5-cf950c1e598c", "93d53678-613d-4013-afc1-62e9e444a0a5", "ea5a67f6-b6f3-4338-b240-c655ddc3cc8e", "d3590ed6-52b3-4102-aeff-aad2292ab01c", "bc59ab01-8403-45c6-8796-ac3ef710b3e3", "57fb890c-0dab-4253-a5e0-7188c88b2bb4")
    
    $preAuthBody = "{`"api`": {`"preAuthorizedApplications`": []}}" | ConvertFrom-Json
    
    Foreach ($g in $officeGuids) { 
    
        $preAuthBody.api.preAuthorizedApplications += "[{
                    `"appId`": `"$g`",
                    `"permissionIds`": [
                        `"$newOfficeGuid`"
                    ]
                }]" | ConvertFrom-Json
    
    }
    
    
    $teamsGuids = @("1fec8e78-bce4-4aaf-ab1b-5451cc387264", "5e3ce6c0-2b1f-4285-8d4b-75ee78787346")
    
    Foreach ($t in $teamsGuids) { 
    
        $preAuthBody.api.preAuthorizedApplications += "[{
                    `"appId`": `"$t`",
                    `"permissionIds`": [
                        `"$newTeamsGuid`"
                    ]
                }]" | ConvertFrom-Json
    
    }
    
    
    # az ad app update --id $appObject.appId --set oauth2Permissions=@$curDir/new_scopes.json
    # az rest --method patch --url https://graph.microsoft.com/v1.0/applications/$appObject.id --body @$curDir/new_scopes.json

    $gurl = "https://graph.microsoft.com/v1.0/applications/" + $appObject.id

    az rest --method patch --url $gurl --only-show-errors --body @$curDir/new_scopes.json
    

    az rest --method patch --url $gurl --headers 'Content-Type=application/json' --only-show-errors --body "{`"web`": {`"implicitGrantSettings`": {`"enableIdTokenIssuance`": true }}}"
    
    $token_result = az account get-access-token --tenant $tenantId --resource https://graph.microsoft.com | ConvertFrom-Json
    
    
    $preAuthBody = $preAuthBody | ConvertTo-Json -depth 100 -Compress
    
    $headers = New-Object 'System.Collections.Generic.Dictionary[String,String]'
    $headers.Add("Content-Type", "application/json")
    $headers.Add("Authorization", "Bearer " + $token_result.accessToken)
    $headers.Add("Accept", "*/*" )

    Write-Information -MessageData "==================== Create the authorized client applications ====================" -InformationAction Continue   
    
    Start-Sleep -Seconds 20
    
    $tryClient = "n"
    
    $requrl = "https://graph.microsoft.com/beta/applications/" + $appObject.id
    
    
    do {
        try {
            $tryClient = "n"
            $clientSetResponse = Invoke-RestMethod -Uri $requrl -Method PATCH -Body $preAuthBody -Headers $headers 
        }
        catch {
    
            $tryClient = Read-Host -Prompt "The request to add client applications has failed, this can be due to the Azure App not being ready, it is worth trying again, you wish to try again? (y/n)"
        }
    } while ($tryClient -eq "y")
    

    if($mobileClientUrl)
	{
           Write-Information -MessageData "==================== Adding for Mobile client applications ====================" -InformationAction Continue   

           
            $body = "{`"publicClient`":{`"redirectUris`":[`"trimapp://mobile`"]}}" | ConvertTo-Json           
            

           az rest --method PATCH --uri $requrl --headers 'Content-Type=application/json' --body $body  --only-show-errors
	} 
   

    Remove-Item "$curDir/new_scopes.json"
    Remove-Item "$curDir/resman.json"

    $appObject 
}

$version = az version | ConvertFrom-Json
$version = $version.{azure-cli}.Split(".")

if ($version[0] -lt 2 -or $version[1] -lt 37) {
	Write-Information -MessageData "Azure CLI version 2.37.0 or greater must be installed to use this script" -InformationAction Continue  
    return
}



$curDir = Split-Path $script:MyInvocation.MyCommand.Path

$login = az login --allow-no-subscriptions --only-show-errors | ConvertFrom-Json


if (!$login) {
    "==================== Error: Login ===================="
    return
}


if ($login.Length -gt 1) {


    $GridArguments = @{
        OutputMode = 'Single'
        Title      = 'Please select an Azure AD Tenant and click OK'
    }

    "==================== Selecting Tenant ===================="

    $tenant = $login | Out-GridView @GridArguments

    if (!$tenant) {
        "==================== Error: Selecting Tenant ===================="
        return
    } 
}
else {
    $tenant = $login[0]
}

$tenantId = $tenant.tenantid

$subDetails = az account set --subscription $tenantId


do {

    $myDomain = Read-Host -Prompt ‘Enter the domain name for your web server (e.g. intranet.acme.com)'

    if ($myDomain.StartsWith("http://")) {
        $myDomain = "";
        "The domain must support HTTPS not only HTTP"
    }

    if ($myDomain.StartsWith("https://")) {
        $myDomain = $myDomain.Substring(8)
    }
    
} while (!$myDomain)

$defaultWebServiceUrl = "https://$mydomain/cmserviceapi"
$webServiceUrl = Read-Host -Prompt "Enter the ServiceAPI URL [$defaultWebServiceUrl]"

if (!$webServiceUrl) {
    $webServiceUrl = $defaultWebServiceUrl
}


$webClientUrl = ""
$includeWebClient = Read-Host -Prompt "Do you want to link to the Content Manager Web Client from Teams and Office? (y/n)"

if ($includeWebClient -eq "y") {
    $defaultWebClientUrl = "https://$mydomain/contentmanager"
    $webClientUrl = Read-Host -Prompt "Enter the Web Client URL [$defaultWebClientUrl]"

    if (!$webClientUrl) {
        $webClientUrl = $defaultWebClientUrl
    }
}

$mobileClientUrl = ""

do {

    $createAppAction = Read-Host -Prompt ‘Either create a new Azure App or use an existing one, do you wish to create a new Azure App (y/n)'
    
} while (!$createAppAction)


if ($createAppAction -eq "y" -or $createAppAction -eq "Y") {

    $includeMobileClient = Read-Host -Prompt "Do you want to include support for the Content Manager Mobile Client? (y/n)"
    
    if ($includeMobileClient -eq "y") {   
        $mobileClientUrl = "trimapp://mobile";
    }

    $newAppDetails = createNewApp
}
else {
    $newAppDetails = getExistingApp
}

$newAppDetails = az ad app show --id $newAppDetails.id --only-show-errors | ConvertFrom-Json

$newAppUri = $newAppDetails.identifierUris[0]

$OutlookManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/outlook-addin-manifest-template.xml"

[IO.File]::WriteAllLines("$curDir/outlook-addin-manifest.xml", $OutlookManifest.Replace("[MANIFESTGUID]", [guid]::NewGuid()).Replace("[APPCLIENTID]", $newAppDetails.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl))


$officeDomain = "https://$myDomain"
$officeManifestGuid = [guid]::NewGuid()


$OfficeManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/office-addin-manifest-template.xml"
[xml]$officeManifestXML=$OfficeManifest.OuterXml.Replace("[MANIFESTGUID]", $officeManifestGuid).Replace("[APPCLIENTID]", $newAppDetails.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl).Replace("[DOMAIN]", $officeDomain)
$officeManifestXML.Save("$curDir/office-addin-manifest.xml")

$webClientAttr = ""

if ($webClientUrl) {
    $webClientAttr = "`r`n            `"websiteUrl`": `"$webClientUrl`","
}

$TeamsManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/teams-addin-manifest-template.json"
$TeamsManifest.Replace("[WEBSITEURLATTR]", $webClientAttr).Replace("[MANIFESTGUID]", [guid]::NewGuid()).Replace("[APPCLIENTID]", $newAppDetails.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl).Replace("[DOMAIN]", $myDomain) > "$curDir/manifest.json"



Invoke-WebRequest https://raw.githubusercontent.com/content-manager-sdk/Community/aba15c6fe5d3b34af219aba0dd635704fe18f9a6/docs/files/101/color.png -OutFile "$curDir/color.png"
Invoke-WebRequest https://raw.githubusercontent.com/content-manager-sdk/Community/aba15c6fe5d3b34af219aba0dd635704fe18f9a6/docs/files/101/outline.png -OutFile "$curDir/outline.png"


$teamsZip = "$curDir/content-manager-teams.zip"

Compress-Archive -Force -LiteralPath "$curDir/manifest.json" -DestinationPath $teamsZip
Compress-Archive -Update -LiteralPath "$curDir/color.png" -DestinationPath $teamsZip
Compress-Archive -Update -LiteralPath "$curDir/outline.png" -DestinationPath $teamsZip

$appId = $newAppDetails.appId
$secret = $global:creds.password

 

$xmlManifest = [xml]$OfficeManifest
$version = $xmlManifest.OfficeApp.Version


# "==================== Write the sample authentication settings for Web Service ===================="

$authFile = "$curDir\authentication.xml"

Set-Content $authFile "<!-- Web Service Authentication settings-->"

Add-Content $authFile "<authentication corsAllowedOrigins=`"https://$myDomain`" allowAnonymous=`"false`" slidingSessionMinutes=`"30`" redirectURI=`"`">"
Add-Content $authFile "`t<openIdConnect>"
Add-Content $authFile "`t`t<add"
Add-Content $authFile "`t`t`tname=`"openid`""
Add-Content $authFile "`t`t`tclientID=`"$appId`""
Add-Content $authFile "`t`t`tclientSecret=`"$secret`""
Add-Content $authFile "`t`t`tissuerURI=`"https://login.microsoftonline.com/$tenantId/v2.0/.well-known/openid-configuration`""
Add-Content $authFile "`t`t`tappIdURI=`"$newAppUri`" />"
Add-Content $authFile "`t</openIdConnect>"
Add-Content $authFile "</authentication>"

Add-Content $authFile ""
Add-Content $authFile ""

Add-Content $authFile "<!-- ServiceAPI Office Addin Settings -->"

Add-Content $authFile "<officeIntegration guid=`"$officeManifestGuid`" version=`"$version`"/>"

Add-Content $authFile ""
Add-Content $authFile ""

if($mobileClientUrl)
{

        # "==================== Write the sample authentication settings for Mobile Client ===================="

        Add-Content $authFile "<!-- Mobile Client Authentication settings-->"

        Add-Content $authFile "<authentication corsAllowedOrigins=`"https://$myDomain`" allowAnonymous=`"false`" slidingSessionMinutes=`"30`" redirectURI=`"`">"
        Add-Content $authFile "`t<openIdConnect>"
        Add-Content $authFile "`t`t<add"
        Add-Content $authFile "`t`t`tname=`"mobile`""
        Add-Content $authFile "`t`t`tclientID=`"$appId`""
        Add-Content $authFile "`t`t`tclientSecret=`"$secret`""
        Add-Content $authFile "`t`t`tissuerURI=`"https://login.microsoftonline.com/$tenantId/v2.0/.well-known/openid-configuration`""
        Add-Content $authFile "`t`t`tredirectUri=`"trimapp://mobile`" />"
        Add-Content $authFile "`t</openIdConnect>"
        Add-Content $authFile "</authentication>"

        Add-Content $authFile ""
        Add-Content $authFile ""
}

# "==================== Write the sample authentication settings for Web Client ===================="

Add-Content $authFile "<!-- Web Client Authentication settings -->"

Add-Content $authFile "<authentication corsAllowedOrigins=`"https://$myDomain`" allowAnonymous=`"false`" slidingSessionMinutes=`"30`" redirectURI=`"`">"
Add-Content $authFile "`t<openIdConnect>"
Add-Content $authFile "`t`t<add"
Add-Content $authFile "`t`t`tname=`"openid`""
Add-Content $authFile "`t`t`tclientID=`"$appId`""
Add-Content $authFile "`t`t`tclientSecret=`"$secret`""
Add-Content $authFile "`t`t`tissuerURI=`"https://login.microsoftonline.com/$tenantId/v2.0/.well-known/openid-configuration`""
Add-Content $authFile "`t`t`tappIdURI=`"$newAppUri`" />"
Add-Content $authFile "`t</openIdConnect>"
Add-Content $authFile "</authentication>"

Add-Content $authFile ""
Add-Content $authFile ""

Add-Content "$curDir\authentication.xml" "<!-- Web Client Office Addin Settings -->"



Add-Content "$curDir\authentication.xml" "<officeIntegration guid=`"$officeManifestGuid`" version=`"$version`"/>"

"==================== Authentication details for ServiceAPI and Web Client written to $authFile ===================="
"==================== Teams manifest written to $teamsZip ===================="
"==================== Outlook manifest written to $curDir/outlook-addin-manifest.xml ===================="
"==================== Office manifest written to $curDir/office.xml ===================="




Remove-Item "$curDir/manifest.json"
Remove-Item "$curDir/color.png"
Remove-Item "$curDir/outline.png"