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
	[Route("/RegisterFile", "GET")]
	public class RegisterFile : IReturn<RegisterFileResponse>
	{
		public long Uri { get; set; }
	}

	public class RegisterFileResponse
	{
		public string Name { get; set; }
		public string RecordTitle { get; set; }
	}

	public class RegisterFileService : TrimServiceBase
	{
		public async Task<RegisterFileResponse> Get(RegisterFile request)
		{
			RegisterFileResponse response = new RegisterFileResponse() { Name = "test" };

			string[] addinScopes = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value.Split(' ');

			var bootstrapContext = ClaimsPrincipal.Current.Identities.First().BootstrapContext as BootstrapContext;

				UserAssertion userAssertion = new UserAssertion(bootstrapContext.Token);

			
			//// Get the access token for MS Graph. 
					ClientCredential clientCred = new ClientCredential(ConfigurationManager.AppSettings["ida:Password"]);
			ConfidentialClientApplication cca =
				new ConfidentialClientApplication(ConfigurationManager.AppSettings["ida:ClientID"],
												  "https://localhost:3000", clientCred, null, null);
			response.Name = bootstrapContext.Token;

			string[] graphScopes = { "Files.Read.All" };
			AuthenticationResult result = null;
			try
			{
				// The AcquireTokenOnBehalfOfAsync method will first look in the MSAL in memory cache for a
				// matching access token. Only if there isn't one, does it initiate the "on behalf of" flow
				// with the Azure AD V2 endpoint.
				result = await cca.AcquireTokenOnBehalfOfAsync(graphScopes, userAssertion, "https://login.microsoftonline.com/common/oauth2/v2.0");
			}
			catch (MsalServiceException e)
			{
				response.Name = e.Message;
			}

			var fullOneDriveItemsUrl = GraphApiHelper.GetOneDriveItemNamesUrl("?$select=name&$top=3");

			IEnumerable<OneDriveItem> filesResult;
			try
			{
				filesResult = await ODataHelper.GetItems<OneDriveItem>(fullOneDriveItemsUrl, result.AccessToken);
			}
			catch
			{
				throw;
			}

			List<string> itemNames = new List<string>();
			foreach (OneDriveItem item in filesResult)
			{
				itemNames.Add(item.Name);
			}

			response.Name = string.Join(",", itemNames);
			//if (request.Uri > 0)
			//{
			//	Record record = new Record(this.Database, request.Uri);
			//	response.RecordTitle = record.Title;
			//	response.Name = this.Database.CurrentUser.FormattedName;
			//}
			return response;
		}
	}
}
