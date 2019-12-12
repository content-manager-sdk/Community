using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public class BaseFileService : BaseOneDriveService
	{

		protected async Task<string> doOpenFromFileHandler(string itemUrl, string token)
		{
			UriBuilder downloadUrlBuilder = new UriBuilder(itemUrl);
			downloadUrlBuilder.Path += "/content";

			string url = downloadUrlBuilder.ToString();

			var result = await ODataHelper.DownloadFileAsync(url, token);
			//var result = await ODataHelper.GetItem<string>(url, token, null);

			return result.Content;
		}

		protected async Task<long> getUriFromLinkFile(string token)
		{
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

			return uri;
		}

	}
}
