# Google Authentication ServiceAPI Plugin
The ServiceAPI is built on the [ServiceStack framework](https://servicestack.net/) which allows for pluggable authentication modules and [provides implementations](http://docs.servicestack.net/authentication-and-authorization) of a number of popular authentication profviders such as Google, and Facebook.  It is also possible to extend the ServiceStack CredentialsAuthProvider to write your own.
This sample demonstrates how you might configure the Web Client (and WebDrawer) to use Google authentication.

## Building this project
To build this project copy the following two files from your Content Manager folder to the lib folder (in this folders parent):
 * HP.HPTRIM.ServiceAPI.Common.dll
 * HP.HPTRIM.ServiceAPI.Model.dll

## Google credentials
To get started go to the [Google developer console](https://console.developers.google.com/apis/credentials), create a project and also an OAuth2 client Id.  You will need the Client ID and Client Secret later.

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
