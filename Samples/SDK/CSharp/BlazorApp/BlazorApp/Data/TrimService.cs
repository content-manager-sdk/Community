using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HP.HPTRIM.SDK;


namespace BlazorApp.Data
{

	public class RecordSearch : IEnumerable<Record>, IDisposable
	{
		Database database;
		private string _query;
		private const int PAGE_SIZE = 20;
		private int skipCount = 0;
		private long limitOnRowsReturned = PAGE_SIZE;

		TrimMainObjectSearch search;

		public RecordSearch(string name, string query)
		{

			database = new Database();
			database.TrustedUser = name;
			database.WorkgroupServerName = "local";
			database.Connect();

			_query = query;
		}
		public void Dispose()
		{
			if (database != null)
			{
				database.Dispose();
			}
		}

		public IEnumerator<Record> GetEnumerator()
		{
			search = new TrimMainObjectSearch(database, BaseObjectTypes.Record);
			search.SetSearchString(_query);
			search.PagingMode = true;
			search.LimitOnRowsReturned = limitOnRowsReturned;
			search.SkipCount = skipCount;

			foreach (Record record in search)
			{
				yield return record;
			}

		}



		public void NextPage()
		{
			limitOnRowsReturned += PAGE_SIZE;
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			throw new NotImplementedException();
		}
	}

	public class TrimService
	{
		public Task<RecordSearch> GetRecordSearchAsync(string name, string query, int skipCount = 0)
		{
			return Task.FromResult(new RecordSearch(name, query));
		}
	}
}
