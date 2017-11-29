using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HP.HPTRIM.ServiceModel;

[assembly: Xamarin.Forms.Dependency(typeof(TrimBrowser4.TrimDataStore))]
namespace TrimBrowser4
{
    public class TrimDataStore : IDataStore<Item>
    {
        List<Item> items;

        public TrimDataStore()
        {
            items = new List<Item>();
            //var mockItems = new List<Item>
            //{
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "First item", Description="This is an item description." },
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "Second item", Description="This is an item description." },
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "Third item", Description="This is an item description." },
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "Fourth item", Description="This is an item description." },
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "Fifth item", Description="This is an item description." },
            //    new Item { Id = Guid.NewGuid().ToString(), Text = "Sixth item", Description="This is an item description." },
            //};

            //foreach (var item in mockItems)
            //{
            //    items.Add(item);
            //}


            ServiceStack.JsonServiceClient client = new ServiceStack.JsonServiceClient("http://192.168.0.19/ServiceAPI");
            client.UserName = "itu_tadmin";
            client.Password = "Trim@HP1";
            client.AlwaysSendBasicAuthHeader = true;


            Records request = new Records();
            request.q = "unkAll";
            request.Properties = new List<string>() { "Title", "Number" };


            RecordsResponse response = client.Get<RecordsResponse>(request);

            if (response.Results != null && response.Results.Count > 0)
            {
                foreach (Record record in response.Results)
                {
                    items.Add(new Item { Id = record.Uri.ToString(), Text = record.Number, Description = record.Title });
                }
                

            }
        }

        public async Task<bool> AddItemAsync(Item item)
        {
            items.Add(item);

            return await Task.FromResult(true);
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

        public async Task<IEnumerable<Item>> GetItemsAsync(bool forceRefresh = false)
        {
            return await Task.FromResult(items);
        }
    }
}
