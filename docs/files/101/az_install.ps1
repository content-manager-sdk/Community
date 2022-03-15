$curDir = Split-Path $script:MyInvocation.MyCommand.Path

$login = az login --allow-no-subscriptions --only-show-errors | ConvertFrom-Json


if (!$login) {
"==================== Error: Login ===================="
    return
}


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




do {

        $myDomain = Read-Host -Prompt ‘Enter the domain name for your web server (e.g. intranet.acme.com)'

        if ($myDomain.StartsWith("http://")) {
            $myDomain = "";
            "The domain must support HTTPS not only HTTP"
        }

        if ($myDomain.StartsWith("https://")) {
            $myDomain = $myDomain.Substring(8)
        }
    
} while(!$myDomain)

$defaultWebServiceUrl = "https://$mydomain/cmserviceapi"
$webServiceUrl = Read-Host -Prompt "Enter the ServiceAPI URL [$defaultWebServiceUrl]"

if (!$webServiceUrl) {
    $webServiceUrl = $defaultWebServiceUrl
}

$defaultWebClientUrl = "https://$mydomain/contentmanager"
$webClientUrl = Read-Host -Prompt "Enter the Web Client URL [$defaultWebClientUrl]"

if (!$webClientUrl) {
    $webClientUrl = $defaultWebClientUrl
}

$tenantId = $tenant.id


$createApp = ""

do {

    $appName = Read-Host -Prompt ‘Enter the name for your Azure AD application'
    
} while(!$appName)


$newGuid = [guid]::NewGuid()

"==================== Get my details ===================="

$myDetails = az ad signed-in-user show --only-show-errors | ConvertFrom-Json


if (!$myDetails) {
"==================== Error: Failed to get my details ===================="
    return
}


$subDetails = az account set --subscription --only-show-errors $tenantId


"==================== Create the Azure application ===================="

$resourceResponse = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/requiredResourceManifest.json"

$resourceResponse | ConvertTo-Json -depth 100 | Out-File $curDir/resman.json

$appDetails = az ad app create --oauth2-allow-implicit-flow true --display-name "$appName" `
            --identifier-uris "api://$myDomain/$newGuid"  `
            --reply-urls "$webServiceUrl/auth/openid".ToLower() "$webClientUrl/serviceapi/auth/openid".ToLower()`
            --required-resource-accesses "$curDir/resman.json" --only-show-errors


$appObject = $appDetails | ConvertFrom-Json

if (!$appObject) {
"==================== Error: Failed to create the app ===================="
    return
}


"==================== Set me as the App Owner ===================="

az ad app owner add --id $appObject.appId  --owner-object-id $myDetails.objectId --only-show-errors

"==================== Set the App Id Uri ===================="

$newAppUri = "api://$myDomain/" + $appObject.appId

az ad app update --id $appObject.appId --identifier-uris $newAppUri --only-show-errors



"==================== Grant consent ===================="

Start-Sleep -Seconds 40

$tryConsent = ""

do {
    try {
        $tryConsent = ""
        $consent = az ad app permission admin-consent --only-show-errors --id $appObject.appId

    } catch {

        $tryConsent = Read-Host -Prompt "try again? (y/n)"

    }
} while($tryConsent -eq "y")

if ($tryConsent -eq "n") {
"==================== Error: Failed to grant consent - please do this manually ===================="
}



"==================== Set the client secret ===================="

$creds = az ad app credential reset --id $appObject.appId --append --only-show-errors | ConvertFrom-Json

if (!$creds) {
    return
}

"==================== Fetch the existing scopes ===================="

az ad app show --id $appObject.appId --query="oauth2Permissions" > $curDir/scopes.json 


$scopesObject = Get-Content -Raw -Path $curDir/scopes.json | ConvertFrom-Json

$scopesObject[0].isEnabled = $FALSE

"==================== Add the Office and Teams Scopes ===================="

$newTeamsGuid = [guid]::NewGuid()
$newOfficeGuid = [guid]::NewGuid()

$scopesObject +=  "[{
			`"adminConsentDescription`": `"CM Teams Tab`",
			`"adminConsentDisplayName`": `"CM Teams Tab`",
			`"id`": `"$newTeamsGuid`",
			`"isEnabled`": true,
			`"lang`": null,
			`"origin`": `"Application`",
			`"type`": `"User`",
			`"userConsentDescription`": `"CM Teams Tab`",
			`"userConsentDisplayName`": `"CM Teams Tab`",
			`"value`": `"access_as_teams_user`"
		}]" | ConvertFrom-Json



$scopesObject +=  "[{
			`"adminConsentDescription`": `"Office Integration`",
			`"adminConsentDisplayName`": `"Office Integration`",
			`"id`": `"$newOfficeGuid`",
			`"isEnabled`": true,
			`"lang`": null,
			`"origin`": `"Application`",
			`"type`": `"User`",
			`"userConsentDescription`": null,
			`"userConsentDisplayName`": null,
			`"value`": `"access_for_office`"
		}]" | ConvertFrom-Json


$scopesObject | ConvertTo-Json -depth 100 | Out-File $curDir/new_scopes.json

$officeGuids = @("08e18876-6177-487e-b8b5-cf950c1e598c", "93d53678-613d-4013-afc1-62e9e444a0a5", "ea5a67f6-b6f3-4338-b240-c655ddc3cc8e", "d3590ed6-52b3-4102-aeff-aad2292ab01c", "bc59ab01-8403-45c6-8796-ac3ef710b3e3", "57fb890c-0dab-4253-a5e0-7188c88b2bb4")

$preAuthBody = "{`"api`": {`"preAuthorizedApplications`": []}}"| ConvertFrom-Json

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


az ad app update --id $appObject.appId --set oauth2Permissions=@$curDir/new_scopes.json --only-show-errors


$token_result = az account get-access-token --tenant $tenantId --resource https://graph.microsoft.com | ConvertFrom-Json


$preAuthBody = $preAuthBody | ConvertTo-Json -depth 100 -Compress

$headers = New-Object 'System.Collections.Generic.Dictionary[String,String]'
$headers.Add("Content-Type","application/json")
$headers.Add("Authorization","Bearer " + $token_result.accessToken)
$headers.Add("Accept","*/*" )
# $headers.Add("Content-Length",$preAuthBody.Length )

"==================== Create the authorized client applications ===================="
Start-Sleep -Seconds 20

$tryClient = "n"

$requrl= "https://graph.microsoft.com/beta/applications/" + $appObject.objectId


do {
    try {
        $tryClient = "n"
        $clientSetResponse = Invoke-RestMethod -Uri $requrl -Method PATCH -Body $preAuthBody -Headers $headers 
    } catch {

        $tryClient = Read-Host -Prompt "The request to add client applications has failed, this can be due to the Azure App not being ready, it is worth trying again, you wish to try again? (y/n)"
    }
} while($tryClient -eq "y")






$OutlookManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/outlook-addin-manifest-template.xml"

$OutlookManifest.Replace("[MANIFESTGUID]", [guid]::NewGuid()).Replace("[APPCLIENTID]", $appObject.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl) > "$curDir/outlook-addin-manifest.xml"


$officeDomain = "https://$myDomain"
$officeManifestGuid = [guid]::NewGuid()


$OfficeManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/office-addin-manifest-template.xml"
$OfficeManifest.OuterXml.Replace("[MANIFESTGUID]", $officeManifestGuid).Replace("[APPCLIENTID]", $appObject.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl).Replace("[DOMAIN]", $officeDomain) > "$curDir/office-addin-manifest.xml"


$TeamsManifest = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/content-manager-sdk/Community/master/docs/files/101/teams-addin-manifest-template.json" | ConvertTo-Json -depth 100
$TeamsManifest.Replace("[MANIFESTGUID]", [guid]::NewGuid()).Replace("[APPCLIENTID]", $appObject.appId).Replace("[APPIDURI]", $newAppUri).Replace("[SERVICEAPIURL]", $webServiceUrl) > "$curDir/manifest.json"



Invoke-WebRequest https://raw.githubusercontent.com/content-manager-sdk/Community/aba15c6fe5d3b34af219aba0dd635704fe18f9a6/docs/files/101/color.png -OutFile "$curDir/color.png"
Invoke-WebRequest https://raw.githubusercontent.com/content-manager-sdk/Community/aba15c6fe5d3b34af219aba0dd635704fe18f9a6/docs/files/101/outline.png -OutFile "$curDir/outline.png"


Compress-Archive -Force -LiteralPath "$curDir/manifest.json" -DestinationPath "$curDir/content-manager-teams.zip"
Compress-Archive -Update -LiteralPath "$curDir/color.png" -DestinationPath "$curDir/content-manager-teams.zip"
Compress-Archive -Update -LiteralPath "$curDir/outline.png" -DestinationPath "$curDir/content-manager-teams.zip"

$appId = $appObject.appId
$secret = $creds.password

$xmlManifest = [xml]$OfficeManifest
$version = $xmlManifest.OfficeApp.Version


"==================== Write the sample authentication settings for Web Service ===================="

Set-Content "$curDir\authenication.xml" "<!-- Web Service Authentication settings-->"

Add-Content "$curDir\authenication.xml" "<authentication corsAllowedOrigins=`"https://$myDomain`" allowAnonymous=`"false`" slidingSessionMinutes=`"30`" redirectURI=`"`">"
Add-Content "$curDir\authenication.xml" "`t<openIdConnect>"
Add-Content "$curDir\authenication.xml" "`t`t<add"
Add-Content "$curDir\authenication.xml" "`t`t`tname=`"openid`""
Add-Content "$curDir\authenication.xml" "`t`t`tclientID=`"$appId`""
Add-Content "$curDir\authenication.xml" "`t`t`tclientSecret=`"$secret`""
Add-Content "$curDir\authenication.xml" "`t`t`tissuerURI=`"https://login.microsoftonline.com/$tenantId/v2.0/.well-known/openid-configuration`""
Add-Content "$curDir\authenication.xml" "`t`t`tappIdURI=`"$newAppUri`" />"
Add-Content "$curDir\authenication.xml" "`t</openIdConnect>"
Add-Content "$curDir\authenication.xml" "</authentication>"

Add-Content "$curDir\authenication.xml" ""
Add-Content "$curDir\authenication.xml" ""

Add-Content "$curDir\authenication.xml" "<!-- ServiceAPI Office Addin Settings -->"

Add-Content "$curDir\authenication.xml" ""
Add-Content "$curDir\authenication.xml" ""
Add-Content "$curDir\authenication.xml" "<officeIntegration guid=`"$officeManifestGuid`" version=`"$version`"/>"

"==================== Write the sample authentication settings for Web Client ===================="

Add-Content "$curDir\authenication.xml" "<!-- Web Client Authentication settings -->"

Add-Content "$curDir\authenication.xml" "<authentication corsAllowedOrigins=`"https://$myDomain`" allowAnonymous=`"false`" slidingSessionMinutes=`"30`" redirectURI=`"`">"
Add-Content "$curDir\authenication.xml" "`t<openIdConnect>"
Add-Content "$curDir\authenication.xml" "`t`t<add"
Add-Content "$curDir\authenication.xml" "`t`t`tname=`"openid`""
Add-Content "$curDir\authenication.xml" "`t`t`tclientID=`"$appId`""
Add-Content "$curDir\authenication.xml" "`t`t`tclientSecret=`"$secret`""
Add-Content "$curDir\authenication.xml" "`t`t`tissuerURI=`"https://login.microsoftonline.com/$tenantId/v2.0/.well-known/openid-configuration`""
Add-Content "$curDir\authenication.xml" "`t`t`tappIdURI=`"$newAppUri`" />"
Add-Content "$curDir\authenication.xml" "`t</openIdConnect>"
Add-Content "$curDir\authenication.xml" "</authentication>"

Add-Content "$curDir\authenication.xml" ""
Add-Content "$curDir\authenication.xml" ""

Add-Content "$curDir\authenication.xml" "<!-- Web Client Office Addin Settings -->"



Add-Content "$curDir\authenication.xml" "<officeIntegration guid=`"$officeManifestGuid`" version=`"$version`"/>"


Remove-Item "$curDir/scopes.json"
Remove-Item "$curDir/new_scopes.json"
Remove-Item "$curDir/resman.json"
Remove-Item "$curDir/manifest.json"
Remove-Item "$curDir/color.png"
Remove-Item "$curDir/outline.png"