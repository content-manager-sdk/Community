using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HP.HPTRIM.SDK;
using System.Diagnostics;
using System.Configuration;

namespace HP.HPTRIM.SDK.Samples.BulkLoading
{

	class Program
	{
		static void Main(string[] args)
		{
			try
			{
				using (Database db = new Database())
				{
					db.Id = ConfigurationManager.AppSettings["dbid"];
					//db.WorkgroupServerName = "local";
					if (db.IsValid)
					{
						// A technique for tracking non-disposed objects.  There are currently only two objects that can/need to be disposed in
						// the HP RM SDK: Database and TrimMainObjectSearch
						TrimApplication.EnableSdkLeakTracking(true);

						bulkLoaderSample loader = new bulkLoaderSample();
						loader.run(db);

						if (TrimApplication.GetSdkLeakCount() > 0)
						{
							foreach (string stackTrace in TrimApplication.GetSdkLeakStackTraces())
							{
								Trace.WriteLine(stackTrace);
							}
						}
					}
					else
					{
						Console.WriteLine("Loader database error: " + db.ErrorMessage);
					}
				}
			}
			catch (Exception exc)
			{
				Console.WriteLine("Caught exception: " + exc.Message);
			}

		}
	}
}
