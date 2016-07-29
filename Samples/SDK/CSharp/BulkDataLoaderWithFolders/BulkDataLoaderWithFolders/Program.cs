using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples.BulkLoadingFolders
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                using (Database database = new Database())
                {
                    database.Id = ConfigurationManager.AppSettings["dbid"];
                    //db.WorkgroupServerName = "local";
                    if (database.IsValid)
                    {

                        Loader loader = new Loader(database);
                        loader.Load();

                    }
                    else
                    {
                        Console.WriteLine("Loader database error: " + database.ErrorMessage);
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
