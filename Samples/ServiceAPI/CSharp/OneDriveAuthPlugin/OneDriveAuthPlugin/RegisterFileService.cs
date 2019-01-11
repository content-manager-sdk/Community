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
	interface TrimRequest
	{
		long Uri { get; set; }
	}

	[Route("/RegisterFile", "GET")]
	public class RegisterFile : IReturn<RegisterFileResponse>, TrimRequest
	{
		public string WebUrl { get; set; }
		public long Uri { get; set; }
	}

	[Route("/DriveFile", "POST")]
	public class DriveFileOperation : IReturn<RegisterFileResponse>, TrimRequest
	{
		public long Uri { get; set; }
		public string Action { get; set; }
	}

	public class RegisterdFileResponse
	{
		public string Id { get; set; }
		public long Uri { get; set; }
		public OneDriveItem DriveItem { get; set; }
		public IList<MyCommandDef> CommandDefs { get; set; }

	}

	public class RegisterFileResponse : IHasResponseStatus
	{
		public List<RegisterdFileResponse> Results { get; set; }
		public ResponseStatus ResponseStatus { get; set; }
	}

	public class RegisterFileService : TrimServiceBase
	{

		private async Task<string> getToken()
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
				return result.AccessToken;

			}
			catch (MsalServiceException e)
			{
				throw;
			}

		}

		private string getDriveIdFromTrim(TrimRequest request)
		{

			if (request.Uri > 0)
			{
				var record = new Record(this.Database, request.Uri);
				return record.ExternalReference;
			}

			return null;
		}

		private static MyCommandDef makeCommand(CommandIds commandId, Record fromRecord)
		{

			CommandDef commandDef = new CommandDef(commandId, fromRecord.Database);
			var myCommandDef = new MyCommandDef();
			myCommandDef.CommandId = (HP.HPTRIM.ServiceModel.CommandIds)commandId;
			myCommandDef.MenuEntryString = commandDef.GetMenuEntryString(fromRecord.TrimType);
			myCommandDef.Tooltip = commandDef.GetTooltip(fromRecord.TrimType);
			myCommandDef.StatusBarMessage = commandDef.GetStatusBarMessage(fromRecord.TrimType);
			myCommandDef.IsEnabled = commandDef.IsEnabled(fromRecord);

			return myCommandDef;
		}

		public static IList<MyCommandDef> getCommandDefs(Record fromRecord)
		{
			var commandDefs = new List<MyCommandDef>();
			foreach (var commandId in new CommandIds[] { CommandIds.Properties, CommandIds.RecCheckIn, CommandIds.RecDocFinal, CommandIds.AddToFavorites, CommandIds.RemoveFromFavorites })
			{
				commandDefs.Add(makeCommand(commandId, fromRecord));
			}

			return commandDefs;
		}

		private void updateFromRecord(RegisterdFileResponse fileToUpdate, Record fromRecord)
		{
			fileToUpdate.Uri = fromRecord.Uri;
			fileToUpdate.CommandDefs = getCommandDefs(fromRecord);

		}

		public async Task<object> Post(DriveFileOperation request)
		{
			string token = await getToken();
			

			RegisterFileResponse response = new RegisterFileResponse();				

			Record record = new Record(this.Database, request.Uri);

			string driveId = record.ExternalReference;

			var registeredFile = new RegisterdFileResponse() { Id = driveId };


			request.Action = request.Action ?? "";

			if (request.Action.IndexOf("AddToFavorites", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				record.AddToFavorites();
			}

			if (request.Action.IndexOf("RemoveFromFavorites", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				record.RemoveFromFavorites();
			}


			if (request.Action.IndexOf("checkin", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				var driveDetails = await ODataHelper.GetItem<string>(GraphApiHelper.GetOneDriveItemContentIdUrl(driveId), token);
				record.SetDocument(new InputDocument(driveDetails), true, false, "checkin from Word Online");
			}

			if (request.Action.IndexOf("delete", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				await ODataHelper.DeleteWithToken(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token);
				record.ExternalReference = "";
			}

			if (request.Action.IndexOf("finalize", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				
				record.SetAsFinal(false);
			}

			record.Save();

			updateFromRecord(registeredFile, record);

			response.Results = new List<RegisterdFileResponse>() { registeredFile };
			return response;
		}

		public async Task<object> Get(RegisterFile request)
		{
			RegisterFileResponse response = new RegisterFileResponse();

			//string[] addinScopes = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value.Split(' ');

			string token = await getToken();


			string driveId = getDriveIdFromTrim(request);

			OneDriveItem fileResult = null;
			try
			{
				if (!string.IsNullOrWhiteSpace(request.WebUrl))
				{
					var driveDetails = await ODataHelper.GetItem<OneDriveDrive>(GraphApiHelper.GetMyOneDriveUrl(), token);

					string filePath = request.WebUrl.Substring(driveDetails.WebUrl.Length);

					var fullOneDriveItemsUrl = GraphApiHelper.GetOneDriveItemPathsUrl(filePath);
					fileResult = await ODataHelper.GetItem<OneDriveItem>(fullOneDriveItemsUrl, token);
				}
				else if (!string.IsNullOrWhiteSpace(driveId))
				{

					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token);


				}
			}
			catch
			{
				throw;
			}


			var registeredFile = new RegisterdFileResponse() { Id = fileResult?.Id, DriveItem = fileResult };


			TrimMainObjectSearch search = new TrimMainObjectSearch(this.Database, BaseObjectTypes.Record);
			TrimSearchClause clause = new TrimSearchClause(this.Database, BaseObjectTypes.Record, SearchClauseIds.RecordExternal);
			clause.SetCriteriaFromString(fileResult.Id);

			search.AddSearchClause(clause);

			var uris = search.GetResultAsUriArray(2);

			if (uris.Count == 1)
			{
				updateFromRecord(registeredFile, new Record(this.Database, uris[0]));
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
