using ComponentSpace.SAML2;
using ComponentSpace.SAML2.Assertions;
using ComponentSpace.SAML2.Bindings;
using ComponentSpace.SAML2.Profiles.SSOBrowser;
using ComponentSpace.SAML2.Protocols;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Xml;

namespace ComponentSpaceSAMLPlugin
{
    [Route("/tlogin", "GET")]

    public class Login : IReturnVoid
    {

    }

    public class LoginResponse
    {

    }




    [DefaultView("LoginResponse")]
    [Authenticate(ApplyTo.None)]
    public class LoginService : ServiceStack.Service
    {

        private XmlElement CreateAuthnRequest()
        {
            // Create the authentication request.
            AuthnRequest authnRequest = new AuthnRequest();
            authnRequest.Destination = "https://login.microsoftonline.com/021af3dc-d776-4348-8539-7eab9f6ce3fb/saml2";// Configuration.SingleSignOnServiceURL;
            authnRequest.Issuer = new Issuer("http://localhost/WebDrawer");
            authnRequest.ForceAuthn = false;
            authnRequest.NameIDPolicy = new NameIDPolicy(null, null, true);

            // Serialize the authentication request to XML for transmission.
            XmlElement authnRequestXml = authnRequest.ToXml();



            return authnRequestXml;
        }

        public object Get(Login request)
        {
            /*
            // Create the authentication request.
         XmlElement authnRequestXml = CreateAuthnRequest();

            // Create and cache the relay state so we remember which SP resource the user wishes to access after SSO.
            string spResourceURL = "~/";
            string relayState = RelayStateCache.Add(new RelayState(spResourceURL, null));

            // Send the authentication request to the identity provider over the configured binding.

            X509Certificate2 x509Certificate = new X509Certificate2(@"C:\Program Files (x86)\ComponentSpace SAML v2.0 for .NET\Examples\SSO\HighLevelAPI\MVC\MvcExampleServiceProvider\Certificates\MVCTest.cer");

                    ServiceProvider.SendAuthnRequestByHTTPRedirect(HttpContext.Current.Response, "https://login.microsoftonline.com/021af3dc-d776-4348-8539-7eab9f6ce3fb/saml2", authnRequestXml, relayState, x509Certificate.PrivateKey);


            HttpContext.Current.Response.End();
            */
            //HttpContext.Current.Session["ff"] = "test";

            //object tss = HttpContext.Current.Session["ff"];

            string partnerIdP = WebConfigurationManager.AppSettings["PartnerIdP"];
            SAMLServiceProvider.InitiateSSO(HttpContext.Current.Response, null, partnerIdP);
            return new LoginResponse();
        }
    }
}
