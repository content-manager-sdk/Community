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
	[Route("/RegisterFile", "GET")]
	public class RegisterFile : IReturn<RegisterFileResponse>
	{
		public string WebUrl { get; set; }
		public long Uri { get; set; }
	}

	public class RegisterdFileResponse
	{
		public string Id { get; set; }
		public long Uri { get; set; }
	}

	public class RegisterFileResponse : IHasResponseStatus
	{
		public List<RegisterdFileResponse> Results { get; set; }
		public ResponseStatus ResponseStatus { get; set; }
	}

	public class RegisterFileService : TrimServiceBase
	{
		public async Task<object> Get(RegisterFile request)
		{
			RegisterFileResponse response = new RegisterFileResponse();

			//string[] addinScopes = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value.Split(' ');

			UserAssertion userAssertion;
			var session = (base.GetSession() as AuthUserSession);
			string token = null;
			if (session != null && !string.IsNullOrWhiteSpace(session.RequestTokenSecret))
			{
				token = session.RequestTokenSecret;
			}
			

			if (string.IsNullOrWhiteSpace(token))
			{
				var bootstrapContext = ClaimsPrincipal.Current.Identities.First().BootstrapContext as BootstrapContext;

				//	SecurityToken st = bootstrapContext.SecurityToken;

				userAssertion = new UserAssertion(bootstrapContext.Token);

				ClientCredential clientCred = new ClientCredential(ConfigurationManager.AppSettings["ida:Password"]);

				ConfidentialClientApplication cca =
					new ConfidentialClientApplication(ConfigurationManager.AppSettings["ida:ClientID"],
													  ConfigurationManager.AppSettings["ida:RedirectUri"], clientCred, null, null);

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
					throw;
				}
			} else
			{
				userAssertion = new UserAssertion(token);
			}

			//// Get the access token for MS Graph. 


			string driveId= null;
			if (request.Uri > 0)
			{
				var record = new Record(this.Database, request.Uri);
				driveId = record.ExternalReference;
			}


			OneDriveItem fileResult;
			try
			{
				if (!string.IsNullOrWhiteSpace(request.WebUrl))
				{
					var driveDetails = await ODataHelper.GetItem<OneDriveDrive>(GraphApiHelper.GetMyOneDriveUrl(), token);

					string filePath = request.WebUrl.Substring(driveDetails.WebUrl.Length);

					var fullOneDriveItemsUrl = GraphApiHelper.GetOneDriveItemPathsUrl(filePath);
					fileResult = await ODataHelper.GetItem<OneDriveItem>(fullOneDriveItemsUrl, token);
				} else
				{
					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdsUrl(driveId), token);


				}
			}
			catch
			{
				throw;
			}


			var registeredFile = new RegisterdFileResponse() { Id = fileResult.Id };


			TrimMainObjectSearch search = new TrimMainObjectSearch(this.Database, BaseObjectTypes.Record);
			TrimSearchClause clause = new TrimSearchClause(this.Database, BaseObjectTypes.Record, SearchClauseIds.RecordExternal);
			clause.SetCriteriaFromString(fileResult.Id);

			search.AddSearchClause(clause);

			var uris = search.GetResultAsUriArray(2);

			if (uris.Count == 1)
			{
				registeredFile.Uri = uris[0];
			}
			//if (request.Uri > 0)
			//{
			//	Record record = new Record(this.Database, request.Uri);
			//	response.RecordTitle = record.Title;
			//	response.Name = this.Database.CurrentUser.FormattedName;
			//}



			response.Results = new List<RegisterdFileResponse>() { registeredFile };
			return response;
		}
	}
}
