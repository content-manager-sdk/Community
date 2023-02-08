#Install MSAL.PS module for all users (requires admin rights)
#Install-Module MSAL.PS -Scope CurrentUser -Force

#AppId is the Application ID URI from the consumer Azure App (e.g. api://3b30db06-a603-4924-904a-e491a709b6fd)
$AppId = 'api://xxx-xxx-xxx-xxx-xxx'
# Tentant Id is the tentant id from Azure AD
$TenantId = 'xxx-xxx-xxx-xxx-xxx'
#Client secret comes from your consumer Azure App
$ClientSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
# the scope id is the Application ID URI from the server Azure App with .default appended
$scopeId = 'api://MyDev.dev/xxx-xxx-xxx-xxx-xxxx-xxx/.default'

Import-Module MSAL.PS
$MsalToken = Get-MsalToken -TenantId $TenantId -ClientId $AppId -ClientSecret ($ClientSecret | ConvertTo-SecureString -AsPlainText -Force) -Scopes $scopeId

echo "Access Token found" $MsalToken.AccessToken

#Create Query for Content Manager Service API 
$url = "https://mydev.dev/serviceapi/Record/9000000001?properties=RecordTitle,RecordNumber&format=json"

## Set up bearer token
$headers = @{Authorization = "Bearer $($MsalToken.AccessToken)"} 

(Invoke-RestMethod -Uri $Url -ContentType "application/json"  -Method Get -Headers $headers -UseBasicParsing ).Results | Foreach-Object {
    [pscustomobject] @{
        Uri = $_.Uri
        TrimType = $_.TrimType
        Number = $_.RecordNumber
        Title = $_.RecordTitle.Value
       
    }
}