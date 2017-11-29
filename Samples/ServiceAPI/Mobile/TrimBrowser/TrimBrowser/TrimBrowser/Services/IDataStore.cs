using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace TrimBrowser4
{
	public interface IDataStore<T>
	{
		Task<Item> AddItemAsync(T item);
		Task<bool> UpdateItemAsync(T item);
        Task<bool> DeleteItemAsync(string id);
		Task<T> GetItemAsync(string id);
		Task<IEnumerable<T>> GetItemsAsync(string searchText, bool forceRefresh = false);
        Task<Stream> GetDocument(Item item);


    }
}
