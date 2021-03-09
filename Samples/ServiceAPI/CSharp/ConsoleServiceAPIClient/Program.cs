using HP.HPTRIM.ServiceModel;
using Microsoft.Identity.Client;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;

namespace ConsoleServiceAPIClient
{
	class Program
	{

		private static JsonHttpClient _trimClient;
		private static HttpClient _httpClient;
		static IPublicClientApplication _app;

		static async Task<string> getAuthToken()
		{
			string clientId = System.Configuration.ConfigurationManager.AppSettings["clientId"];
			string tenantId = System.Configuration.ConfigurationManager.AppSettings["tenantId"];

			if (_app == null)
			{
				_app = PublicClientApplicationBuilder.Create(clientId)
					.WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
					.WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
					.Build();

				TokenCacheHelper.EnableSerialization(_app.UserTokenCache);
			}

			var accounts = await _app.GetAccountsAsync();
			AuthenticationResult result;

			var scopes = new string[] { "User.Read", "offline_access", "openid", "profile" };

			try
			{
				result = await _app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
					   .ExecuteAsync();
			}
			catch (MsalUiRequiredException ex)
			{
				// A MsalUiRequiredException happened on AcquireTokenSilent.
				// This indicates you need to call AcquireTokenInteractive to acquire a token
				System.Diagnostics.Debug.WriteLine($"MsalUiRequiredException: {ex.Message}");

				try
				{
					result = await _app.AcquireTokenInteractive(scopes)
						  .ExecuteAsync();
				}
				catch (MsalException msalex)
				{
					Console.WriteLine($"Error Acquiring Token:{System.Environment.NewLine}{msalex}");
					throw;
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error Acquiring Token Silently:{System.Environment.NewLine}{ex}");
				throw;
			}

			return result.IdToken;
		}


		static async Task<JsonHttpClient> getServiceClient()
		{

			string token = await getAuthToken();

			if (_trimClient == null)
			{
				// repalce the URL with the URL to your ServiceAPI instance
				_trimClient = new JsonHttpClient("https://MyDev/ServiceAPI");
			}


			_trimClient.Headers["Authorization"] = $"Bearer {token}";
			return _trimClient;


		}

		static async Task<HttpClient> getHttpClient()
		{

			string token = await getAuthToken();

			if (_httpClient == null)
			{
				_httpClient = new HttpClient();
			}

			_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
			return _httpClient;
		}

		static async Task Main(string[] args)
		{
			var stopWatch = Stopwatch.StartNew();

			//	await getRecordUri();

			//	await getRecordTitle();

			//	await createRecord();

			//await recordSearch();

			await streamSearch();

			//await createRecordWithDocument();

			// await getDocument();

			Console.WriteLine(stopWatch.ElapsedMilliseconds);
			Console.ReadKey();
		}


		private async static Task getRecordUri()
		{
			var trimClient = await getServiceClient();
			var response = trimClient.Get<RecordsResponse>(new RecordFind() { Id = "REC_1" });
			Console.WriteLine(response.Results[0].Uri);
		}

		private async static Task getRecordTitle()
		{
			var trimClient = await getServiceClient();
			var response = trimClient.Get<RecordsResponse>(new RecordFind()
			{
				Id = "REC_1",
				Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
			});


			Console.WriteLine(response.Results[0].Title);
		}

		private async static Task createRecord()
		{
			var trimClient = await getServiceClient();

			var record = new Record()
			{
				RecordType = new RecordTypeRef() { FindBy = "Document" },
				Title = "my test",
				Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
			};

			var response = trimClient.Post<RecordsResponse>(record);

			Console.WriteLine(response.Results[0].Title);
		}

		private async static Task recordSearch()
		{
			var trimClient = await getServiceClient();
			var response = trimClient.Get<RecordsResponse>(new Records()
			{
				q = "all",
				Properties = new List<string>() { $"{PropertyIds.RecordOwnerLocation}" },
				ResultsOnly = true,
				PropertyValue = PropertyType.String,
				pageSize = 100
			});


			foreach (var record in response.Results)
			{
				Console.WriteLine(record.OwnerLocation.StringValue);
			}
		}

		private async static Task streamSearch()
		{
			var trimClient = await getServiceClient();
			var response = trimClient.Get<RecordsResponse>(new TrimStreamSearch()
			{
				TrimType = BaseObjectTypes.Record,
				q = "all",
				Properties = new List<string>() { $"{PropertyIds.RecordOwnerLocation}", $"{PropertyIds.RecordTitle}" },
				pageSize = 100,
			});


			foreach (var record in response.Results)
			{
				Console.WriteLine(record.Uri);
				Console.WriteLine(record.OwnerLocation);

			}
		}


		private async static Task createRecordWithDocument()
		{
			var trimClient = await getServiceClient();

			var record = new Record()
			{
				RecordType = new RecordTypeRef() { FindBy = "Document" },
				Title = "my test document",
				Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
			};

			using (FileStream filestream = new FileStream("d:\\junk\\trim.png", FileMode.Open))
			{
				var uploadFile = new ServiceStack.UploadFile("trim.png", filestream);
				uploadFile.ContentType = "image/png";

				var response = trimClient.PostFilesWithRequest<RecordsResponse>(record, new ServiceStack.UploadFile[] { uploadFile });
				Console.WriteLine(response.Results[0].Title);
			}
		}

		private async static Task getDocument()
		{
			var trimClient = await getServiceClient();
			var httpClient = await getHttpClient();

			var recordDownload = new RecordDownload()
			{
				Id = "REC_1",
				DownloadType = DownloadType.Document
			};

			string url = trimClient.ResolveTypedUrl("GET", recordDownload);


			var response = await httpClient.GetAsync(url).ConfigureAwait(false);
			string fileName = "test.dat";
			IEnumerable<string> values;
			if (response.Content.Headers.TryGetValues("Content-Disposition", out values))
			{
				ContentDisposition contentDisposition = new ContentDisposition(values.First());
				fileName = contentDisposition.FileName;
			}

			using (var fileStream = File.Create(Path.Combine($"C:\\junk\\{fileName}")))
			{
				var stream = await response.Content.ReadAsStreamAsync();
				stream.CopyTo(fileStream);
			}

		}

	}

}
