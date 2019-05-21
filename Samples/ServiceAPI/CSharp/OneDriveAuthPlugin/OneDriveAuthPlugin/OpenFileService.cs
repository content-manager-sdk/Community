using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[Route("/OpenFile/{Uri}", "GET")]
	public class OpenFile : ITrimRequest
	{
		public long Uri { get; set; }
	}

	public class OpenFileResponse
	{
		public string WebUrl { get; set; }
	}

	public class OpenFileService : BaseOneDriveService
	{

		public async Task<object> Get(OpenFile request)
		{
			if (request.Uri < 1)
			{
				throw new Exception("Invalid Uri");
			}

			var response = new OpenFileResponse();
			var record = new Record(this.Database, request.Uri);

			string token = await getToken();

			string driveId = record.ExternalReference;
			

			OneDriveItem fileResult = null;
			if (!string.IsNullOrWhiteSpace(driveId))
			{
				fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);
				response.WebUrl = fileResult.WebUrl;
			}
			else if (record.IsElectronic)
			{
				string folderId = string.Empty;

				try
				{
					var documentFolder = await ODataHelper.PostFolder<OneDriveItem>(GraphApiHelper.GetOneDriveChildrenUrl(), token);
					folderId = documentFolder.Id;

					if (!record.IsDocumentInClientCache)
					{
						record.LoadDocumentIntoClientCache();
					}

					var fileItem = await ODataHelper.PostFile<OneDriveItem>(GraphApiHelper.GetOneDriveFileUploadUrl(folderId, record.SuggestedFileName), token, record.DocumentPathInClientCache);

					record.ExternalReference = fileItem.Id;
					record.Save();
					record.GetDocument(null, true, null, null);

					response.WebUrl = fileItem.WebUrl;
				}
				catch
				{
					throw;
				}
			} else
			{
				throw new Exception("Record is not a valid document.");
			}
			return response;
		}
	}
}
