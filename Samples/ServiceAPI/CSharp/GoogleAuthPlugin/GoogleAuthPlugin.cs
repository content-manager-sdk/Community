using HP.HPTRIM.Service;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Authentication.OAuth2;
using ServiceStack.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
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
                oauthLogin = "~/auth/PORTALPOCOAuth";
            }


            appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
                      //  new MyJwtAuthProvider(appSettings) { },
                       new MyOAuth2Provider(appSettings)
                    //  new MyOAuth2Provider(appSettings) { Provider = "GoogleOAuthApp", ConsumerKey = appSettings.Get("oauth.GoogleOAuthApp.ConsumerKey")}
                       
                    }, oauthLogin) );
        }
    }
}
