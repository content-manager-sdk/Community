using Microsoft.Graph;
using Newtonsoft.Json.Linq;
using OneDriveConnector;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[Route("/OpenFile/{Uri}", "GET")]
	[Route("/OpenFile", "POST")]
	public class OpenFile : ITrimRequest
	{
		public long Uri { get; set; }
	}

	public class OpenFileResponse : IHasResponseStatus
	{
		public string WebUrl { get; set; }
		public string WebDavUrl { get; set; }

		public bool UserHasAccess { get; set; }

		public ServiceStack.ResponseStatus ResponseStatus { get; set; }
	}

	//public class MyClientFactory : Microsoft.IdentityModel.Clients.ActiveDirectory.IHttpClientFactory
	//{
	//	private HttpClient httpClient;

	//	public MyClientFactory(HttpClientHandler httpClientHandler)
	//	{
	//		httpClient = new HttpClient(httpClientHandler);
	//	}
	//	public HttpClient GetHttpClient()
	//	{
	//		return httpClient;
	//	}
	//}

	public class OpenFileService : BaseOneDriveService
	{
		private static Microsoft.Graph.GraphServiceClient getClient(string accessToken)
		{
			var httpClientHandler = new HttpClientHandler
			{
				//	Proxy = new WebProxy("http://localhost:8888"),
				UseDefaultCredentials = true
			};

			var httpProvider = new HttpProvider(httpClientHandler, false);

			return new Microsoft.Graph.GraphServiceClient(new Microsoft.Graph.DelegateAuthenticationProvider((requestMessage) =>
			{
				requestMessage
					.Headers
					.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", accessToken);

				return Task.FromResult(0);
			}));
		}

		//private async Task<Microsoft.Graph.DriveItem> doUpload(string filePath, string fileName, string accessToken)
		//{
		//	string token = await getToken();

		//	var graphServiceClient = getClient(token);

		//	using (var file = System.IO.File.OpenRead(filePath))
		//	{
		//		MemoryStream stream = new MemoryStream();
		//		file.CopyTo(stream);


		//		autoOpen(stream);

		//		var documentFolder = await ODataHelper.PostFolder<OneDriveItem>(GraphApiHelper.GetOneDriveChildrenUrl(), token);


		//		var uploadSession = await graphServiceClient.Drives[documentFolder.ParentReference.DriveId].Items[documentFolder.Id].ItemWithPath(fileName).CreateUploadSession().Request().PostAsync();

		//		string ul = uploadSession.UploadUrl += "&$select=Id,ParentReference,WebUrl,WebDavUrl";

		//		var maxChunkSize = (320 * 1024) * 10; // 5000 KB - Change this to your chunk size. 5MB is the default.
		//		var provider = new ChunkedUploadProvider(uploadSession, graphServiceClient, stream, maxChunkSize);


		//		// Setup the chunk request necessities
		//		var chunkRequests = provider.GetUploadChunkRequests();
		//		var readBuffer = new byte[maxChunkSize];
		//		var trackedExceptions = new List<Exception>();
		//		DriveItem itemResult = null;

		//		//upload the chunks
		//		foreach (var request in chunkRequests)
		//		{
		//			// Do your updates here: update progress bar, etc.
		//			// ...
		//			// Send chunk request
		//			var result = await provider.GetChunkRequestResponseAsync(request, readBuffer, trackedExceptions);

		//			if (result.UploadSucceeded)
		//			{
		//				itemResult = result.ItemResponse;
		//			}
		//		}

		//		// Check that upload succeeded
		//		if (itemResult != null)
		//		{
		//			return itemResult;
		//		}
		//	}
		//	throw new ApplicationException("Upload failed.");
		//}


		private async Task<string> doOpenFromFileHandler(string itemUrl, string token)
		{


			UriBuilder downloadUrlBuilder = new UriBuilder(itemUrl);
			downloadUrlBuilder.Path += "/content";

			string url = downloadUrlBuilder.ToString();

			var result = await ODataHelper.DownloadFileAsync(url, token);
			//var result = await ODataHelper.GetItem<string>(url, token, null);

			return result.Content;
		}

		public async Task<object> Post(OpenFile request)
		{
			string token = await getToken();
			var formData = this.Request.FormData;
			var cultureName = this.Request.FormData["cultureName"];
			var client = this.Request.FormData["client"];
			var domainHint = this.Request.FormData["domainHint"];
			var userId = this.Request.FormData["userId"];
			var appId = this.Request.FormData["appdId"];
			var items = this.Request.FormData["items"];
			//string token = await getToken();

			var itemsArray = JArray.Parse(items);
			//var itemsArray = (string[])Newtonsoft.Json.JsonConvert.DeserializeObject(items);


			string response = await doOpenFromFileHandler(itemsArray.First().ToString(), token);

			long uri = 0;
			foreach (string line in response.Split(new string[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries))
			{
				int idx = line.IndexOf("Uri=");

				if (idx > -1)
				{
					uri = Convert.ToInt64(line.Substring(idx + 4));
					break;
				}
			}


			if (uri == 0)
			{
				throw new ApplicationException("Invalid request.");


				//	return documentResponse;
			}
			else
			{
				DocumentHandler documentHandler = new DocumentHandler(this.Database, uri);
				var oneDrivedocument = await documentHandler.GetDocument(token);

				return new HttpResult(HttpStatusCode.Redirect, "open document")
				{
					ContentType = "text/html",
					Headers = {
					{ HttpHeaders.Location, oneDrivedocument.WebUrl }
				},
				};

			}
		}

		private async Task<OpenFileResponse> getDocument(long uri, string token)
		{
			DocumentHandler documentHandler = new DocumentHandler(this.Database, uri);

			try
			{
				var oneDrivedocument = await documentHandler.GetDocument(token);

				return new OpenFileResponse()
				{ UserHasAccess = oneDrivedocument.UserHasAccess, WebDavUrl = oneDrivedocument.WebDavUrl, WebUrl = oneDrivedocument.WebUrl };
			}
			catch (HttpListenerException httpEx)
			{
				throw new HttpError(httpEx.GetStatus().GetValueOrDefault(HttpStatusCode.BadRequest), httpEx.Message);
			}
		}

		public async Task<object> Get(OpenFile request)
		{
			string token = await getToken();
			var response = await getDocument(request.Uri, token);

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
