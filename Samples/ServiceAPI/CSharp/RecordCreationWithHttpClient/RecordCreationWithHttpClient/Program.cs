using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace RecordCreationWithHttpClient
{
	class Program
	{
		static void Main(string[] args)
		{

			using (var handler = new HttpClientHandler { UseDefaultCredentials = true })
			{
				HttpClient httpClient = new HttpClient(handler);
				httpClient.DefaultRequestHeaders.Add("Accept", "application/json"); //tell the ServiceAPI we want a JSON response

				httpClient.BaseAddress = new Uri("http://localhost/ServiceAPI/");

				// send some JSON and tell the request it is JSON via the mediaType parameter
				var content = new System.Net.Http.StringContent("{\"RecordRecordType\":{\"Uri\":2}, \"RecordTypedTitle\":\"Test Record\"}", Encoding.UTF8, "application/json");


				HttpResponseMessage response = null;
				string responseJson = null;

				// run some async code inside a non-async method
				Task.Run(async () =>
				{
					response = await httpClient.PostAsync("Record", content);
					responseJson = await response.Content.ReadAsStringAsync();


				}).GetAwaiter().GetResult();

				Console.WriteLine(responseJson);
			}
		}
	}
}
