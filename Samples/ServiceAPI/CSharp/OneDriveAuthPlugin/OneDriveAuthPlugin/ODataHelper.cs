using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OneDriveAuthPlugin
{
	internal static class ODataHelper
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

		internal static async Task<T> PostFile<T>(string itemPath, string accessToken, string filePath)
		{
			using (var fileStream = File.OpenRead(filePath))
			{
				System.Net.Http.StreamContent content = new StreamContent(fileStream);
				content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(filePath));

				dynamic jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);

				if (typeof(T) == typeof(string))
				{
					return jsonData;
				}
				// Convert to .NET class and populate the properties of the model objects,
				// and then populate the IEnumerable object and return it.
				JObject jsonArray = jsonData;
				return JsonConvert.DeserializeObject<T>(jsonArray.ToString());
			}
		}

		internal static async Task<T> PostFolder<T>(string itemPath, string accessToken)
		{

			System.Net.Http.StringContent content = new StringContent(@"{
  ""name"": ""Content Manager Documents"",
  ""folder"": { },
  ""@microsoft.graph.conflictBehavior"": ""replace""
}", Encoding.UTF8, "application/json");
			dynamic jsonData = await SendRequestWithAccessToken(itemPath, accessToken, content);

			if (typeof(T) == typeof(string))
			{
				return jsonData;
			}
			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<T>(jsonArray.ToString());
		}

		/// <summary>
		/// Gets any JSON array from any OData endpoint that requires an access token.
		/// </summary>
		/// <typeparam name="T">The .NET type to which the members of the array will be converted.</typeparam>
		/// <param name="itemsUrl">The URL of the OData endpoint.</param>
		/// <param name="accessToken">An OAuth access token.</param>
		/// <returns>Collection of T items that the caller can cast to any IEnumerable type.</returns>
		internal static async Task<T> GetItem<T>(string itemPath, string accessToken, string tempPath)
		{
			dynamic jsonData = await SendRequestWithAccessToken(itemPath, accessToken, tempPath: tempPath);

			if (typeof(T) == typeof(string))
			{
				return jsonData;
			}
			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			JObject jsonArray = jsonData;
			return JsonConvert.DeserializeObject<T>(jsonArray.ToString());
		}


		/// <summary>
		/// Gets any JSON array from any OData endpoint that requires an access token.
		/// </summary>
		/// <typeparam name="T">The .NET type to which the members of the array will be converted.</typeparam>
		/// <param name="itemsUrl">The URL of the OData endpoint.</param>
		/// <param name="accessToken">An OAuth access token.</param>
		/// <returns>Collection of T items that the caller can cast to any IEnumerable type.</returns>
		internal static async Task<IEnumerable<T>> GetItems<T>(string itemsUrl, string accessToken)
		{
			dynamic jsonData = await SendRequestWithAccessToken(itemsUrl, accessToken);

			// Convert to .NET class and populate the properties of the model objects,
			// and then populate the IEnumerable object and return it.
			JArray jsonArray = jsonData.value;
			return JsonConvert.DeserializeObject<IEnumerable<T>>(jsonArray.ToString());
		}

		/// <summary>
		/// Sends a request to the specified OData URL with the specified access token.
		/// </summary>
		/// <param name="itemsUrl">The OData endpoint URL.</param>
		/// <param name="accessToken">The access token for the endpoint resource.</param>
		/// <returns></returns>
		internal static async Task<dynamic> SendRequestWithAccessToken(string itemsUrl, string accessToken, HttpContent requestContent = null, string tempPath = null)
		{
			dynamic jsonData = null;

			using (var client = new HttpClient())
			{
				HttpMethod method = HttpMethod.Get;
				
				if (requestContent is StringContent)
				{
					method = HttpMethod.Post;
				}

				if (requestContent is StreamContent)
				{
					method = HttpMethod.Put;
				}

				// Create and send the HTTP Request
				using (var request = new HttpRequestMessage(method, itemsUrl))
				{
					request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
					
					if (requestContent != null)
					{
						//request.Headers.Add("Content-type", "application/json");
						request.Content = requestContent;
						
					}

					using (HttpResponseMessage response = await client.SendAsync(request))
					{
						if (response.IsSuccessStatusCode)
						{
							HttpContent content = response.Content;

							if (itemsUrl.EndsWith("content") && method == HttpMethod.Get)
							{
								//string filePath = Path.ChangeExtension(Path.GetTempFileName(), "docx");
									var contentStream = await content.ReadAsStreamAsync(); // get the actual content stream
								using (var file = System.IO.File.Create(tempPath))
								{
									contentStream.CopyTo(file);
								}
								return tempPath;// File(contentStream, content_type, filename);
							} else { 
								string responseContent = await content.ReadAsStringAsync();

								jsonData = JsonConvert.DeserializeObject(responseContent);
							} 
						} 
					}
				}
			}
			return jsonData;
		}

		internal static async Task<dynamic> DeleteWithToken(string itemsUrl, string accessToken)
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
							throw new HttpError(response.StatusCode);
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
