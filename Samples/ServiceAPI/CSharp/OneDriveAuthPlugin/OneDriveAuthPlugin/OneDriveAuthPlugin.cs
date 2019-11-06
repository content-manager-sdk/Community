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

				appHost.PreRequestFilters.Add((httpReq, httpResp) =>
				{

					var authSession = httpReq.GetSession(false);
					if (httpReq.Verb == HttpMethods.Post)
					{

						if (!authSession.IsAuthenticated)
						{

							var meta = (authSession as IMeta).Meta;

							if (meta != null)
							{

								if (httpReq.FormData["items"] != null)
								{
									meta["items"] = httpReq.FormData["items"];
									ServiceExtensions.SaveSession(httpReq, authSession);
								}

							}
						}
					}
				});

				appHost.Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
					new TokenAuthProvider(),
					new AadAuthProvider(appSettings)

				}, "~/auth/aad"));

				appHost.Plugins.Add(new CorsFeature(allowedHeaders: "Content-Type,Authorization,Accept", allowedOrigins: "https://desktop-39dgcn3:3000", allowCredentials: true));
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
