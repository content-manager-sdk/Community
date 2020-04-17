using HP.HPTRIM.Service;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Configuration;
using ServiceStack.Text;
using ServiceStack.Web;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OpenIdConnectPlugin
{
	public class OpenIDConnectProvider : OAuthProvider
	{
		public const string DefaultName = "OpenId";
		private string _wellKnownUri;




		public OpenIDConnectProvider(IAppSettings appSettings)
			: base(appSettings, null, DefaultName)
		{
			this.ConsumerKey = appSettings.GetString("oidc.ClientId");
			this.ConsumerSecret = appSettings.GetString("oidc.ClientSecret");
			_wellKnownUri = appSettings.GetString("oidc.WellKnownUri");
		}


		private OpenIdConnectConfiguration getOIDConfig()
		{
			var xx = AddInSsoToken.GetOIDConnectConfig(_wellKnownUri);
			var aa = xx.Wait(5000);

			if (!aa)
			{
				throw new Exception("Unable to fetch Configutation");
			}
			return xx.Result;
		}

		public override object Logout(IServiceBase service, Authenticate request)
		{
			var config = getOIDConfig();

			string redirectTo = null;

			if (string.IsNullOrWhiteSpace(redirectTo) && service.Request.UrlReferrer != null)
			{
				redirectTo = service.Request.UrlReferrer.AbsoluteUri;
			}

			if (string.IsNullOrWhiteSpace(redirectTo))
			{
				redirectTo = service.Request.GetAbsoluteUrl($"/");
			}

			var session = service.GetSession();

			IAuthTokens tokens = session.GetAuthTokens(session.AuthProvider);

			request.Continue = $"{config.EndSessionEndpoint}?post_logout_redirect_uri={HttpUtility.UrlEncode(redirectTo)}";

			return base.Logout(service, request);
		}

		private static Dictionary<Guid, string> redirectUrls = new Dictionary<Guid, string>();

		private void setSession(string token, IAuthSession session)
		{
			AddInSsoToken ssotoken = new AddInSsoToken(token, _wellKnownUri, this.ConsumerKey);

			var validationResult = ssotoken.Validate();
			validationResult.Wait();
			var result = validationResult.Result;

			if (result.IsValid == false)
			{

				Log.Error(result.Message);
				Log.Info(token);

				throw new ApplicationException("AccessTokenFailed");
			}


			session.IsAuthenticated = true;
			session.UserAuthName = result.PreferredName;
			session.UserName = result.PreferredName;


		}



		public override object Authenticate(IServiceBase authService, IAuthSession session, Authenticate request)
		{
			ServiceStack.Logging.ILog log = ServiceStack.Logging.LogManager.GetLogger(typeof(OpenIDConnectProvider));


			var config = getOIDConfig();


			var tokens = Init(authService, ref session, request);

			string redirectUri = authService.Request.GetAbsoluteUrl($"~/auth/openid");

			log.Debug($"redirect uri: {redirectUri}");

			var httpRequest = authService.Request;


			if (httpRequest.GetParam("code") != null)
			{

				WebClient webClient = new WebClient();
				NameValueCollection formData = new NameValueCollection();
				formData["code"] = httpRequest.GetParam("code");
				formData["client_id"] = this.ConsumerKey;
				formData["redirect_uri"] = redirectUri.ToLower();
				formData["grant_type"] = "authorization_code";
				formData["client_secret"] = this.ConsumerSecret;

				string maxAge = httpRequest.GetParam("max_age");
				if (!string.IsNullOrWhiteSpace(maxAge))
				{
					formData["max_age"] = maxAge;
				}

				string prompt = httpRequest.GetParam("prompt");
				if (!string.IsNullOrWhiteSpace(prompt))
				{
					formData["prompt"] = maxAge;
				}

				webClient.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
				var response = webClient.UploadValues(config.TokenEndpoint, formData);

				var str = System.Text.Encoding.Default.GetString(response);

				var json = JsonObject.Parse(str);

				try
				{
					tokens.AccessToken = json.Get<string>("access_token");
					tokens.RequestToken = json.Get<string>("id_token");

					session.AddAuthToken(tokens);

					setSession(json.Get<string>("id_token"), session);

					this.SaveSession(authService, session, SessionExpiry);
				}
				catch
				{
					return this.Logout(authService, request);
				}

				string redirectTo = authService.Request.GetAbsoluteUrl($"~/");


				string stateId = httpRequest.GetParam("state");

				log.Debug($"stateId: {stateId}");
				if (!string.IsNullOrWhiteSpace(stateId))
				{
					Guid stateGuid;
					if (Guid.TryParse(stateId, out stateGuid))
					{
						if (redirectUrls.ContainsKey(stateGuid))
						{
							if (!string.IsNullOrWhiteSpace(redirectUrls[stateGuid]))
							{
								redirectTo = redirectUrls[stateGuid];
								log.Debug($"redirectTo: {redirectTo}");
								redirectUrls.Remove(stateGuid);
							}
						}
					}
					else
					{
						string redirUrl = HttpUtility.UrlDecode(stateId);
						if (redirUrl.StartsWith("http", StringComparison.InvariantCultureIgnoreCase))
						{
							redirectTo = redirUrl;
						}
					}
				}

				return OnAuthenticated(authService, session, tokens, httpRequest.FormData.ToDictionary())
								   ?? doRedirect(authService, SuccessRedirectUrlFilter(this, redirectTo)); //Haz Access!

			}
			else
			{

				log.Debug($"referrer: {session.ReferrerUrl}");
				Guid stateId = Guid.NewGuid();
				redirectUrls[stateId] = cleanSiteUrl(session.ReferrerUrl);

				var maxAge = httpRequest.GetParam("max_age");
				if (!string.IsNullOrWhiteSpace(maxAge))
				{
					maxAge = $"&max_age={maxAge}";
				}

				var prompt = "";
				//if (ServiceDefaults.Instance.Authentication.PromptForLogin)
				//{
				//	prompt = $"&prompt=login";
				//}

				var error = httpRequest.GetParam("f");

				if (!string.IsNullOrWhiteSpace(error))
				{
					return HttpError.Unauthorized("AccessToken validation failed.");
				}
				else
				{

					return authService.Redirect($"{config.AuthorizationEndpoint}?client_id={this.ConsumerKey}&redirect_uri={redirectUri.ToLower()}&response_type=code&scope=openid%20email&state={stateId}{maxAge}{prompt}");
				}
			}

		}

		private string cleanSiteUrl(string url)
		{
			ServiceStack.Logging.ILog log = ServiceStack.Logging.LogManager.GetLogger(typeof(OpenIDConnectProvider));
			log.Debug("cleanSiteUrl");
			log.Debug(url);
			string redirUrl = url;
			if (AppHostConfig.Instance.IsInWebClient && url.IndexOf("openidinfo", StringComparison.InvariantCultureIgnoreCase) < 0)
			{
				if (!string.IsNullOrWhiteSpace(redirUrl))
				{
					Uri uri = new Uri(url);



					int lastpartStart = uri.AbsolutePath.TrimEnd('/').LastIndexOf('/');

					log.Debug(lastpartStart);
					log.Debug(uri.AbsolutePath.Substring(0, lastpartStart));
					redirUrl = uri.Scheme + "://" + uri.Host + uri.AbsolutePath.Substring(0, lastpartStart) + uri.Query;
				}
			}

			return redirUrl;
		}

		private IHttpResult doRedirect(IServiceBase authService, string referrerUrl)
		{
			return authService.Redirect((referrerUrl).SetParam("s", "1"));
		}




		public override void LoadUserOAuthProvider(IAuthSession authSession, IAuthTokens tokens)
		{
			var userSession = authSession as AuthUserSession;
			if (userSession == null) return;
		}

		public override bool IsAuthorized(IAuthSession session, IAuthTokens tokens, Authenticate request = null)
		{

			if (request != null)
			{
				if (!LoginMatchesSession(session, request.UserName)) return false;
			}

			HttpContext context = System.Web.HttpContext.Current;
			string authHeader = context.Request.Headers["Authorization"];
			if (!string.IsNullOrWhiteSpace(authHeader))
			{
				setSession(authHeader.Substring(authHeader.IndexOf(' ') + 1), session);

			}



			if (session != null && session.IsAuthenticated)
			{

				return true;
			}
			return false;
		}



	}
}
