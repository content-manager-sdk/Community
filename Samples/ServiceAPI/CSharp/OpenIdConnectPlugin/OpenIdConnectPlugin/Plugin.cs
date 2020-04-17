using HP.HPTRIM.Service;
using ServiceStack;
using ServiceStack.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenIdConnectPlugin
{
	public class Plugin : IReconfigure
	{
        public void Configure(IAppHost appHost)
        {
            var appSettings = new ServiceStack.Configuration.AppSettings();

            if (appHost.Plugins.Exists(p => p is AuthFeature))
            {
                appHost.Plugins.Remove(appHost.Plugins.First(p => p is AuthFeature));
            }

            string login = appSettings.GetString("oidc.login");

            if (login == null)
            {
                login = "~/auth/OpenId";
            }


            // HostContext.Config.WebHostUrl = appSettings.GetString("saml.WebHostUrl");

            appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
                        new OpenIDConnectProvider(appSettings),
                    }, login));



        }
    }
}
