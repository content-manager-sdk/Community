using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using Microsoft.Identity.Client;
using OneDriveConnector;
using ServiceStack;
using ServiceStack.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public interface ITrimRequest
	{
		long Uri { get; set; }
	}

	[Route("/RegisterFile", "GET")]
	public class RegisterFile : IReturn<RegisterFileResponse>, ITrimRequest
	{
		public string WebUrl { get; set; }
		public long Uri { get; set; }

		public OperationType Operation { get; set; }

		public bool IsEmail { get; set; }
	}

	[Route("/DriveFile", "POST")]
	public class DriveFileOperation : IReturn<RegisterFileResponse>, ITrimRequest
	{
		public long Uri { get; set; }
		public string Action { get; set; }
		public string FileName { get; set; }
		public string WebUrl { get; set; }
	}

	public class RegisterdFileResponse
	{
		public string Id { get; set; }
		public long Uri { get; set; }
		public OneDriveItem DriveItem { get; set; }
		public IList<MyCommandDef> CommandDefs { get; set; }
		public string RecordType { get; set; }
		public TrimOptions Options { get; set; }

		public Dictionary<string, IList<MyEnumItem>> Enums {get; set;}

		public string EmailPath { get; set; }

	}

	public class RegisterFileResponse : IHasResponseStatus
	{
		public List<RegisterdFileResponse> Results { get; set; }
		public ResponseStatus ResponseStatus { get; set; }
	}

	public class RegisterFileService : BaseOneDriveService
	{


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
			fileToUpdate.RecordType = fromRecord.RecordType.Name;
			fileToUpdate.CommandDefs = getCommandDefs(fromRecord);

		}

		public async Task<object> Post(DriveFileOperation request)
		{
			string fileName = request.FileName;
			try
			{			

				RegisterFileResponse response = new RegisterFileResponse();

				Record record = new Record(this.Database, request.Uri);
				record.Refresh();

				string driveId = record.GetDriveId();

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

				if (request.Action.IndexOf("checkin", StringComparison.InvariantCultureIgnoreCase) > -1 
					&& request.Action.IndexOf("checkin-requst-del", StringComparison.InvariantCultureIgnoreCase) < 1)
				{
					string token = await getToken();
					if (!string.IsNullOrWhiteSpace(request.FileName))
					{



					
						if (!Path.IsPathRooted(request.FileName))
						{
							fileName = Path.Combine(this.ServiceDefaults.UploadBasePath, request.FileName);
						}

						var inputDocument = new InputDocument(fileName);

						inputDocument.CheckinAs = request.WebUrl;
							record.SetDocument(inputDocument, true, false, "checkin from Word Online");
					

					} else
					{

						string downloadUrl = GraphApiHelper.GetOneDriveItemContentIdUrl(driveId);

						var fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);

						string filePath = Path.Combine(TrimApplication.WebServerWorkPath, fileResult.Name);


						await ODataHelper.GetItem<string>(downloadUrl, token, filePath);



						var inputDocument = new InputDocument(filePath);


						inputDocument.CheckinAs = record.SuggestedFileName;
						record.SetDocument(inputDocument, true, false, "checkin from Word Online");
					}
				}
				
				if (request.Action.IndexOf("request-del", StringComparison.InvariantCultureIgnoreCase) > -1)
				{
					record.SetDeleteNow(!record.GetDeleteNow());
				}

				if (request.Action.IndexOf("delete", StringComparison.InvariantCultureIgnoreCase) > -1)
				{
					string token = await getToken();

					await ODataHelper.DeleteWithToken(GraphApiHelper.GetOneDriveItemIdUrlForDelete(driveId), token);
					record.SetDriveId("");
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
			finally
			{

					if (!string.IsNullOrWhiteSpace(fileName))
					{
						File.Delete(fileName);
					}

			}
		}



		public async Task<object> Get(RegisterFile request)
		{
			var log = LogManager.GetLogger(typeof(RegisterFileService));

			log.Debug("GET start");
			RegisterFileResponse response = new RegisterFileResponse();



			log.Debug("getToken");
			string token = await getToken();
			log.Debug("gotToken");

			string driveId = getDriveIdFromTrim(request);
			log.Debug("got Drive ID");
			OneDriveItem fileResult = null;

			long recordUri = 0;

			RegisterdFileResponse registeredFile = new RegisterdFileResponse();
			try
			{

				if (request.IsEmail)
				{
					var mailResult = await ODataHelper.GetItem<MailItem>(GraphApiHelper.GetMailItemURL(request.WebUrl), token, null);

					if (mailResult != null && mailResult.SingleValueExtendedProperties != null)
					{
						foreach (var prop in mailResult.SingleValueExtendedProperties)
						{
							if (prop.Id.Equals(GraphApiHelper.IDPropName(), StringComparison.InvariantCultureIgnoreCase))
							{
								long.TryParse(prop.Value.Split('/').Last(), out recordUri);
							}
						}
					}
				}

				if (request.IsEmail && recordUri == 0)
				{
					var emailUrl = GraphApiHelper.GetEMLUrl(request.WebUrl);

					string userFolder = Path.Combine("ForUser", this.Database.CurrentUser.Uri.ToString());

					string fullUserFolder = Path.Combine( this.ServiceDefaults.UploadBasePath, userFolder);

					Directory.CreateDirectory(fullUserFolder);
					string fileName = Path.ChangeExtension(request.WebUrl, "eml");
					string filePath = Path.Combine(fullUserFolder, fileName);


					 await ODataHelper.GetItem<string>(emailUrl, token, filePath);
					registeredFile.EmailPath = Path.Combine(userFolder, fileName); ;

				} else if (!string.IsNullOrWhiteSpace(request.WebUrl) && new string[] { "https://", "http://"}
				.Any(s => request.WebUrl.StartsWith(s, StringComparison.InvariantCultureIgnoreCase)))
				{

					log.Debug("GetItem");
					var fullOneDriveItemsUrl = GraphApiHelper.GetOneDriveShareUrl(request.WebUrl);
					fileResult = await ODataHelper.GetItem<OneDriveItem>(fullOneDriveItemsUrl, token, null);
					log.Debug("GotItem");
				}
				else if (!string.IsNullOrWhiteSpace(driveId) && !request.IsEmail)
				{
					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);
				} 
			}
			catch
			{
				throw;
			}

			

			DroppedFilesUserOptions fileOptions = new DroppedFilesUserOptions(this.Database);
			var options = new TrimOptions();
			if (fileOptions.UseDefaultRecordTypeInOffice == true)
			{
				options.DefaultDocumentRecordType = fileOptions.RecordType.Uri;
			}

			registeredFile.Options = options;

			var enumItems = new List<MyEnumItem>();

			HP.HPTRIM.SDK.Enum relationshipEnum = new HP.HPTRIM.SDK.Enum(AllEnumerations.RecordRelationshipType, this.Database);

			foreach (var relEnum in relationshipEnum.GetItemArray(new int[] {(int)RecordRelationshipType.InSharepointSite, (int)RecordRelationshipType.IsInSeries, (int)RecordRelationshipType.IsRootPart, (int)RecordRelationshipType.IsTempCopy, (int)RecordRelationshipType.IsVersion, (int)RecordRelationshipType.RedactionOf }, true).OrderBy(ei => ei.Caption))
			{
				enumItems.Add(new MyEnumItem() { Name = relEnum.Name, Caption = relEnum.Caption });
			}

			Dictionary<string, IList<MyEnumItem>> enumDetails = new Dictionary<string, IList<MyEnumItem>>();
			enumDetails.Add("RecordRelationshipType", enumItems);

			registeredFile.Enums = enumDetails;

			if (fileResult != null)
			{
				registeredFile.Id = fileResult?.getDriveAndId();
				registeredFile.DriveItem = fileResult;

				TrimMainObjectSearch search = new TrimMainObjectSearch(this.Database, BaseObjectTypes.Record);

				search.AddSearchClause(fileResult.getDriveAndId().GetDriveIdSearchClause(this.Database));

				var uris = search.GetResultAsUriArray(2);

				if (uris.Count == 1)
				{
					updateFromRecord(registeredFile, new Record(this.Database, uris[0]));
				}				
			} else if (request.IsEmail && recordUri > 0)
			{
				updateFromRecord(registeredFile, new Record(this.Database, recordUri));
			}			

			response.Results = new List<RegisterdFileResponse>() { registeredFile };

			log.Debug("Finished");
			return response;
		}

		// I am not 100% sure but the OnEndRequest method of Disposing seems to get called before the async services, that is why I am disposing here.
		// If I continue to get Disposal errors I will need to re-think this.
		public override void Dispose()
		{
			this.Database.Dispose();
			base.Dispose();
		}
	}
}
