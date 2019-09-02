using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[Route("/OpenFile/{Uri}", "GET")]
	public class OpenFile : ITrimRequest
	{
		public long Uri { get; set; }
	}

	public class OpenFileResponse : IHasResponseStatus
	{
		public string WebUrl { get; set; }
		public string WebDavUrl { get; set; }

		public bool UserHasAccess { get; set; }

		public ResponseStatus ResponseStatus { get; set; }
	}

	public class OpenFileService : BaseOneDriveService
	{


		public async Task<object> Get(OpenFile request)
		{
			if (request.Uri < 1)
			{
				throw new HttpError(HttpStatusCode.BadRequest, "400", "Invalid Uri");
			}

			var response = new OpenFileResponse() { UserHasAccess = true };
			var record = new Record(this.Database, request.Uri);

		//	string token = await getToken();

			string driveId = record.SpURL;
		//	string webUrl = record.SpURL;

			OneDriveItem fileResult = null;
			if (!string.IsNullOrWhiteSpace(driveId))
			{

				string token = await getToken();

				try
				{
					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);
				}
				catch (Exception ex)
				{
					response.UserHasAccess = false;
				}

				if (response.UserHasAccess == false)
				{
					token = getApplicationToken();
					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);
				}
				response.WebUrl = fileResult.WebUrl;
				response.WebDavUrl = fileResult.WebDavUrl;
			}
			else if (record.IsElectronic)
			{
				record.GetDocument(null, true, null, null);

				string token = await getToken();
				string folderId = string.Empty;

				//	try
				//	{
				var documentFolder = await ODataHelper.PostFolder<OneDriveItem>(GraphApiHelper.GetOneDriveChildrenUrl(), token);
				folderId = documentFolder.Id;

				if (!record.IsDocumentInClientCache)
				{
					record.LoadDocumentIntoClientCache();
				}

				Regex pattern = new Regex("[\\\\/<>|?]|[\n]{2}");
				
				string fileName = $"{Path.GetFileNameWithoutExtension(record.SuggestedFileName)} ({pattern.Replace(record.Number, "_")}){Path.GetExtension(record.SuggestedFileName)}" ;

				var emptyfile = await ODataHelper.PostEmptyFile(GraphApiHelper.GetOneDriveChildrenUrl(documentFolder), token, fileName);

				var sessionDetails = await ODataHelper.PostUploadSession(GraphApiHelper.GetOneDriveSessionUrl(emptyfile), token, fileName);

				var fileItem = await ODataHelper.PostFile<OneDriveItem>(sessionDetails.uploadUrl, token, record.DocumentPathInClientCache);

				//record.ExternalReference = fileItem.Id;
				record.SpURL = fileItem.getDriveAndId();

				fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(record.SpURL), token, null);

				record.Save();
				

				response.WebUrl = fileResult.WebUrl;
				response.WebDavUrl = fileResult.WebDavUrl;
				//}
				//catch
				//{
				//	return new Error
				//	throw;
				//}
			}
			else
			{
				throw new Exception("Record is not a valid document.");
			}
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
