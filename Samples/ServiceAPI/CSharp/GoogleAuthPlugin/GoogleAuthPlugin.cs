using HP.HPTRIM.Service;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Authentication.OAuth2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleAuthPlugin
{
    public class Reconfigure : IReconfigure
    {
        public void Configure(IAppHost appHost)
        {
            var appSettings = new ServiceStack.Configuration.AppSettings();

            if (appHost.Plugins.Exists(p => p is AuthFeature))
            {
                appHost.Plugins.Remove(appHost.Plugins.First(p => p is AuthFeature));
            }

            string oauthLogin = appSettings.GetString("oauth.login");

            if (oauthLogin == null)
            {
                oauthLogin = "~/auth/GoogleOAuth";
            }

            appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
                        new GoogleOAuth2Provider(appSettings),
                    }, oauthLogin));
        }
    }
}
