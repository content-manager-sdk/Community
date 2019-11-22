using HP.HPTRIM.SDK;
using OneDriveConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveSync
{
	public class TrimHelper : IDisposable
	{

		static TrimHelper()
		{
			TrimApplication.TrimBinariesLoadPath = System.Configuration.ConfigurationManager.AppSettings["trimPath"];
			TrimApplication.SetAsWebService(System.Configuration.ConfigurationManager.AppSettings["workPath"]);
			TrimApplication.Initialize();

			Database.AllowAccessFromMultipleThreads = true;
		}
		Database database;

		public TrimHelper()
		{
			string dbid = System.Configuration.ConfigurationManager.AppSettings["dbid"];

			database = new Database();
			database.Id = dbid;
			database.WorkgroupServerName = "local";
			database.TrustedUser = "TRIMSERVICES";
			database.Connect();
		}


		private Database getDatabaseForUser(string user)
		{
			string dbid = System.Configuration.ConfigurationManager.AppSettings["dbid"];

			database = new Database();
			database.Id = dbid;
			database.WorkgroupServerName = "local";
			database.TrustedUser = "user";
			database.Connect();

			return database;
		}

		public IEnumerable<OneDriveDocument> GetDeleteableDocuments()
		{
			TrimMainObjectSearch search = new TrimMainObjectSearch(database, BaseObjectTypes.Record);
			search.AddDeleteNowSearchClause();

			Console.WriteLine($"Found records: {search.FastCount}");

			foreach (Record record in search)
			{
				yield return new OneDriveDocument() { Id = record.GetDriveId(), LinkFileName = record.GetFileName("trim"), Uri = record.Uri, DateModified = record.DateModified };
			}
		}


		public void Dispose()
		{
			if (database != null)
			{
				database.Dispose();
				database = null;
			}
		}

		internal void ResetDeleteNow(OneDriveDocument doc)
		{
			Record record = new Record(database, doc.Uri);
			record.SetDeleteNow(false);
			record.Save();
		}

		internal void ClearDriveId(OneDriveDocument doc)
		{
			Record record = new Record(database, doc.Uri);
			record.SetDriveId("");
			record.Save();
		}

		internal void CheckinFromDrive(OneDriveDocument doc, string token)
		{
			Record record = new Record(database, doc.Uri);

			if (record.IsCheckedOut)
			{
				Database userDatabase = getDatabaseForUser(record.CheckedOutTo.LogsInAs);
				record = new Record(userDatabase, doc.Uri);
			}

			var result = record.CheckinFromDrive(doc.Id, token, true);
			result.Wait();

			record.Save();
		}
	}
}
