# Google Docs Add-on
This sample explores the possibility of an add-on to Google Docs.



 
## Setup
Using this sample requires you to build a Google Docs add-on, the details of which I will not explore here.  If you are interested in building a Google Docs addon for Content Manager contact me (David Churchland) as I am happy to discuss my experiences building this sample.  A summary of the setup is:
 - set-up a publically available Content Manager server (with Web Client and ServiceAPI installed) 
 - secure your server using HTTPS and ensure it can be accessed using a domain name (not IP address)
 - configre Google authentication on your server
 - create a new [Google Docs addon](https://script.google.com/home) (as per [here](https://developers.google.com/apps-script/add-ons/))
 - paste the files appsscript.json, sidebar.html, existing_record_sidebar.html and code.gs into the corresponding files in the addon project
 - update the URls in both files to match those of your ServiceAPI server

 
 
## Google authentication
To configure Google OAuth first follow the [steps](/blog/2015/6/29/google-authentication) for the OAuth add-on, then:
 1. from your open [App Scripts project](https://script.google.com/home) select 'Resources > Cloud Platform Project'
 2. click the link to open the associated project
 3. fmom the menu choose 'APIs & services > credentials
 4. take note of the Client ID
 5. in the ServiceAPI web.config add the below XML inside the appSettings, inserting your client ID
 
 ```
    <add key="oauth.GoogleOAuthApp.ConsumerKey" value="[Client ID]"/>
    <add key="oauth.GoogleOAuthApp.ClientId" value="[Client ID]"/>
 ```


