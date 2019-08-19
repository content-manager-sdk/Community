using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using Microsoft.Identity.Client;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Text;
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
				return record.ExternalReference;
			}

			return null;
		}

		private static TokenCache userTokenCache = new TokenCache();
		private static TokenCache apiTokenCache = new TokenCache();

		protected async Task<string> getToken()
		{
			UserAssertion userAssertion;
			var session = (base.GetSession() as AuthUserSession);

			if (session != null && !string.IsNullOrWhiteSpace(session.RequestTokenSecret))
			{
				return session.RequestTokenSecret;
			}

			//if (this.Cache.Get<string>("tk") != null)
			//{
			//	return this.Cache.Get<string>("tk");
			//}



			TokenCache cache = new TokenCache();
			
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
