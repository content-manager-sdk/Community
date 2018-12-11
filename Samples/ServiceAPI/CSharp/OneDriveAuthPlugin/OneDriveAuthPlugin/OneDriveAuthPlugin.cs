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

			if (!AppHostConfig.Instance.IsInWebClient)
			{							   

				appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
					new TokenAuthProvider()
				}));

				appHost.Plugins.Add(new CorsFeature(allowedHeaders: "Content-Type,Authorization,Accept", allowedOrigins: "https://localhost:3000", allowCredentials: true));
			}
			else
			{
				var appSettings = new ServiceStack.Configuration.AppSettings();

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
