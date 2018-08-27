# Component Space SAML SSO Plugin
This sample is an authentication plugin for the Web Client and WebDrawer.

## Warning 
This plugin relies on the [Component Space library](https://www.componentspace.com/).  You can download a free trial version of Component Space but to use it permanenty you will need to purchase a license.

## Versions
This sample has been tested on 9.1 but should work in versions from 8.3.

## Questions
Post any questions regarding this sample in the [SDK support forum](https://community.hpe.com/t5/SDK-API-Support/bd-p/sws-RM_SDKAPI).

## Steps to install
### Build project and Copy files
To build the project:
  * copy the files ComponentSpace.SAML2.dll, HP.HPTRIM.ServiceAPI.Common.dll, and HP.HPTRIM.ServiceAPI.Model.dll to the lib folder
  * build the project
  * copy the files ComponentSpace.SAML2.dll, saml.config, and ComponentSpaceSAMLPlugin to your Web Client bin folder

### Configure plugin
Edit the file hprmServiceAPI.config and add the folliwng (as a child of the root element):
```
  <pluginAssemblies>
    <add name="ComponentSpaceSAMLPlugin"/>
  </pluginAssemblies>
 ```

 ### Edit SAML config
 Edit the file saml.config (which was copied to the Web Client bind folder previously) so that:
   * ServiceProvider\Name == the name of the application in your IdP
   * PartnerIdentityProvider\Name is the URL for your IdP
   * SingleSignOnServiceUrl and SingleLogoutServiceUrl are correct for your IdP
   * PartnerCertificateFile is matched with a certificate sourced from your IdP

### Allow anonymous access in the IIS
IIS will not be handling authentication so we use IIS Manager to allow anonymous access only.
![image 1](images/iis_anon.PNG)

### Further help
For further assistance, including a run through of configuration in Azure AD, see this post.