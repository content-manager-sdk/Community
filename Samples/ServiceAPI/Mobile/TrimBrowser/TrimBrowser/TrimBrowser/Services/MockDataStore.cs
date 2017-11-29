using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HP.HPTRIM.ServiceModel;
using System.IO;
using System.Net.Http;
using ServiceStack;
using System.Net;

[assembly: Xamarin.Forms.Dependency(typeof(TrimBrowser4.MockDataStore))]
namespace TrimBrowser4
{
    public class MockDataStore : IDataStore<Item>
    {
        private const string SERVICEAPI_URL = "http://192.168.91.1/ServiceAPI";
        private const string SERVICEAPI_USERNAME = "itu_tadmin";
        private const string SERVICEAPI_PASSWORD = "Trim@HP1";


        List<Item> items;

        public MockDataStore()
        {

        }

        private int startAt = 1;
        private bool hasMoreItems = true;

        private static List<string> recordProperties = new List<string>() { "Title", "Number", "Extension" };

        private string previousSearch = null;
        private void doSearch(string searchText)
        {
            if (previousSearch != searchText)
            {
                startAt = 1;
                hasMoreItems = true;
            }
            if (hasMoreItems)
            {
                items = new List<Item>();


                var client = getClient();

                Records request = new Records();
                request.q = searchText;
                request.start = startAt;
                request.Properties = recordProperties;


                RecordsResponse response = client.Get<RecordsResponse>(request);



                if (response.Results != null && response.Results.Count > 0)
                {
                    startAt = startAt + response.Results.Count;
                    hasMoreItems = response.HasMoreItems;

                    foreach (Record record in response.Results)
                    {
                        items.Add(new Item(record));
                    }

                }
            }
        }


        private ServiceStack.IJsonServiceClient getClient()
        {
            ServiceStack.JsonServiceClient client = new ServiceStack.JsonServiceClient(SERVICEAPI_URL);
            client.UserName = SERVICEAPI_USERNAME;
            client.Password = SERVICEAPI_PASSWORD;
            client.AlwaysSendBasicAuthHeader = true;

            return client;
        }

        public async Task<Item> AddItemAsync(Item item)
        {

            var client = getClient();

            UploadFileResponse uploadResponse = null;
            if (!string.IsNullOrWhiteSpace(item.File))
            {
                using (var stream = File.OpenRead(item.File))
                {
                    uploadResponse = client.PostFile<UploadFileResponse>("UploadFile", stream, Path.GetFileName(item.File), "image/jpg");
                }
            }

            Record record = new Record();
            record.RecordType = new RecordTypeRef() { Uri = 2 };
            record.Title = item.Description;
            record.Properties = recordProperties;

            record.FilePath = uploadResponse?.FilePath;

            var response = client.Post<RecordsResponse>(record);
            var newRecord = response.Results[0];
            //  items.Insert(0, new Item() { Id = newRecord.Uri.ToString(), Text = newRecord.Number, Description = newRecord.Title });

            return await Task.FromResult(new Item(newRecord));

        }

        public async Task<Stream> GetDocument(Item item)
        {
            var credentials = new NetworkCredential(SERVICEAPI_USERNAME, SERVICEAPI_PASSWORD);
            var handler = new HttpClientHandler { Credentials = credentials };
            HttpClient httpClient = new HttpClient(handler);

            return await httpClient.GetStreamAsync($"{SERVICEAPI_URL}/Record/{item.Id}/file/document");
        }

        public async Task<bool> UpdateItemAsync(Item item)
        {
            var _item = items.Where((Item arg) => arg.Id == item.Id).FirstOrDefault();
            items.Remove(_item);
            items.Add(item);

            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteItemAsync(string id)
        {
            var _item = items.Where((Item arg) => arg.Id == id).FirstOrDefault();
            items.Remove(_item);

            return await Task.FromResult(true);
        }

        public async Task<Item> GetItemAsync(string id)
        {
            return await Task.FromResult(items.FirstOrDefault(s => s.Id == id));
        }

        public async Task<IEnumerable<Item>> GetItemsAsync(string searchText, bool forceRefresh = false)
        {
            doSearch(searchText);
            return await Task.FromResult(items);
        }
    }
}
