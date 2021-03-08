# ServiceAPI Client Samples

## Overview
These samples use C# to connec to the Micro Focus Content web service (the ServiceAPI).

## Setup
The following Nuget packages are used in this project:
 * MicroFocus.ContentManager.ServiceModel
 * ServiceStack.HttpClient
 * Microsoft.Identity.Client

## Authentication
These samples use the Microsoft Identity Client to connect via [OpenID connect authentication](https://content-manager-sdk.github.io/Community/10/oidc.html#oidc_azuread) with Content Manager 10. The code could be changed to use either basic or Windows integrated authentication.

## Module in web.config
You tell the Web Client or WebDrawer to use this plugin by wiring it up in hprmServiceAPI.config (hptrim.config).
 ```xml
  <pluginAssemblies>
    <add name="GoogleAuthPlugin"/>
  </pluginAssemblies>
 ```

## appSettings
There are some settings you will need for the OAuth2 provider, they include the Client ID and secret plus some information about your Web Client (Web Drawer instance).  Be careful as they are different for Web Client and WebDrawer.
### Web Client Sample appSettings
```xml
  <appSettings>
    <add key="oauth.login" value="http://localhost/ContentManager/HPRMServiceAPI/auth/GoogleOAuth" />
    <add key="oauth.RedirectUrl" value="http://localhost/ContentManager/" />
    <add key="oauth.CallbackUrl" value="http://localhost/ContentManager/HPRMServiceAPI/auth/{0}" />
    <add key="oauth.GoogleOAuth.ConsumerKey" value="YOUR_KEY" />
    <add key="oauth.GoogleOAuth.ConsumerSecret" value="YOUR_SECRET" />
    <add key="oauth.GoogleOAuth.AuthorizeUrl" value="https://accounts.google.com/o/oauth2/auth?prompt=consent" />
  </appSettings>
```

### WebDrawer Sample appSettings
```xml
  <appSettings>
    <add key="oauth.RedirectUrl" value="http://localhost/WebDrawer/" />
    <add key="oauth.CallbackUrl" value="http://localhost/WebDrawer/auth/{0}" />
    <add key="oauth.GoogleOAuth.ConsumerKey" value="YOUR_KEY" />
    <add key="oauth.GoogleOAuth.ConsumerSecret" value="YOUR_SECRET" />
    <add key="oauth.GoogleOAuth.AuthorizeUrl" value="https://accounts.google.com/o/oauth2/auth?prompt=consent" />
	  </appSettings>
```

## ServiceAPI Features
At the top of hprmServiceAPI.config (hptrim.config) there is an option to set the enabled Features, ensure that PredefinedRoutes is include.
```xml
<hptrim
 ... 
  serviceFeatures="Html,Razor,Json,PredefinedRoutes"
```
