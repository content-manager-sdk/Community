using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;


namespace OneDriveAuthPlugin
{
	public class FileData
	{
		public string Content { get; set; }

		public Stream FileStream { get; set; }

		public string Filename { get; set; }


	}

	public static class ODataHelper
	{


		//		internal static async Task<T> UploadFile<T>(string itemPath, string accessToken)
		//		{

		//			System.Net.Http.StringContent content = new StringContent(@"{
		//  ""name"": ""Content Manager Documents"",
		//  ""folder"": { },
		//  ""@microsoft.graph.conflictBehavior"": ""replace""
		//}", Encoding.UTF8, "application/json");
		//			dynamic jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);

		//			if (typeof(T) == typeof(string))
		//			{
		//				return jsonData;
		//			}
		//			// Convert to .NET class and populate the properties of the model objects,
		//			// and then populate the IEnumerable object and return it.
		//			JObject jsonArray = jsonData;
		//			return JsonConvert.DeserializeObject<T>(jsonArray.ToString());
		//		}

		public static async Task<OneDriveItem> PostEmptyFile(string itemPath, string accessToken, string fileName)
		{
			System.Net.Http.StringContent content = new StringContent($"{{\"name\":\"{fileName}\", " +
				$"\"file\":{{}}," +
				$"\"@microsoft.graph.conflictBehavior\": \"replace\"}}", Encoding.UTF8, "application/json");


			string jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);


			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			//	JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<OneDriveItem>(jsonData);
		}

		public static async Task<FileUploadSession> PostUploadSession(string itemPath, string accessToken, string fileName)
		{
			System.Net.Http.StringContent content = new StringContent(@"{
  ""item"": {
    ""@microsoft.graph.conflictBehavior"": ""replace""

  }
}", Encoding.UTF8, "application/json");

			string jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);


			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			//	JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<FileUploadSession>(jsonData);
		}

		public static async Task<OneDriveItem> PostFile(string itemPath, string accessToken, string filePath) 
		{
			string jsonData = null;
			using (var fileStream = File.OpenRead(filePath))
			{
				int blockSize = 10000000;

				long startAt = 0;
				while (startAt < fileStream.Length)
				{
					byte[] data = new byte[blockSize];
				//	atEnd = fileStream.Read(data, 0, blockSize) < blockSize;

					int bytesRead = fileStream.Read(data, 0, blockSize);

					byte[] newData = new byte[bytesRead];

					Array.Copy(data, newData, bytesRead);

					System.Net.Http.ByteArrayContent content = new ByteArrayContent(newData);
					//	content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(filePath));
					content.Headers.ContentRange = new ContentRangeHeaderValue(startAt, (startAt + bytesRead)-1, fileStream.Length) { Unit = "bytes" };
					content.Headers.ContentLength = fileStream.Length;

					jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);

					startAt += bytesRead;

				}

				
			}
			return JsonConvert.DeserializeObject<OneDriveItem>(jsonData);
		}



		public static async Task<T> PostFolder<T>(string itemPath, string accessToken) where T : class
		{

			System.Net.Http.StringContent content = new StringContent(@"{
  ""name"": ""Content Manager Documents"",
""folder"": { },
""@microsoft.graph.conflictBehavior"": ""replace""
}", Encoding.UTF8, "application/json");
			string jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);

			if (typeof(T) == typeof(string))
			{
				return jsonData as T;
			}
			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
		//	JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<T>(jsonData);
		}

		/// <summary>
		/// Gets any JSON array from any OData endpoint that requires an access token.
		/// </summary>
		/// <typeparam name="T">The .NET type to which the members of the array will be converted.</typeparam>
		/// <param name="itemsUrl">The URL of the OData endpoint.</param>
		/// <param name="accessToken">An OAuth access token.</param>
		/// <returns>Collection of T items that the caller can cast to any IEnumerable type.</returns>
		public static async Task<T> GetItem<T>(string itemPath, string accessToken, string tempPath) where T : class
		{
			string jsonData = await SendRequestWithAccessToken(itemPath, accessToken, tempPath: tempPath);

			if (typeof(T) == typeof(string))
			{
				return jsonData as T;
			}
			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			//JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<T>(jsonData);
		}

		public static async Task<bool> IsLocked(string itemPath, string itemName, string accessToken)
		{
			StringContent content = new StringContent("{\"name\":\"$" + itemName + "\"}", Encoding.UTF8, "application/json");
			try
			{
				
				 await SendRequestWithAccessToken(itemPath, accessToken, requestContent:content, method: HttpMethod.Put);
			}
			catch (HttpListenerException ex)
			{
				if (ex.ErrorCode == 423)
				{
					return true;
				}
			}

			content = new StringContent("{\"name\":\"" + itemName + "\"}", Encoding.UTF8, "application/json");
			await SendRequestWithAccessToken(itemPath, accessToken, requestContent: content, method: HttpMethod.Put);

			return false;
		}


		public static async Task<FileData> DownloadFileAsync(string requestUri, string accessToken)
		{
			var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
			if (!string.IsNullOrEmpty(accessToken))
			{
				requestMessage.Headers.TryAddWithoutValidation("Authorization", "Bearer " + accessToken);
			}
			using (var httpClient = new HttpClient())
			{
				var responseMessage = await httpClient.SendAsync(requestMessage);
				responseMessage.EnsureSuccessStatusCode();

				var output = new FileData();
				output.Content = await responseMessage.Content.ReadAsStringAsync();
				output.Filename = responseMessage.Content.Headers.ContentDisposition.FileNameStar;
				return output;
			}
		}


		/// <summary>
		/// Gets any JSON array from any OData endpoint that requires an access token.
		/// </summary>
		/// <typeparam name="T">The .NET type to which the members of the array will be converted.</typeparam>
		/// <param name="itemsUrl">The URL of the OData endpoint.</param>
		/// <param name="accessToken">An OAuth access token.</param>
		/// <returns>Collection of T items that the caller can cast to any IEnumerable type.</returns>
		//internal static async Task<IEnumerable<T>> GetItems<T>(string itemsUrl, string accessToken)
		//{
		//	string jsonData = await SendRequestWithAccessToken(itemsUrl, accessToken);

		//	// Convert to .NET class and populate the properties of the model objects,
		//	// and then populate the IEnumerable object and return it.
		//	JArray jsonArray = jsonData.value;
		//	return JsonConvert.DeserializeObject<IEnumerable<T>>(jsonArray.ToString());
		//}

		/// <summary>
		/// Sends a request to the specified OData URL with the specified access token.
		/// </summary>
		/// <param name="itemsUrl">The OData endpoint URL.</param>
		/// <param name="accessToken">The access token for the endpoint resource.</param>
		/// <returns></returns>
		public static async Task<string> SendRequestWithAccessToken(string itemsUrl, string accessToken, HttpContent requestContent = null, string tempPath = null, HttpMethod method = null)
		{
			dynamic jsonData = null;

			var httpClientHandler = new HttpClientHandler
			{
			//	Proxy = new WebProxy("http://localhost:8888", false),
			//	UseProxy = true
			};

			using (var client = new HttpClient(httpClientHandler))
			{

				if (method == null)
				{
					method = HttpMethod.Get;

					if (requestContent is StringContent)
					{
						method = HttpMethod.Post;
					}
					else if (requestContent is StreamContent || requestContent is ByteArrayContent || requestContent is StringContent)
					{
						method = HttpMethod.Put;
					}
				}

				// Create and send the HTTP Request
				using (var request = new HttpRequestMessage(method, itemsUrl))
				{
					request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
					
					if (requestContent != null)
					{
						request.Content = requestContent;						
					}

					using (HttpResponseMessage response = await client.SendAsync(request))
					{
						if (response.IsSuccessStatusCode)
						{
							HttpContent content = response.Content;

							if ( new string[] { "/content", "/$value" }.Any(s =>  itemsUrl.IndexOf(s, StringComparison.InvariantCultureIgnoreCase) > -1) && method == HttpMethod.Get)
							{
								//string filePath = Path.ChangeExtension(Path.GetTempFileName(), "docx");
									var contentStream = await content.ReadAsStreamAsync(); // get the actual content stream
								using (var file = System.IO.File.Create(tempPath))
								{
									contentStream.CopyTo(file);
								}
								jsonData = tempPath;// File(contentStream, content_type, filename);
							} else { 
								jsonData = await content.ReadAsStringAsync();

							//	jsonData = JsonConvert.DeserializeObject(responseContent);
							} 
						} else
						{
							string message = "";
							try
							{
								HttpContent content = response.Content;
								string responseContent = await content.ReadAsStringAsync();

								JObject errorData = JsonConvert.DeserializeObject(responseContent) as JObject;

								JObject j1 = errorData.GetValue("error") as JObject;

								message = j1.GetValue("message").ToString();

								
							}
							catch
							{
								message = response.StatusCode.ToString();
							}
							throw new System.Net.HttpListenerException((int)response.StatusCode, message);
						}
					}
				}
			}
			return jsonData;
		}

		public static async Task<dynamic> DeleteWithToken(string itemsUrl, string accessToken)
		{
			dynamic jsonData = null;
			using (var client = new HttpClient())
			{
				// Create and send the HTTP Request
				using (var request = new HttpRequestMessage(HttpMethod.Delete, itemsUrl))
				{

					request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
					using (HttpResponseMessage response = await client.SendAsync(request))
					{
						if (!response.IsSuccessStatusCode)
						{
							Console.WriteLine(response.StatusCode);
							throw new System.Net.HttpListenerException((int)response.StatusCode);
						}
					}
				}
			}
			return jsonData;
		}

		//internal static async Task<dynamic> PostRequestWithAccessToken(string itemsUrl, string accessToken, string json)
		//{
		//	dynamic jsonData = null;

		//	using (var client = new HttpClient())
		//	{
		//		// Create and send the HTTP Request
		//		using (var request = new HttpRequestMessage(HttpMethod.Post, itemsUrl))
		//		{
		//			request.Content = new System.Net.Http.StringContent()
		//			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

		//			using (HttpResponseMessage response = await client.SendAsync(request))
		//			{
		//				if (response.IsSuccessStatusCode)
		//				{
		//					HttpContent content = response.Content;
		//					string responseContent = await content.ReadAsStringAsync();

		//					jsonData = JsonConvert.DeserializeObject(responseContent);
		//				}
		//				else if (response.StatusCode == System.Net.HttpStatusCode.Redirect)
		//				{
		//					return response.Headers.GetValues("Location").First();
		//				}
		//			}
		//		}
		//	}
		//	return jsonData;
		//}
	}
}
