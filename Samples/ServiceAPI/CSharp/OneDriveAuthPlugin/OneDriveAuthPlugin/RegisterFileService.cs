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
		public string WebUrl { get; set; }
	}

	public class RegisterFileResponse
	{
		public string Id { get; set; }
	}

	public class RegisterFileService : TrimServiceBase
	{
		public async Task<object> Get(RegisterFile request)
		{
			RegisterFileResponse response = new RegisterFileResponse() { Id = "test" };

			string[] addinScopes = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value.Split(' ');

			var bootstrapContext = ClaimsPrincipal.Current.Identities.First().BootstrapContext as BootstrapContext;

				UserAssertion userAssertion = new UserAssertion(bootstrapContext.Token);

			
			//// Get the access token for MS Graph. 
					ClientCredential clientCred = new ClientCredential(ConfigurationManager.AppSettings["ida:Password"]);

			ConfidentialClientApplication cca =
				new ConfidentialClientApplication(ConfigurationManager.AppSettings["ida:ClientID"],
												  ConfigurationManager.AppSettings["ida:RedirectUri"], clientCred, null, null);
			response.Id = bootstrapContext.Token;

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
				response.Id = e.Message;
			}

		

			OneDriveItem fileResult;
			try
			{
				var driveDetails = await ODataHelper.GetItem<OneDriveDrive>(GraphApiHelper.GetMyOneDriveUrl(), result.AccessToken);

				string filePath = request.WebUrl.Substring(driveDetails.WebUrl.Length);

				var fullOneDriveItemsUrl = GraphApiHelper.GetOneDriveItemPathsUrl(filePath);
				fileResult = await ODataHelper.GetItem<OneDriveItem>(fullOneDriveItemsUrl, result.AccessToken);
			}
			catch
			{
				throw;
			}


			response.Id = fileResult.Id;

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
