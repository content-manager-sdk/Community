using HP.HPTRIM.Service;
using ServiceStack;
using ServiceStack.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public class OneDriveAuthPlugin : IReconfigure
	{
		public void Configure(IAppHost appHost)
		{
			var appSettings = new ServiceStack.Configuration.AppSettings();

			if (appHost.Plugins.Exists(p => p is AuthFeature))
			{
				appHost.Plugins.Remove(appHost.Plugins.First(p => p is AuthFeature));
			}

			appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
					new TokenAuthProvider()
				}));

			appHost.Plugins.Add(new CorsFeature(allowedHeaders: "Content-Type,Authorization,Accept", allowedOrigins:"https://localhost:3000", allowCredentials:true));
		}
	}
}
