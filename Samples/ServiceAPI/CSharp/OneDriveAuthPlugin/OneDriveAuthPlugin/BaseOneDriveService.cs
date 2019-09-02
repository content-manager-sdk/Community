using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using ServiceStack;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public abstract class BaseOneDriveService : TrimServiceBase
	{
		protected string getDriveIdFromTrim(ITrimRequest request)
		{

			if (request.Uri > 0)
			{
				var record = new Record(this.Database, request.Uri);
				return record.SpURL;
			}

			return null;
		}

		private static TokenCache userTokenCache = new TokenCache();
		private static TokenCache apiTokenCache = new TokenCache();


		protected string getApplicationToken()
		{
			string token = this.Cache.Get<string>("appToken");

			if (string.IsNullOrWhiteSpace(token)) {

				WebClient webClient = new WebClient();
				string tenantId = ConfigurationManager.AppSettings["oauth.aad.TenantId"];
				string tokenUrl = ConfigurationManager.AppSettings["oauth.aad.AccessTokenUrl"].Replace("common", tenantId);


				NameValueCollection formData = new NameValueCollection();
				formData["client_id"] = ConfigurationManager.AppSettings["oauth.aad.ClientId"];
				formData["client_secret"] = ConfigurationManager.AppSettings["oauth.aad.ClientSecret"];
				formData["grant_type"] = "client_credentials";
				formData["scope"] = "https://graph.microsoft.com/.default";


				var data = webClient.UploadValues(tokenUrl, formData);

				var str = System.Text.Encoding.Default.GetString(data);

				dynamic response = JsonConvert.DeserializeObject(str);
				token = response.access_token;
				this.Cache.Add<string>("appToken", token, TimeSpan.FromSeconds(Convert.ToDouble(response.expires_in)));

				return response.access_token;
			}
			return token;

		}
			protected async Task<string> getToken()
		{
			UserAssertion userAssertion;
			var session = (base.GetSession() as AuthUserSession);

			if (session != null && !string.IsNullOrWhiteSpace(session.RequestTokenSecret))
			{
				return session.RequestTokenSecret;
			}
			
			var bootstrapContext = ClaimsPrincipal.Current.Identities.First().BootstrapContext as BootstrapContext;

			//	SecurityToken st = bootstrapContext.SecurityToken;

			userAssertion = new UserAssertion(bootstrapContext.Token);

			ClientCredential clientCred = new ClientCredential(ConfigurationManager.AppSettings["oauth.aad.ClientSecret"]);

			ConfidentialClientApplication cca =
				new ConfidentialClientApplication(ConfigurationManager.AppSettings["oauth.aad.ClientId"],
												  ConfigurationManager.AppSettings["oauth.aad.RedirectUrl"], clientCred, userTokenCache, apiTokenCache);

			string tenantId = ConfigurationManager.AppSettings["oauth.aad.TenantId"].ToString();

			string[] graphScopes = { "Files.Read.All" };
			AuthenticationResult result = null;
			try
			{
				// The AcquireTokenOnBehalfOfAsync method will first look in the MSAL in memory cache for a
				// matching access token. Only if there isn't one, does it initiate the "on behalf of" flow
				// with the Azure AD V2 endpoint.
				result = await cca.AcquireTokenOnBehalfOfAsync(graphScopes, userAssertion, $"https://login.microsoftonline.com/{tenantId}/v2.0");
				//if (session != null)
				//{
				//	base.Cache.Add<string>("tk", result.AccessToken);
				//}
				return result.AccessToken;


			}
			catch (MsalServiceException e)
			{
				throw;
			}

		}
	}
}
