using HP.HPTRIM.Service;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Authentication.OAuth2;
using System;
using System.Collections.Generic;
using System.IdentityModel.Services;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public class OneDriveAuthPlugin : IReconfigure
	{
		public void Configure(IAppHost appHost)
		{
			if (appHost.Plugins.Exists(p => p is AuthFeature))
			{
				appHost.Plugins.Remove(appHost.Plugins.First(p => p is AuthFeature));
			}
			var appSettings = new ServiceStack.Configuration.AppSettings();

			if (!AppHostConfig.Instance.IsInWebClient)
			{							   

				appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
					new TokenAuthProvider(),
					new AadAuthProvider(appSettings)
					
				}, "~/auth/aad"));

				//https://localhost:3000, 

			//	appHost.Plugins.Add(new CorsFeature(allowedHeaders: "Content-Type,Authorization,Accept,Referrer,User-Agent", allowedOrigins: "https://mfcm.xyz", allowCredentials: true));
			//	appHost.Plugins.Add(new CorsFeature(allowedHeaders: "*", allowedOrigins: "https://mfcm.xyz", allowCredentials: true));
			}
			else
			{
				appHost.Config.DefaultRedirectPath = "~/ContentManager";

				

				string oauthLogin = appSettings.GetString("oauth.login");

				if (oauthLogin == null)
				{
					oauthLogin = "~/auth/aad";
				}

				
				appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
					new AadAuthProvider(appSettings) 
				}, "~/auth/aad")
				
				
				);
			}
		}
	}
}
