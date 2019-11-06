using DocumentFormat.OpenXml.Packaging;
using HP.HPTRIM.SDK;
using Microsoft.Graph;
using Office_OOXML_EmbedAddin;
using OneDriveAuthPlugin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OneDriveConnector
{
    public class DocumentHandler
    {
		private long _recordUri;
		private Database _database;

		public DocumentHandler(Database database, long recordUri)
		{
			_database = database;
			_recordUri = recordUri;
		}

		private DocumentHandler() { }

		public async Task<Document> GetDocument(string token)
		{
			if (_recordUri < 1)
			{
				throw new ApplicationException("Invalid Uri");
			}

			if (_database == null || !_database.IsConnected)
			{
				throw new ApplicationException("Invalid database");
			}

			var response = new Document() { UserHasAccess = true };
			var record = new Record(_database, _recordUri);

			string driveId = record.GetDriveId();

			if (!string.IsNullOrWhiteSpace(driveId))
			{
				OneDriveItem fileResult = null;
				
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
					token = Tokens.getApplicationToken();
					fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);
				}
				response.WebUrl = fileResult.WebUrl;
				response.WebDavUrl = fileResult.WebDavUrl;
				response.MimeType = fileResult.File.MimeType;
			}
			else if (record.IsElectronic)
			{

				try
				{
					string folderId = string.Empty;

					var documentFolder = await ODataHelper.PostFolder<OneDriveItem>(GraphApiHelper.GetOneDriveChildrenUrl(), token);
					folderId = documentFolder.Id;

					if (!record.IsDocumentInClientCache)
					{
						record.LoadDocumentIntoClientCache();
					}

					string fileName = record.GetFileName();

					var uploadedFile = await doUpload(record.DocumentPathInClientCache, fileName, token);

					bool checkout = true;
					if (record.IsCheckedOut && record.CheckedOutTo.Uri == _database.CurrentUser.Uri)
					{
						checkout = false;
					}


					record.GetDocument(null, checkout, null, uploadedFile.ParentReference.DriveId + "/items/" + uploadedFile.Id);
					record.SetDriveId(uploadedFile.ParentReference.DriveId + "/items/" + uploadedFile.Id);// uploadedFile. fileItem.getDriveAndId();

					record.Save();


					response.WebUrl = uploadedFile.WebUrl;
					response.WebDavUrl = uploadedFile.WebDavUrl;

				}
				catch
				{
					try
					{
						record.UndoCheckout(null);
					}
					catch { }
					//	return new Error
					throw;
				}
			}
			else
			{
				throw new Exception("Record is not a valid document.");
			}

			return response;
		}

		private static Microsoft.Graph.GraphServiceClient getClient(string accessToken)
		{
			var httpClientHandler = new HttpClientHandler
			{
				//Proxy = new WebProxy("http://localhost:8888"),
				UseDefaultCredentials = true
			};

			var httpProvider = new HttpProvider();

			return new Microsoft.Graph.GraphServiceClient(new Microsoft.Graph.DelegateAuthenticationProvider((requestMessage) =>
			{
				requestMessage
					.Headers
					.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", accessToken);

				return Task.FromResult(0);
			}));
		}

		private void autoOpen(Stream stream)
		{
			string addinGuid = ConfigurationManager.AppSettings["owa:Id"];
			string addinVersion = ConfigurationManager.AppSettings["owa:Version"];

			using (var document = WordprocessingDocument.Open(stream, true))
			{
				var webExTaskpanesPart = document.WebExTaskpanesPart ?? document.AddWebExTaskpanesPart();

					OOXMLHelper.CreateWebExTaskpanesPart(webExTaskpanesPart, addinGuid, addinVersion);

			}

		}

		private async Task<Microsoft.Graph.DriveItem> doUpload(string filePath, string fileName, string token)
		{

			var graphServiceClient = getClient(token);

			using (var file = System.IO.File.OpenRead(filePath))
			{
				MemoryStream stream = new MemoryStream();
				file.CopyTo(stream);


				autoOpen(stream);

				var documentFolder = await ODataHelper.PostFolder<OneDriveItem>(GraphApiHelper.GetOneDriveChildrenUrl(), token);


				var uploadSession = await graphServiceClient.Drives[documentFolder.ParentReference.DriveId].Items[documentFolder.Id].ItemWithPath(fileName).CreateUploadSession().Request().PostAsync();		

				string ul = uploadSession.UploadUrl += "&$select=Id,ParentReference,WebUrl,WebDavUrl";

				var maxChunkSize = (320 * 1024) * 10; // 5000 KB - Change this to your chunk size. 5MB is the default.
				var provider = new ChunkedUploadProvider(uploadSession, graphServiceClient, stream, maxChunkSize);

				try
				{
					// Setup the chunk request necessities
					var chunkRequests = provider.GetUploadChunkRequests();
					var readBuffer = new byte[maxChunkSize];
					var trackedExceptions = new List<Exception>();
					DriveItem itemResult = null;

					//upload the chunks
					foreach (var request in chunkRequests)
					{
						// Do your updates here: update progress bar, etc.
						// ...
						// Send chunk request
						var result = await provider.GetChunkRequestResponseAsync(request, readBuffer, trackedExceptions);

						if (result.UploadSucceeded)
						{
							itemResult = result.ItemResponse;
						}
					}

					// Check that upload succeeded
					if (itemResult != null)
					{
						return itemResult;
					}
				}
				catch
				{
					await provider.DeleteSession();
					throw;
				}
			}
			throw new ApplicationException("Upload failed.");
		}
	}
}
