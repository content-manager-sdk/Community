using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Net;
using System.Web.SessionState;

namespace OneDriveConnector
{
	public class Tokens
	{
		private const string AppTokenCacheKey = "appToken";
		public static string getApplicationToken()
		{
			string token = null;
			HttpSessionState session = null;

			if (System.Web.HttpContext.Current != null)
			{

				session = System.Web.HttpContext.Current?.Session;
				
				if (session != null)
				{
					token = session[AppTokenCacheKey] as string;
				}
			}

			if (string.IsNullOrWhiteSpace(token)) {
				WebClient webClient = new WebClient();

				string tenantId = ConfigurationManager.AppSettings["oauth.aad.TenantId"];
				Console.WriteLine(tenantId);
				string tokenUrl = ConfigurationManager.AppSettings["oauth.aad.AccessTokenUrl"].Replace("common", tenantId);


				NameValueCollection formData = new NameValueCollection();
				formData["client_id"] = ConfigurationManager.AppSettings["oauth.aad.ClientId"];
				formData["client_secret"] = ConfigurationManager.AppSettings["oauth.aad.ClientSecret"];
				formData["grant_type"] = "client_credentials";
			//	formData["scope"] = "https://graph.microsoft.com/.default";
			//	formData["scope"] = "https://graph.microsoft.com/Files.ReadWrite.All";
				//
				formData["resource"] = "https://graph.microsoft.com";
				//formData["scope"] = "https://graph.microsoft.com/.default";
				//


				var data = webClient.UploadValues(tokenUrl, formData);

				var str = System.Text.Encoding.Default.GetString(data);

				dynamic response = JsonConvert.DeserializeObject(str);

				token = response.access_token;

				if (session != null)
				{
					session[AppTokenCacheKey] = token;
				}
			}

			return token;
		}

	}
}
