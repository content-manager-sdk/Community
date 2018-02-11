using HP.HPTRIM.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Auth;
using ComponentSpace.SAML2;
using ComponentSpace.SAML2.Data;
using ServiceStack.Web;
using System.Web;

namespace ComponentSpaceSAMLPlugin
{
    public class ComponentSpaceSAMLPlugin : IReconfigure
    {
        public void Configure(IAppHost appHost)
        {
            var appSettings = new ServiceStack.Configuration.AppSettings();

            if (appHost.Plugins.Exists(p => p is AuthFeature))
            {
                appHost.Plugins.Remove(appHost.Plugins.First(p => p is AuthFeature));
            }

            string samlLogin = appSettings.GetString("saml.login");

            if (samlLogin == null)
            {
                samlLogin = "~/auth/saml";
            }

            SAMLController.SSOSessionStore = new InMemorySSOSessionStore()
            {
                SessionIDDelegate = delegate ()
                {
                    IHttpRequest request = HttpContext.Current.ToRequest();
                    return request.GetSessionId();
                }
            };

            HostContext.Config.WebHostUrl = appSettings.GetString("saml.WebHostUrl");

            appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
                        new SamlAuthProvider(appSettings),
                    }, samlLogin));


            
        }
    }
}
