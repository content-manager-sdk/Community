using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HP.HPTRIM.ServiceModel;
using System.IO;
using System.Net.Http;
using ServiceStack;
using System.Net;

[assembly: Xamarin.Forms.Dependency(typeof(TrimBrowser.MockDataStore))]
namespace TrimBrowser
{
    public class MockDataStore : IDataStore<Item>
    {
        private const string SERVICEAPI_URL = "http://192.168.91.1/ServiceAPI";
        private LoginDetails _loginDetails;


                List<Item> items = new List<Item>();

        public MockDataStore()
        {

        }

        private int startAt = 1;
        private bool hasMoreItems = true;

        private static List<string> recordProperties = new List<string>() { "Title", "Number", "Extension" };

        private string previousSearch = null;
        private void doSearch(string searchText)
        {
            items.Clear();

            if (previousSearch != searchText)
            {
                startAt = 1;
                hasMoreItems = true;
                previousSearch = searchText;
            }
            if (hasMoreItems)
            {             
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
                client.UserName = _loginDetails.Name;
                client.Password = _loginDetails.Password;
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

            var response = await client.PostAsync<RecordsResponse>( record);
            var newRecord = response.Results[0];
            items.Insert(0, new Item() { Id = newRecord.Uri.ToString(), Text = newRecord.Number, Description = newRecord.Title });

            return await Task.FromResult(new Item(newRecord));

        }

        public async Task<Stream> GetDocument(Item item)
        {
            var credentials = new NetworkCredential(_loginDetails.Name, _loginDetails.Password);
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

        public async Task<IEnumerable<SearchClauseDef>> GetSearchShortcuts()
        {
            var client = getClient();

            SearchClauseDefDetails clauseDetails = new SearchClauseDefDetails() { TrimType = BaseObjectTypes.Record };

            var response = client.Get<SearchClauseDefDetailsResponse>(clauseDetails);

            var selectedIds = new SearchClauseIds[] { SearchClauseIds.Favorite, SearchClauseIds.RecordMyContainers, SearchClauseIds.RecordMyDocuments };

            var selectedClauses = response.SearchClauseDefs.Where(sc => selectedIds.Any(sid => sc.Id == sid));


            return await Task.FromResult(selectedClauses);
        }

        public void Login(LoginDetails loginDetails)
        {
            _loginDetails = loginDetails;
        }

        public bool IsAuthenticated()
        {
            return _loginDetails != null;
        }
    }
}
